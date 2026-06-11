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

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    background: '#eef5ec',
    color: '#102015',
    fontFamily: 'Arial, Helvetica, sans-serif',
    padding: 14,
  },
  shell: {
    maxWidth: 1180,
    margin: '0 auto',
  },
  header: {
    background: '#082015',
    color: 'white',
    borderRadius: 22,
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 8px 22px rgba(0,0,0,0.16)',
    marginBottom: 12,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1,
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#c7f0d6',
    marginTop: 5,
  },
  button: {
    background: '#25b86a',
    color: 'white',
    border: 'none',
    borderRadius: 16,
    padding: '11px 15px',
    fontWeight: 800,
    fontSize: 14,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  filters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 12,
  },
  filterCard: {
    background: 'white',
    borderRadius: 16,
    padding: 10,
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#68766d',
    marginBottom: 5,
  },
  select: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontWeight: 800,
    color: '#102015',
  },
  kpis: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 12,
  },
  kpi: {
    background: 'white',
    borderRadius: 18,
    padding: 14,
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  kpiTitle: {
    fontSize: 12,
    fontWeight: 800,
    color: '#68766d',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 900,
    marginTop: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: 12,
  },
  panel: {
    background: 'white',
    borderRadius: 22,
    padding: 14,
    boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  executive: {
    background: '#102015',
    color: 'white',
    borderRadius: 22,
    padding: 14,
    boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
  },
  panelHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 900,
    margin: 0,
  },
  muted: {
    fontSize: 12,
    color: '#68766d',
  },
  card: {
    background: '#f7fbf5',
    border: '1px solid #e4eee1',
    borderRadius: 18,
    padding: 12,
    marginBottom: 9,
  },
  rowBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'flex-start',
  },
  id: {
    fontSize: 11,
    color: '#6f7c73',
    fontWeight: 800,
  },
  species: {
    fontSize: 16,
    fontWeight: 900,
    marginTop: 3,
  },
  detail: {
    fontSize: 13,
    color: '#506158',
    marginTop: 3,
  },
  status: {
    background: '#dff7e8',
    color: '#126b3c',
    borderRadius: 999,
    padding: '6px 10px',
    fontSize: 11,
    fontWeight: 900,
    whiteSpace: 'nowrap',
  },
  bar: {
    height: 8,
    background: '#dce7d9',
    borderRadius: 999,
    marginTop: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    background: '#25b86a',
    borderRadius: 999,
  },
  miniStats: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 8,
    fontSize: 12,
    color: '#506158',
    fontWeight: 700,
  },
  execRow: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: '11px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 9,
    fontSize: 14,
  },
  stateBox: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 14,
    marginTop: 14,
  },
  stateSmall: {
    fontSize: 13,
    color: '#c7f0d6',
  },
  stateBig: {
    fontSize: 30,
    fontWeight: 900,
    marginTop: 4,
  },
  stateText: {
    fontSize: 13,
    color: '#c7f0d6',
    marginTop: 8,
  },
};

export default function Home() {
  const [anio, setAnio] = useState('Todos');
  const [predio, setPredio] = useState('Todos');
  const [compromiso, setCompromiso] = useState('Todos');
  const [eecc, setEecc] = useState('Todos');

  const filtrados = useMemo(() => {
    return DATA.filter((r) => {
      return (
        (anio === 'Todos' || r.anio === anio) &&
        (predio === 'Todos' || r.predio === predio) &&
        (compromiso === 'Todos' || r.compromiso === compromiso) &&
        (eecc === 'Todos' || r.eecc === eecc)
      );
    });
  }, [anio, predio, compromiso, eecc]);

  const totalCensos = filtrados.reduce((a, b) => a + b.censos, 0);
  const totalVivos = filtrados.reduce((a, b) => a + b.vivos, 0);
  const totalMuertos = filtrados.reduce((a, b) => a + b.muertos, 0);
  const avance =
    filtrados.length > 0
      ? Math.round(filtrados.reduce((a, b) => a + b.avance, 0) / filtrados.length)
      : 0;

  const estadoGeneral =
    avance >= 75 ? 'Controlado' : avance >= 50 ? 'En seguimiento' : 'Crítico';

  const unique = (key: keyof Registro) => [
    'Todos',
    ...Array.from(new Set(DATA.map((r) => String(r[key])))),
  ];

  return (
    <main style={styles.main}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logoBox}>BV</div>
            <div>
              <h1 style={styles.title}>BIOVITAL V2</h1>
              <div style={styles.subtitle}>
                Monitoreo de biodiversidad y compromisos ambientales
              </div>
            </div>
          </div>

          <button style={styles.button}>Registrar Censo</button>
        </header>

        <section style={styles.filters}>
          <Select label="Año" value={anio} options={unique('anio')} onChange={setAnio} />
          <Select label="Predio" value={predio} options={unique('predio')} onChange={setPredio} />
          <Select
            label="Compromiso"
            value={compromiso}
            options={unique('compromiso')}
            onChange={setCompromiso}
          />
          <Select label="EECC" value={eecc} options={unique('eecc')} onChange={setEecc} />
        </section>

        <section style={styles.kpis}>
          <Kpi title="Censos" value={totalCensos} />
          <Kpi title="Vivos" value={totalVivos} />
          <Kpi title="Bajas" value={totalMuertos} />
          <Kpi title="Avance" value={`${avance}%`} />
        </section>

        <section style={styles.grid}>
          <div style={styles.panel}>
            <div style={styles.panelHead}>
              <h2 style={styles.panelTitle}>Vista operacional</h2>
              <span style={styles.muted}>{filtrados.length} registros</span>
            </div>

            {filtrados.map((r) => (
              <article key={r.id} style={styles.card}>
                <div style={styles.rowBetween}>
                  <div>
                    <div style={styles.id}>{r.id}</div>
                    <div style={styles.species}>{r.especie}</div>
                    <div style={styles.detail}>
                      {r.predio} · {r.compromiso} · {r.eecc}
                    </div>
                  </div>
                  <span style={styles.status}>{r.estado}</span>
                </div>

                <div style={styles.bar}>
                  <div style={{ ...styles.barFill, width: `${r.avance}%` }} />
                </div>

                <div style={styles.miniStats}>
                  <span>Vivos: {r.vivos}</span>
                  <span>Bajas: {r.muertos}</span>
                  <span>Avance: {r.avance}%</span>
                </div>
              </article>
            ))}
          </div>

          <aside style={styles.executive}>
            <h2 style={styles.panelTitle}>Vista ejecutiva</h2>

            <Resumen label="Registros activos" value={filtrados.length} />
            <Resumen label="Plantas vivas" value={totalVivos} />
            <Resumen label="Bajas registradas" value={totalMuertos} />
            <Resumen label="Avance promedio" value={`${avance}%`} />

            <div style={styles.stateBox}>
              <div style={styles.stateSmall}>Estado general</div>
              <div style={styles.stateBig}>{estadoGeneral}</div>
              <div style={styles.stateText}>
                Información consolidada por año, predio, compromiso y empresa ejecutora.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label style={styles.filterCard}>
      <span style={styles.label}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Kpi({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiTitle}>{title}</div>
      <div style={styles.kpiValue}>{value}</div>
    </div>
  );
}

function Resumen({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={styles.execRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
