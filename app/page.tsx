'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const API_URL =
  'https://script.google.com/macros/s/AKfycbzQLbAOH-fVOQqQFiKg-kU9r7bf5sv0V8GSzDo4UAiD4d0dP3_l0rxPhK5_4BKregA/exec';


type RegistroApi = {
  ID_BIOVITAL: string;
  Anio: number | string;
  Predio: string;
  Compromiso_Ambiental: string;
  Contrato_EECC: string;
  Especie: string;
  Plantas_Plantadas: number;
  Plantas_Vivas_Censo: number;
  Plantas_Reponer: number;
  Prendimiento_Porc: number;
};

type Registro = {
  id: string;
  anio: string;
  predio: string;
  compromiso: string;
  eecc: string;
  especie: string;
  estado: string;
  censos: number;
  vivos: number;
  muertos: number;
  avance: number;
};

type Kpis = {
  Total_Registros?: number;
  Total_Especies?: number;
  Total_Plantadas?: number;
  Total_Vivas?: number;
  Prendimiento_Promedio?: number;
  Total_Reponer?: number;
  Total_Contratos?: number;
  Total_Predios?: number;
  Ultima_Actualizacion?: string;
};

type SemaforoRegistro = {
  Marca_Temporal?: string;
  Responsable?: string;
  Fecha?: string;
  Contrato_Compromiso: string;
  Predio: string;
  Estado_Censo: string;
  Estado_Informe: string;
  Revision_ITO: string;
  Observacion_Clave?: string;
  Carga_BioVital: string;
  Semaforo: string;
  Estado_Global: string;
};

type SemaforoResumen = {
  total: number;
  critico: number;
  medio: number;
  bajo: number;
};

type SemaforoData = {
  resumen: SemaforoResumen;
  registros: SemaforoRegistro[];
};

const formato = (n: number) => new Intl.NumberFormat('es-CL').format(Math.round(n || 0));

const pct = (n: number) => {
  const value = n <= 1 ? n * 100 : n;
  return `${value.toFixed(1).replace('.', ',')}%`;
};

function clasificarEstado(avance: number) {
  if (avance >= 85) return 'Operativo';
  if (avance >= 50) return 'Seguimiento';
  return 'Crítico';
}
function esEjecutado(valor?: string) {
  return String(valor || '').toLowerCase().includes('ejecutado');
}

function clasificarEtapaGestion(r: SemaforoRegistro) {
  const estados = [
    r.Estado_Censo,
    r.Estado_Informe,
    r.Revision_ITO,
    r.Carga_BioVital,
  ].map((v) => String(v || '').toLowerCase());

  if (estados.every((v) => v.includes('ejecutado'))) return 'Completados';
  if (estados.some((v) => v.includes('ejecución') || v.includes('elaboración'))) return 'En ejecución';
  if (estados.some((v) => v.includes('pendiente'))) return 'Pendientes';

  return 'Pendientes';
}
export default function Home() {
  const [anio, setAnio] = useState('Todos');
const [predio, setPredio] = useState('Todos');
  const [compromiso, setCompromiso] = useState('Todos');
const [eecc, setEecc] = useState('Todos');
const [etapa, setEtapa] = useState('Todos');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [kpis, setKpis] = useState<Kpis>({});
  const [semaforo, setSemaforo] = useState<SemaforoData>({
    resumen: { total: 0, critico: 0, medio: 0, bajo: 0 },
    registros: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [kpiRes, regRes, semRes] = await Promise.all([
          fetch(`${API_URL}?view=kpis`, { cache: 'no-store' }),
          fetch(`${API_URL}?view=registros`, { cache: 'no-store' }),
          fetch(`${API_URL}?view=semaforo`, { cache: 'no-store' }),
        ]);

        const kpiJson = await kpiRes.json();
        const regJson = await regRes.json();
        const semJson = await semRes.json();

        setKpis(kpiJson.data || {});
        setSemaforo(semJson.data || {
          resumen: { total: 0, critico: 0, medio: 0, bajo: 0 },
          registros: [],
        });

        const normalizados: Registro[] = (regJson.data || []).map((r: RegistroApi) => {
          const avance = Math.max(0, Math.min(100, Number(r.Prendimiento_Porc || 0)));

          return {
            id: r.ID_BIOVITAL || 'SIN-ID',
            anio: String(r.Anio || ''),
            predio: r.Predio || 'Sin predio',
            compromiso: r.Compromiso_Ambiental || 'Sin compromiso',
            eecc: r.Contrato_EECC || 'Sin EECC',
            especie: r.Especie || 'Sin especie',
            estado: clasificarEstado(avance),
            censos: 1,
            vivos: Number(r.Plantas_Vivas_Censo || 0),
            muertos: Number(r.Plantas_Reponer || 0),
            avance,
          };
        });

        setRegistros(normalizados);
      } catch (error) {
        console.error('Error cargando BIOVITAL:', error);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const unique = (key: keyof Registro) => [
    'Todos',
    ...Array.from(new Set(registros.map((r) => String(r[key])).filter(Boolean))),
  ];

  const filtrados = useMemo(() => {
  return registros.filter((r) => {
    const etapaRegistro =
      r.estado === 'Operativo'
        ? 'Completados'
        : r.estado === 'Seguimiento'
        ? 'En proceso'
        : 'Requieren gestión';

    return (
      (anio === 'Todos' || r.anio === anio) &&
      (predio === 'Todos' || r.predio === predio) &&
      (eecc === 'Todos' || r.eecc === eecc) &&
      true
    );
  });
}, [registros, anio, predio, eecc, etapa]);

  const totalCensos = filtrados.length;
  const totalVivos = filtrados.reduce((a, b) => a + b.vivos, 0);
  const totalMuertos = filtrados.reduce((a, b) => a + b.muertos, 0);
  const avance =
    filtrados.length > 0
      ? Math.round(filtrados.reduce((a, b) => a + b.avance, 0) / filtrados.length)
      : 0;

  const operativo = filtrados.filter((r) => r.estado === 'Operativo').length;
  const seguimiento = filtrados.filter((r) => r.estado === 'Seguimiento').length;
  const critico = filtrados.filter((r) => r.estado === 'Crítico').length;

  const estadoGeneral =
    avance >= 75 ? 'CONTROLADO' : avance >= 50 ? 'EN SEGUIMIENTO' : 'CRÍTICO';

  const registrosVista = filtrados.slice(0, 6);
const compromisosGestion = useMemo(() => {
  return semaforo.registros
    .map((r) => ({
      ...r,
      etapa: clasificarEtapaGestion(r),
    }))
    .filter(
      (r) =>
        (predio === 'Todos' || r.Predio === predio) &&
        (eecc === 'Todos' || r.Contrato_Compromiso === eecc) &&
        (etapa === 'Todos' || r.etapa === etapa)
    )
    .sort((a, b) => {
      const prioridad: Record<string, number> = {
        'Carga BIOVITAL pendiente': 1,
        'Revisión ITO pendiente': 2,
        'Informe pendiente': 3,
        'Censo pendiente': 4,
        Completados: 5,
      };

      return prioridad[a.etapa] - prioridad[b.etapa];
    });
}, [semaforo.registros, predio, eecc, etapa]);
  const resumenSemaforo = semaforo.resumen;
  const estadoGestion =
    resumenSemaforo.critico > 0
      ? 'REQUIERE GESTIÓN INMEDIATA'
      : resumenSemaforo.medio > 0
      ? 'EN SEGUIMIENTO'
      : 'CONTROLADO';

  const estadoGestionClass =
    resumenSemaforo.critico > 0
      ? 'critico'
      : resumenSemaforo.medio > 0
      ? 'medio'
      : 'bajo';

  const criticosVista = semaforo.registros
    .filter((r) => r.Semaforo.includes('Crítico'))
    .slice(0, 5);

  return (
    <main className="bv-main">
      <style>{css}</style>

      <section className="bv-shell">
        <header className="bv-header">
          <div className="bv-brand">
            <div className="bv-logo-box">
              <img src="/logo-biovital.png" alt="BIOVITAL" className="bv-logo-img" />
            </div>
            <div>
              <h1>BIOVITAL</h1>
              <p>Monitoreo de biodiversidad y compromisos ambientales</p>
            </div>
          </div>

          <div className="bv-actions">
  <a className="bv-button" href="/registrar">
    <IconPlus /> Registrar
  </a>
</div>
        </header>

        <section className="bv-filters">
          <Select label="Año" value={anio} options={unique('anio')} onChange={setAnio} icon={<IconCalendar />} />
          <Select label="Predio" value={predio} options={unique('predio')} onChange={setPredio} icon={<IconPin />} />
          <Select
  label="Contrato"
  value={compromiso}
  options={unique('compromiso')}
  onChange={setCompromiso}
  icon={<IconClipboard />}
/>
          <Select label="EECC" value={eecc} options={unique('eecc')} onChange={setEecc} icon={<IconBuilding />} />
        </section>

        <section className="bv-kpis">
          <Kpi icon={<IconFile />} title="Registros" value={loading ? '...' : formato(kpis.Total_Registros || totalCensos)} />
          <Kpi icon={<IconLeaf />} title="Vivas" value={loading ? '...' : formato(kpis.Total_Vivas || totalVivos)} />
          <Kpi icon={<IconDown />} title="Reponer" value={loading ? '...' : formato(kpis.Total_Reponer || totalMuertos)} danger />
          <Kpi icon={<IconProgress />} title="Prendimiento" value={loading ? '...' : pct(kpis.Prendimiento_Promedio || avance)} />
          <Kpi icon={<IconMountain />} title="Predios" value={loading ? '...' : formato(kpis.Total_Predios || 0)} />
          <Kpi icon={<IconShield />} title="Compromisos" value={loading ? '...' : formato(kpis.Total_Contratos || 0)} />
        </section>

        <section className="bv-content">
          <div className="bv-panel">
            <div className="bv-panel-head">
              <h2><IconList /> Vista operacional</h2>
              <span>{filtrados.length} registros</span>
            </div>

            <div className="bv-list">
              {registrosVista.map((r) => (
                <article className="bv-card" key={r.id}>
                  <div className="bv-card-icon"><IconLeaf /></div>

                  <div className="bv-card-body">
                    <div className="bv-topline">
                      <div>
                        <div className="bv-id">{r.id}</div>
                        <h3>{r.especie}</h3>
                        <p>{r.predio} · {r.compromiso} · {r.eecc}</p>
                      </div>
                      <span className={`bv-status ${r.estado.toLowerCase()}`}>{r.estado}</span>
                    </div>

                    <div className="bv-progress-row">
                      <div className="bv-progress">
                        <div style={{ width: `${r.avance}%` }} />
                      </div>
                      <strong>{r.avance.toFixed(1).replace('.', ',')}%</strong>
                    </div>

                    <div className="bv-card-stats">
                      <span><IconLeafSmall /> Vivos: <b>{formato(r.vivos)}</b></span>
                      <span className="danger"><IconDownSmall /> Reponer: <b>{formato(r.muertos)}</b></span>
                      <span><IconClockSmall /> Censos: <b>{formato(r.censos)}</b></span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="bv-exec">
            <div className="bv-panel-head exec-head">
              <h2><IconChart /> Vista ejecutiva</h2>
              <span>Resumen consolidado</span>
            </div>

            <Resumen label="Registros monitoreados" value={formato(kpis.Total_Registros || totalCensos)} icon={<IconUsers />} />
            <Resumen label="Plantas vivas" value={formato(kpis.Total_Vivas || totalVivos)} icon={<IconLeaf />} />
            <Resumen label="Plantas a reponer" value={formato(kpis.Total_Reponer || totalMuertos)} icon={<IconDown />} danger />
            <Resumen label="Prendimiento promedio" value={pct(kpis.Prendimiento_Promedio || avance)} icon={<IconProgress />} />

            

             

            <div className="bv-semaforo">
  <div className="bv-semaforo-head">
    <strong><IconClipboard /> Estado de compromisos</strong>
    <span>{compromisosGestion.length} registros</span>
  </div>

  <div className="bv-gestion-table">
    <div className="bv-gestion-row bv-gestion-header">
      <span>Contrato</span>
      <span>Predio</span>
      <span>Censo</span>
      <span>Informe</span>
      <span>ITO</span>
      <span>BioVital</span>
    </div>

    {compromisosGestion.slice(0, 5).map((r) => (
      <div
        className="bv-gestion-row"
        key={`${r.Contrato_Compromiso}-${r.Predio}-${r.Fecha}`}
      >
        <span className="bv-gestion-strong">{r.Contrato_Compromiso}</span>
        <span>{r.Predio}</span>
        <EstadoBadge value={r.Estado_Censo} />
        <EstadoBadge value={r.Estado_Informe} />
        <EstadoBadge value={r.Revision_ITO} />
        <EstadoBadge value={r.Carga_BioVital} />
      </div>
    ))}
  </div>
</div>
          </aside>
        </section>

        <footer className="bv-footer">
          <div><IconLeaf /> Simple <span>Intuitivo y claro</span></div>
          <div><IconChart /> Visual <span>Información clave</span></div>
          <div><IconShield /> Confiable <span>Datos trazables</span></div>
          <div><IconCloud /> Accesible <span>Web y móvil</span></div>
          <strong><IconCheck /> Diseñado para decisiones rápidas</strong>
        </footer>

    
      </section>
    </main>
  );
}

function Select({ label, value, options, onChange, icon }: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: ReactNode;
}) {
  return (
    <label className="bv-filter">
      <span className="bv-filter-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
    </label>
  );
}

function Kpi({ icon, title, value, danger }: {
  icon: ReactNode;
  title: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bv-kpi">
      <span className="bv-iconbox">{icon}</span>
      <div>
        <small>{title}</small>
        <strong className={danger ? 'danger' : ''}>{value}</strong>
      </div>
    </div>
  );
}

function Resumen({ label, value, icon, danger }: {
  label: string;
  value: string | number;
  icon: ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="bv-summary">
      <span className="bv-iconbox">{icon}</span>
      <p>{label}</p>
      <strong className={danger ? 'danger' : ''}>{value}</strong>
    </div>
  );
}

function DistRow({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="bv-dist-row">
      <span>{label}</span>
      <div><i style={{ width: `${pct}%` }} /></div>
      <b>{value}</b>
    </div>
  );
}
function EstadoBadge({ value }: { value?: string }) {
  const estado = String(value || 'Pendiente');

  const className = esEjecutado(estado)
    ? 'ok'
    : estado.toLowerCase().includes('ejecución') ||
      estado.toLowerCase().includes('elaboración')
    ? 'medio'
    : 'pendiente';

  return (
    <span className={`bv-badge-estado ${className}`}>
      {esEjecutado(estado) ? 'OK' : estado}
    </span>
  );
}
function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function IconPlus() { return <Svg><path d="M12 5v14M5 12h14" /></Svg>; }
function IconCalendar() { return <Svg><rect x="3" y="4" width="18" height="17" rx="3" /><path d="M8 2v4M16 2v4M3 9h18" /></Svg>; }
function IconPin() { return <Svg><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></Svg>; }
function IconClipboard() { return <Svg><path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" /><path d="M9 11h6M9 15h6" /></Svg>; }
function IconBuilding() { return <Svg><path d="M4 21V5l8-3 8 3v16" /><path d="M8 9h1M8 13h1M8 17h1M15 9h1M15 13h1M15 17h1M3 21h18" /></Svg>; }
function IconFile() { return <Svg><path d="M7 3h8l4 4v14H7z" /><path d="M15 3v5h5M10 12h6M10 16h6" /></Svg>; }
function IconLeaf() { return <Svg><path d="M20 4C11 4 5 9 5 17c0 2 1 3 3 3 8 0 12-7 12-16Z" /><path d="M5 19c3-6 7-9 13-13" /></Svg>; }
function IconDown() { return <Svg><path d="M7 7l10 10M17 10v7h-7" /></Svg>; }
function IconProgress() { return <Svg><path d="M12 3v9l6 3" /><circle cx="12" cy="12" r="9" /></Svg>; }
function IconMountain() { return <Svg><path d="M3 20h18L14 6l-4 8-2-4Z" /></Svg>; }
function IconShield() { return <Svg><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="M9 12l2 2 4-5" /></Svg>; }
function IconList() { return <Svg><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Svg>; }
function IconChart() { return <Svg><path d="M3 3v18h18" /><path d="M7 16l4-5 4 3 5-8" /></Svg>; }
function IconTraffic() { return <Svg><path d="M12 2v3" /><path d="M12 19v3" /><path d="M4.9 4.9l2.1 2.1" /><path d="M17 17l2.1 2.1" /><path d="M2 12h3" /><path d="M19 12h3" /><circle cx="12" cy="12" r="4" /></Svg>; }
function IconUsers() { return <Svg><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 0 0-8M21 21v-2a4 4 0 0 0-3-3.8" /></Svg>; }
function IconClock() { return <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>; }
function IconHome() { return <Svg><path d="M3 11l9-8 9 8" /><path d="M5 10v11h14V10" /></Svg>; }
function IconMore() { return <Svg><path d="M5 12h.01M12 12h.01M19 12h.01" /></Svg>; }
function IconCloud() { return <Svg><path d="M17.5 19H8a5 5 0 1 1 1.1-9.9A7 7 0 0 1 22 12.5 4.5 4.5 0 0 1 17.5 19Z" /></Svg>; }
function IconCheck() { return <Svg><path d="M20 6L9 17l-5-5" /></Svg>; }
function IconLeafSmall() { return <span className="inline-icon"><IconLeaf /></span>; }
function IconDownSmall() { return <span className="inline-icon"><IconDown /></span>; }
function IconClockSmall() { return <span className="inline-icon"><IconClock /></span>; }

const css = `
.bv-main {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f7faf6, #eef5ec);
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #102015;
  padding: 7px;
}

.bv-shell {
  max-width: 1560px;
  height: calc(100vh - 14px);
  margin: 0 auto;
  display: grid;
  grid-template-rows: 72px 46px 50px minmax(0, 1fr) 34px;
  gap: 5px;
}

.bv-header {
  background: rgba(255,255,255,.97);
  border: 1px solid #e1eadf;
  border-radius: 15px;
  padding: 7px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 16px rgba(0,0,0,.05);
}

.bv-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bv-logo-box {
  width: 82px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.bv-logo-img {
  width: 92px;
  height: 92px;
  object-fit: contain;
}

.bv-header h1 {
  margin: 0;
  font-size: 30px;
  letter-spacing: .15px;
  color: #0b3b28;
  line-height: .92;
}

.bv-header p {
  margin: 6px 0 0;
  font-size: 13px;
  color: #53635a;
}

.bv-button {
  height: 44px;
  background: linear-gradient(135deg, #0f7a3c, #108e49);
  color: white;
  border-radius: 12px;
  padding: 0 20px;
  font-weight: 900;
  font-size: 14px;
  box-shadow: 0 5px 14px rgba(15,122,60,.18);
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.bv-button svg {
  width: 16px;
  height: 16px;
}

.bv-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bv-button-secondary {
  background: #ffffff;
  color: #0f7a3c;
  border: 1px solid #cfe8d8;
  box-shadow: 0 5px 14px rgba(0,0,0,.05);
}

.bv-filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  min-height: 0;
}

.bv-filter {
  height: 46px;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 13px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 3px 10px rgba(0,0,0,.03);
}

.bv-filter-icon,
.bv-iconbox {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #e9f6ed;
  color: #0f7a3c;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.bv-filter-icon svg,
.bv-iconbox svg {
  width: 21px;
  height: 21px;
}

.bv-filter small {
  display: block;
  color: #68766d;
  font-weight: 800;
  font-size: 10px;
  margin-bottom: 0;
}

.bv-filter select {
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  font-weight: 900;
  color: #102015;
  width: 100%;
}

.bv-kpis {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  min-height: 0;
}

.bv-kpi {
  height: 50px;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 13px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 3px 10px rgba(0,0,0,.03);
}

.bv-kpi small {
  display: block;
  font-size: 10.8px;
  color: #53635a;
  font-weight: 800;
  margin-bottom: 0;
}

.bv-kpi strong {
  display: block;
  font-size: 21px;
  color: #0f7a3c;
  line-height: 1;
}

.danger {
  color: #c84a12 !important;
}

.bv-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 1.28fr 1fr;
  gap: 8px;
  align-items: stretch;
  overflow: hidden;
}

.bv-panel,
.bv-exec {
  min-height: 0;
  background: rgba(255,255,255,.97);
  border: 1px solid #e1eadf;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 6px 18px rgba(0,0,0,.045);
}

.bv-panel {
  height: 100%;
  align-self: stretch;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
}

.bv-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.bv-panel-head h2 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.bv-panel-head h2 svg {
  width: 20px;
  height: 20px;
  color: #0f7a3c;
}

.bv-panel-head span {
  color: #53635a;
  font-size: 11.5px;
}

.bv-list {
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.bv-card {
  background: #fbfefb;
  border: 1px solid #e1eadf;
  border-radius: 15px;
  padding: 7px 10px;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 8px;
  margin-bottom: 5px;
}

.bv-card-icon {
  width: 37px;
  height: 37px;
  border-radius: 999px;
  background: #edf7ec;
  color: #0f7a3c;
  display: grid;
  place-items: center;
  box-shadow: 0 5px 12px rgba(0,0,0,.04);
}

.bv-card-icon svg {
  width: 23px;
  height: 23px;
}

.bv-topline {
  display: flex;
  justify-content: space-between;
  gap: 9px;
}

.bv-id {
  color: #0f7a3c;
  font-size: 9.5px;
  font-weight: 900;
}

.bv-card h3 {
  margin: 1px 0 1px;
  font-size: 15.5px;
  line-height: 1.05;
}

.bv-card p {
  margin: 0;
  color: #53635a;
  font-size: 11px;
}

.bv-status {
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 9.5px;
  font-weight: 900;
  background: #dff7e8;
  color: #08713a;
  height: fit-content;
  white-space: nowrap;
}

.bv-status.seguimiento {
  background: #e5f0ff;
  color: #125ea8;
}

.bv-status.planificado {
  background: #eee4ff;
  color: #6333a5;
}

.bv-progress-row {
  display: grid;
  grid-template-columns: 1fr 34px;
  align-items: center;
  gap: 7px;
  margin-top: 5px;
}

.bv-progress {
  height: 5px;
  background: #dfe8dd;
  border-radius: 999px;
  overflow: hidden;
}

.bv-progress div {
  height: 100%;
  background: linear-gradient(90deg, #0f7a3c, #2dbb6a);
  border-radius: 999px;
}

.bv-progress-row strong {
  color: #102015;
  font-size: 11.8px;
}

.bv-card-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 5px;
  font-size: 10.4px;
  color: #405247;
}

.bv-card-stats b {
  color: #0f7a3c;
}

.inline-icon {
  display: inline-block;
  width: 11px;
  height: 11px;
  vertical-align: -2px;
  margin-right: 3px;
}

.inline-icon svg {
  width: 11px;
  height: 11px;
}

.bv-exec {
  height: 100%;
  background: linear-gradient(145deg, #f8fff8, #edf7ed);
  display: grid;
  grid-template-rows: 24px repeat(4, 34px) minmax(0, 1fr);
  gap: 4px;
  align-self: stretch;
  overflow: hidden;
}

.exec-head {
  margin-bottom: 0;
}

.bv-summary {
  height: 34px;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 13px;
  display: grid;
  grid-template-columns: 30px 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 5px 9px;
  box-shadow: 0 4px 12px rgba(0,0,0,.035);
}

.bv-summary .bv-iconbox {
  width: 25px;
  height: 25px;
  border-radius: 10px;
}

.bv-summary .bv-iconbox svg {
  width: 17px;
  height: 17px;
}

.bv-summary p {
  margin: 0;
  font-weight: 800;
  font-size: 11px;
}

.bv-summary strong {
  color: #0f7a3c;
  font-size: 15px;
}

.bv-state {
  background: linear-gradient(135deg, #e1f2e4, #f8fff8);
  border-radius: 14px;
  padding: 6px 10px;
  border: 1px solid #dceee2;
  display: grid;
  grid-template-columns: 1fr 38px;
  align-items: center;
  gap: 7px;
}

.bv-state small {
  color: #0f7a3c;
  font-weight: 900;
  font-size: 9.8px;
}

.bv-state h3 {
  margin: 1px 0 1px;
  font-size: 15px;
  color: #0f7a3c;
  line-height: 1;
}

.bv-state p {
  margin: 0;
  color: #405247;
  font-size: 9px;
  line-height: 1.05;
}

.bv-state-icon {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  display: grid;
  place-items: center;
  color: #0f7a3c;
}

.bv-state-icon svg {
  width: 23px;
  height: 23px;
}

.bv-distribution {
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 14px;
  padding: 6px 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,.03);
  overflow: hidden;
  flex: 0 0 auto;
}

.bv-dist-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.bv-dist-head strong {
  font-size: 11.5px;
  color: #102015;
}

.bv-dist-head span {
  font-size: 9.5px;
  color: #68766d;
}

.bv-dist-row {
  display: grid;
  grid-template-columns: 70px 1fr 15px;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
  font-size: 9.4px;
  color: #405247;
}

.bv-dist-row div {
  height: 4px;
  background: #dfe8dd;
  border-radius: 999px;
  overflow: hidden;
}

.bv-dist-row i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #0f7a3c, #2dbb6a);
  border-radius: 999px;
}

.bv-dist-row b {
  color: #0f7a3c;
}

.bv-semaforo {
  height: 100%;
  min-height: 0;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 14px;
  padding: 5px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,.03);
  overflow: hidden;
}

.bv-semaforo-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
}

.bv-semaforo-head strong {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #102015;
}

.bv-semaforo-head svg {
  width: 15px;
  height: 15px;
  color: #0f7a3c;
}

.bv-semaforo-head span {
  font-size: 9.5px;
  color: #68766d;
}

.bv-semaforo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-bottom: 3px;
}

.bv-semaforo-grid div {
  border-radius: 9px;
  padding: 3px 5px;
  background: #f7faf6;
  border: 1px solid #e1eadf;
}

.bv-semaforo-grid small {
  display: block;
  font-size: 8px;
  color: #68766d;
  font-weight: 800;
}

.bv-semaforo-grid b {
  font-size: 13px;
  line-height: 1;
}

.bv-semaforo-grid .critico b { color: #c84a12; }
.bv-semaforo-grid .medio b { color: #b7791f; }
.bv-semaforo-grid .bajo b { color: #0f7a3c; }

.bv-gestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 9px;
  padding: 3px 6px;
  margin-bottom: 3px;
  background: #f7faf6;
  border: 1px solid #e1eadf;
}

.bv-gestion small {
  font-size: 8px;
  color: #68766d;
  font-weight: 900;
}

.bv-gestion strong {
  font-size: 9px;
  line-height: 1;
}

.bv-gestion.critico strong { color: #c84a12; }
.bv-gestion.medio strong { color: #b7791f; }
.bv-gestion.bajo strong { color: #0f7a3c; }

.bv-critical-list {
  display: grid;
  gap: 2px;
  max-height: 18px;
  overflow: hidden;
  padding-right: 3px;
}

.bv-critical-list div {
  display: grid;
  grid-template-columns: 66px 1fr;
  gap: 5px;
  align-items: center;
  font-size: 8.6px;
  color: #405247;
}

.bv-critical-list span {
  color: #c84a12;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-critical-list small {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #68766d;
}

.bv-footer {
  display: grid;
  grid-template-columns: repeat(4, 1fr) 1.5fr;
  gap: 6px;
  align-items: center;
}

.bv-footer div,
.bv-footer strong {
  height: 34px;
  border-radius: 13px;
  background: rgba(255,255,255,.86);
  border: 1px solid #e1eadf;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  font-size: 11px;
  color: #102015;
  box-shadow: 0 3px 10px rgba(0,0,0,.03);
}

.bv-footer svg {
  width: 17px;
  height: 17px;
  color: #0f7a3c;
}

.bv-footer span {
  color: #68766d;
}

.bv-footer strong {
  background: linear-gradient(135deg, #e1f2e4, #f8fff8);
  color: #0b3b28;
  font-size: 12px;
}



svg {
  width: 1em;
  height: 1em;
}

a {
  text-decoration: none;
}

@media (max-width: 900px) {
  .bv-main {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 8px 8px 16px;
  }

  .bv-shell {
    height: auto;
    display: block;
  }

  .bv-footer {
    display: none;
  }

  .bv-header {
    min-height: 64px;
    padding: 8px 10px;
    border-radius: 16px;
    margin-bottom: 8px;
  }

  .bv-logo-box {
    width: 56px;
    height: 48px;
  }

  .bv-logo-img {
    width: 58px;
    height: 58px;
  }

  .bv-header h1 {
    font-size: 21px;
  }

  .bv-header p {
    font-size: 11px;
  }

  .bv-button {
    height: 38px;
    padding: 0 10px;
    font-size: 12px;
  }

  .bv-actions {
    flex-direction: column;
    gap: 5px;
    align-items: stretch;
  }

  .bv-actions .bv-button {
    height: 34px;
    justify-content: center;
    white-space: nowrap;
  }

  .bv-button-secondary {
    display: none;
  }

  .bv-filters {
    grid-template-columns: repeat(2, 1fr);
    gap: 7px;
    margin-bottom: 7px;
  }

  .bv-filter {
    height: 52px;
    padding: 7px 9px;
  }

  .bv-kpis {
    grid-template-columns: repeat(2, 1fr);
    gap: 7px;
    margin-bottom: 8px;
  }

  .bv-kpi {
    height: 58px;
    padding: 8px 9px;
  }

  .bv-kpi strong {
    font-size: 21px;
  }

  .bv-content {
    grid-template-columns: 1fr;
    gap: 8px;
    overflow: visible;
  }

  .bv-panel,
  .bv-exec {
    padding: 10px;
    border-radius: 16px;
  }

  .bv-card {
    grid-template-columns: 42px 1fr;
    gap: 8px;
    padding: 9px;
  }

  .bv-card-icon {
    width: 38px;
    height: 38px;
  }

  .bv-card h3 {
    font-size: 16px;
  }

  .bv-card p {
    font-size: 11.5px;
  }

  .bv-card-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    font-size: 10.8px;
  }

  .bv-exec {
    display: grid;
    grid-template-rows: auto;
    overflow: visible;
  }

  .bv-summary {
    height: 44px;
  }

  .bv-state h3 {
    font-size: 22px;
  }

  .bv-semaforo {
    height: auto;
    min-height: 128px;
    margin-top: 0;
  }

  .bv-critical-list {
    max-height: none;
    overflow: visible;
  }


}
.bv-gestion-table {
  display: grid;
  gap: 3px;
  min-height: 0;
  overflow: hidden;
}

.bv-gestion-row {
  display: grid;
  grid-template-columns: 1.05fr 1fr .72fr .82fr .62fr .82fr;
  gap: 4px;
  align-items: center;
  font-size: 8.4px;
  padding: 3px 4px;
  border-radius: 8px;
  background: #f8fbf7;
  border: 1px solid #e1eadf;
}

.bv-gestion-header {
  background: #eef7ef;
  color: #0b3b28;
  font-weight: 900;
}

.bv-gestion-strong {
  font-weight: 900;
  color: #0f7a3c;
}

.bv-badge-estado {
  min-width: 0;
  border-radius: 999px;
  padding: 2px 4px;
  font-size: 7.8px;
  font-weight: 900;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-badge-estado.ok {
  background: #dff7e8;
  color: #08713a;
}

.bv-badge-estado.medio {
  background: #fff3d8;
  color: #9a5b00;
}

.bv-badge-estado.pendiente {
  background: #fde8df;
  color: #b13a0b;
}
`;
