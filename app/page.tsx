'use client';

import { useMemo, useState } from 'react';

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

const DATA: Registro[] = [
  {
    id: 'BIO-2026-001',
    anio: '2026',
    predio: 'Monte Aranda',
    compromiso: 'CCPL-1',
    eecc: 'ABP',
    especie: 'Porlieria chilensis',
    estado: 'Operativo',
    censos: 12,
    vivos: 940,
    muertos: 38,
    avance: 82,
  },
  {
    id: 'BIO-2026-002',
    anio: '2026',
    predio: 'Monte Aranda',
    compromiso: 'CCPL-1',
    eecc: 'ABP',
    especie: 'Carica chilensis',
    estado: 'Seguimiento',
    censos: 8,
    vivos: 323,
    muertos: 21,
    avance: 74,
  },
  {
    id: 'BIO-2028-001',
    anio: '2028',
    predio: 'Monte Aranda',
    compromiso: 'Enriquecimiento',
    eecc: 'TKR',
    especie: 'Porlieria chilensis',
    estado: 'Planificado',
    censos: 4,
    vivos: 949,
    muertos: 0,
    avance: 35,
  },
];

export default function Home() {
  const [anio, setAnio] = useState('Todos');
  const [predio, setPredio] = useState('Todos');
  const [compromiso, setCompromiso] = useState('Todos');
  const [eecc, setEecc] = useState('Todos');

  const unique = (key: keyof Registro) => [
    'Todos',
    ...Array.from(new Set(DATA.map((r) => String(r[key])))),
  ];

  const filtrados = useMemo(() => {
    return DATA.filter(
      (r) =>
        (anio === 'Todos' || r.anio === anio) &&
        (predio === 'Todos' || r.predio === predio) &&
        (compromiso === 'Todos' || r.compromiso === compromiso) &&
        (eecc === 'Todos' || r.eecc === eecc)
    );
  }, [anio, predio, compromiso, eecc]);

  const totalCensos = filtrados.reduce((a, b) => a + b.censos, 0);
  const totalVivos = filtrados.reduce((a, b) => a + b.vivos, 0);
  const totalMuertos = filtrados.reduce((a, b) => a + b.muertos, 0);
  const avance =
    filtrados.length > 0
      ? Math.round(filtrados.reduce((a, b) => a + b.avance, 0) / filtrados.length)
      : 0;

  const estadoGeneral =
    avance >= 75 ? 'CONTROLADO' : avance >= 50 ? 'EN SEGUIMIENTO' : 'CRÍTICO';

  return (
    <main className="bv-main">
      <style>{css}</style>

      <section className="bv-shell">
        <header className="bv-header">
          <div className="bv-brand">
            <img src="/logo-biovital.png" alt="BIOVITAL" className="bv-logo-img" />
            <div>
              <h1>BIOVITAL</h1>
              <p>Monitoreo de biodiversidad y compromisos ambientales</p>
            </div>
          </div>

          <a className="bv-button" href="#">
            <IconPlus /> Registrar Censo
          </a>
        </header>

        <section className="bv-filters">
          <Select label="Año" value={anio} options={unique('anio')} onChange={setAnio} icon={<IconCalendar />} />
          <Select label="Predio" value={predio} options={unique('predio')} onChange={setPredio} icon={<IconPin />} />
          <Select label="Compromiso" value={compromiso} options={unique('compromiso')} onChange={setCompromiso} icon={<IconClipboard />} />
          <Select label="EECC" value={eecc} options={unique('eecc')} onChange={setEecc} icon={<IconBuilding />} />
        </section>

        <section className="bv-kpis">
          <Kpi icon={<IconFile />} title="Censos" value={totalCensos} />
          <Kpi icon={<IconLeaf />} title="Vivos" value={totalVivos} />
          <Kpi icon={<IconDown />} title="Bajas" value={totalMuertos} danger />
          <Kpi icon={<IconProgress />} title="Avance" value={`${avance}%`} />
          <Kpi icon={<IconMountain />} title="Predios" value="1" />
          <Kpi icon={<IconCommit />} title="Compromisos" value="2" />
        </section>

        <section className="bv-content">
          <div className="bv-panel">
            <div className="bv-panel-head">
              <h2><IconList /> Vista operacional</h2>
              <span>{filtrados.length} registros</span>
            </div>

            <div className="bv-list">
              {filtrados.map((r) => (
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
                      <strong>{r.avance}%</strong>
                    </div>

                    <div className="bv-card-stats">
                      <span><IconLeafSmall /> Vivos: <b>{r.vivos}</b></span>
                      <span className="danger"><IconDownSmall /> Bajas: <b>{r.muertos}</b></span>
                      <span><IconClock /> Censos: <b>{r.censos}</b></span>
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

            <Resumen label="Registros activos" value={filtrados.length} icon={<IconUsers />} />
            <Resumen label="Plantas vivas" value={totalVivos} icon={<IconLeaf />} />
            <Resumen label="Bajas registradas" value={totalMuertos} icon={<IconDown />} danger />
            <Resumen label="Avance promedio" value={`${avance}%`} icon={<IconProgress />} />

            <div className="bv-state">
              <div>
                <small>Estado general</small>
                <h3>{estadoGeneral}</h3>
                <p>Avance promedio <b>{avance}%</b></p>
                <p>Información consolidada por año, predio, compromiso y empresa ejecutora.</p>
              </div>
              <div className="bv-state-mark">
                <IconLeaf />
              </div>
            </div>
          </aside>
        </section>

        <nav className="bv-mobile-nav">
          <span><IconHome /><small>Inicio</small></span>
          <span><IconList /><small>Registros</small></span>
          <span className="active"><IconPlus /></span>
          <span><IconChart /><small>Reportes</small></span>
          <span><IconMore /><small>Más</small></span>
        </nav>
      </section>
    </main>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="bv-filter">
      <span className="bv-filter-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Kpi({
  icon,
  title,
  value,
  danger,
}: {
  icon: React.ReactNode;
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

function Resumen({
  label,
  value,
  icon,
  danger,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
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

function Svg({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
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
function IconCommit() { return <Svg><path d="M7 12h10M7 12a4 4 0 1 1-4-4 4 4 0 0 1 4 4ZM21 12a4 4 0 1 1-4-4 4 4 0 0 1 4 4Z" /></Svg>; }
function IconList() { return <Svg><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Svg>; }
function IconChart() { return <Svg><path d="M3 3v18h18" /><path d="M7 16l4-5 4 3 5-8" /></Svg>; }
function IconUsers() { return <Svg><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11a4 4 0 0 0 0-8M21 21v-2a4 4 0 0 0-3-3.8" /></Svg>; }
function IconClock() { return <Svg><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>; }
function IconHome() { return <Svg><path d="M3 11l9-8 9 8" /><path d="M5 10v11h14V10" /></Svg>; }
function IconMore() { return <Svg><path d="M5 12h.01M12 12h.01M19 12h.01" /></Svg>; }
function IconLeafSmall() { return <span className="inline-icon"><IconLeaf /></span>; }
function IconDownSmall() { return <span className="inline-icon"><IconDown /></span>; }

const css = `
.bv-main {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f7faf6, #eef5ec);
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #102015;
  padding: 10px;
}

.bv-shell {
  max-width: 1500px;
  height: calc(100vh - 20px);
  margin: 0 auto;
  display: grid;
  grid-template-rows: 82px 62px 72px 1fr;
  gap: 10px;
}

.bv-header {
  background: rgba(255,255,255,.96);
  border: 1px solid #e1eadf;
  border-radius: 20px;
  padding: 12px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 28px rgba(0,0,0,.07);
}

.bv-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.bv-logo-img {
  width: 58px;
  height: 58px;
  object-fit: contain;
  border-radius: 14px;
}

.bv-header h1 {
  margin: 0;
  font-size: 31px;
  letter-spacing: .3px;
  color: #0b3b28;
  line-height: 1;
}

.bv-header p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #53635a;
}

.bv-button {
  height: 50px;
  background: linear-gradient(135deg, #0f7a3c, #108e49);
  color: white;
  border-radius: 15px;
  padding: 0 24px;
  font-weight: 900;
  font-size: 15px;
  box-shadow: 0 10px 22px rgba(15,122,60,.25);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.bv-button svg {
  width: 17px;
  height: 17px;
}

.bv-filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.bv-filter {
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 17px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 11px;
  box-shadow: 0 6px 18px rgba(0,0,0,.045);
}

.bv-filter-icon,
.bv-iconbox {
  width: 38px;
  height: 38px;
  border-radius: 13px;
  background: #e9f6ed;
  color: #0f7a3c;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

.bv-filter-icon svg,
.bv-iconbox svg {
  width: 20px;
  height: 20px;
}

.bv-filter small {
  display: block;
  color: #68766d;
  font-weight: 800;
  font-size: 11px;
  margin-bottom: 2px;
}

.bv-filter select {
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 16px;
  font-weight: 900;
  color: #102015;
  width: 100%;
}

.bv-kpis {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.bv-kpi {
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 17px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,.045);
}

.bv-kpi small {
  display: block;
  font-size: 12px;
  color: #53635a;
  font-weight: 800;
  margin-bottom: 2px;
}

.bv-kpi strong {
  display: block;
  font-size: 25px;
  color: #0f7a3c;
  line-height: 1;
}

.danger {
  color: #c84a12 !important;
}

.bv-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 1.48fr .9fr;
  gap: 12px;
}

.bv-panel,
.bv-exec {
  min-height: 0;
  background: rgba(255,255,255,.96);
  border: 1px solid #e1eadf;
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 10px 26px rgba(0,0,0,.06);
}

.bv-panel {
  display: grid;
  grid-template-rows: 34px 1fr;
}

.bv-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.bv-panel-head h2 {
  margin: 0;
  font-size: 21px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bv-panel-head h2 svg {
  width: 20px;
  height: 20px;
  color: #0f7a3c;
}

.bv-panel-head span {
  color: #53635a;
  font-size: 12px;
}

.bv-list {
  min-height: 0;
  overflow-y: auto;
  padding-right: 5px;
}

.bv-list::-webkit-scrollbar {
  width: 7px;
}

.bv-list::-webkit-scrollbar-thumb {
  background: #c9d8c6;
  border-radius: 99px;
}

.bv-card {
  background: #fbfefb;
  border: 1px solid #e1eadf;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 12px;
  margin-bottom: 9px;
}

.bv-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #edf7ec;
  color: #0f7a3c;
  display: grid;
  place-items: center;
  box-shadow: 0 7px 16px rgba(0,0,0,.055);
}

.bv-card-icon svg {
  width: 25px;
  height: 25px;
}

.bv-topline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.bv-id {
  color: #0f7a3c;
  font-size: 11px;
  font-weight: 900;
}

.bv-card h3 {
  margin: 2px 0 2px;
  font-size: 20px;
  line-height: 1.05;
}

.bv-card p {
  margin: 0;
  color: #53635a;
  font-size: 13px;
}

.bv-status {
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 11px;
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
  grid-template-columns: 1fr 42px;
  align-items: center;
  gap: 10px;
  margin-top: 9px;
}

.bv-progress {
  height: 7px;
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
  font-size: 14px;
}

.bv-card-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 9px;
  font-size: 12.5px;
  color: #405247;
}

.bv-card-stats b {
  color: #0f7a3c;
}

.inline-icon {
  display: inline-block;
  width: 13px;
  height: 13px;
  vertical-align: -2px;
  margin-right: 3px;
}

.inline-icon svg {
  width: 13px;
  height: 13px;
}

.bv-exec {
  background: linear-gradient(145deg, #f8fff8, #edf7ed);
  display: flex;
  flex-direction: column;
}

.exec-head {
  margin-bottom: 9px;
}

.bv-summary {
  height: 55px;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 15px;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 8px;
  box-shadow: 0 6px 16px rgba(0,0,0,.045);
}

.bv-summary .bv-iconbox {
  width: 34px;
  height: 34px;
  border-radius: 12px;
}

.bv-summary .bv-iconbox svg {
  width: 18px;
  height: 18px;
}

.bv-summary p {
  margin: 0;
  font-weight: 800;
  font-size: 13.5px;
}

.bv-summary strong {
  color: #0f7a3c;
  font-size: 20px;
}

.bv-state {
  margin-top: auto;
  background: linear-gradient(135deg, #e1f2e4, #f8fff8);
  border-radius: 18px;
  padding: 15px;
  min-height: 130px;
  border: 1px solid #dceee2;
  display: grid;
  grid-template-columns: 1fr 82px;
  gap: 10px;
  align-items: center;
}

.bv-state small {
  color: #0f7a3c;
  font-weight: 900;
  font-size: 12px;
}

.bv-state h3 {
  margin: 9px 0 7px;
  font-size: 29px;
  color: #0f7a3c;
  line-height: 1;
}

.bv-state p {
  margin: 4px 0 0;
  color: #405247;
  font-size: 12.5px;
  line-height: 1.35;
}

.bv-state-mark {
  width: 78px;
  height: 78px;
  border-radius: 999px;
  background: rgba(255,255,255,.7);
  color: #0f7a3c;
  display: grid;
  place-items: center;
}

.bv-state-mark svg {
  width: 42px;
  height: 42px;
}

.bv-mobile-nav {
  display: none;
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
    padding: 8px 8px 74px;
  }

  .bv-shell {
    height: auto;
    display: block;
  }

  .bv-header {
    min-height: 70px;
    padding: 10px 12px;
    border-radius: 17px;
    margin-bottom: 9px;
  }

  .bv-logo-img {
    width: 44px;
    height: 44px;
  }

  .bv-header h1 {
    font-size: 22px;
  }

  .bv-header p {
    font-size: 11.5px;
  }

  .bv-button {
    height: 40px;
    padding: 0 12px;
    font-size: 12px;
  }

  .bv-filters {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 8px;
  }

  .bv-filter {
    height: 56px;
    padding: 8px 10px;
  }

  .bv-filter-icon,
  .bv-iconbox {
    width: 34px;
    height: 34px;
  }

  .bv-filter select {
    font-size: 14px;
  }

  .bv-kpis {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 9px;
  }

  .bv-kpi {
    min-height: 64px;
    padding: 10px;
  }

  .bv-kpi strong {
    font-size: 23px;
  }

  .bv-content {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .bv-panel,
  .bv-exec {
    padding: 12px;
    border-radius: 18px;
  }

  .bv-list {
    max-height: none;
    overflow: visible;
  }

  .bv-card {
    grid-template-columns: 46px 1fr;
    gap: 10px;
    padding: 11px;
  }

  .bv-card-icon {
    width: 42px;
    height: 42px;
  }

  .bv-card h3 {
    font-size: 17px;
  }

  .bv-card p {
    font-size: 12px;
  }

  .bv-card-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    font-size: 11.5px;
  }

  .bv-state {
    grid-template-columns: 1fr 72px;
  }

  .bv-state h3 {
    font-size: 25px;
  }

  .bv-mobile-nav {
    position: fixed;
    left: 8px;
    right: 8px;
    bottom: 8px;
    height: 56px;
    background: white;
    border: 1px solid #dfe8dd;
    border-radius: 19px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    box-shadow: 0 10px 30px rgba(0,0,0,.15);
    z-index: 50;
  }

  .bv-mobile-nav span {
    display: grid;
    place-items: center;
    font-size: 17px;
    color: #53635a;
  }

  .bv-mobile-nav svg {
    width: 18px;
    height: 18px;
  }

  .bv-mobile-nav small {
    font-size: 10px;
  }

  .bv-mobile-nav .active {
    width: 44px;
    height: 44px;
    background: #0f7a3c;
    color: white;
    border-radius: 999px;
    margin: 0 auto;
  }
}
`;
