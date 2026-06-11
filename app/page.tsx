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
            <div className="bv-logo">BV</div>
            <div>
              <h1>BIOVITAL</h1>
              <p>Monitoreo de biodiversidad y compromisos ambientales</p>
            </div>
          </div>

          <a className="bv-button" href="#">
            + Registrar Censo
          </a>
        </header>

        <section className="bv-filters">
          <Select label="Año" value={anio} options={unique('anio')} onChange={setAnio} icon="📅" />
          <Select label="Predio" value={predio} options={unique('predio')} onChange={setPredio} icon="📍" />
          <Select label="Compromiso" value={compromiso} options={unique('compromiso')} onChange={setCompromiso} icon="📋" />
          <Select label="EECC" value={eecc} options={unique('eecc')} onChange={setEecc} icon="🏢" />
        </section>

        <section className="bv-kpis">
          <Kpi icon="🧾" title="Censos" value={totalCensos} />
          <Kpi icon="🌿" title="Vivos" value={totalVivos} />
          <Kpi icon="↘" title="Bajas" value={totalMuertos} danger />
          <Kpi icon="◔" title="Avance" value={`${avance}%`} />
          <Kpi icon="⛰" title="Predios" value="1" />
          <Kpi icon="🤝" title="Compromisos" value="2" />
        </section>

        <section className="bv-content">
          <div className="bv-panel">
            <div className="bv-panel-head">
              <h2>☷ Vista operacional</h2>
              <span>{filtrados.length} registros</span>
            </div>

            <div className="bv-list">
              {filtrados.map((r) => (
                <article className="bv-card" key={r.id}>
                  <div className="bv-card-icon">🌿</div>

                  <div className="bv-card-body">
                    <div className="bv-id">{r.id}</div>
                    <div className="bv-row">
                      <h3>{r.especie}</h3>
                      <span className={`bv-status ${r.estado.toLowerCase()}`}>{r.estado}</span>
                    </div>
                    <p>{r.predio} · {r.compromiso} · {r.eecc}</p>

                    <div className="bv-progress">
                      <div style={{ width: `${r.avance}%` }} />
                    </div>

                    <div className="bv-card-stats">
                      <span>🌿 Vivos: <b>{r.vivos}</b></span>
                      <span className="danger">↘ Bajas: <b>{r.muertos}</b></span>
                      <span>◔ Censos: <b>{r.censos}</b></span>
                      <strong>{r.avance}%</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="bv-exec">
            <div className="bv-panel-head">
              <h2>📈 Vista ejecutiva</h2>
              <span>Resumen consolidado</span>
            </div>

            <Resumen label="Registros activos" value={filtrados.length} icon="👥" />
            <Resumen label="Plantas vivas" value={totalVivos} icon="🌿" />
            <Resumen label="Bajas registradas" value={totalMuertos} icon="↘" danger />
            <Resumen label="Avance promedio" value={`${avance}%`} icon="◔" />

            <div className="bv-state">
              <small>Estado general</small>
              <h3>{estadoGeneral}</h3>
              <p>Información consolidada por año, predio, compromiso y empresa ejecutora.</p>
            </div>
          </aside>
        </section>

        <nav className="bv-mobile-nav">
          <span>🏠<small>Inicio</small></span>
          <span>📋<small>Registros</small></span>
          <span className="active">＋</span>
          <span>📊<small>Reportes</small></span>
          <span>⋯<small>Más</small></span>
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
  icon: string;
}) {
  return (
    <label className="bv-filter">
      <span>{icon}</span>
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
  icon: string;
  title: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div className="bv-kpi">
      <span>{icon}</span>
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
  icon: string;
  danger?: boolean;
}) {
  return (
    <div className="bv-summary">
      <span>{icon}</span>
      <p>{label}</p>
      <strong className={danger ? 'danger' : ''}>{value}</strong>
    </div>
  );
}

const css = `
.bv-main {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7faf6, #edf5ec);
  font-family: Inter, Arial, Helvetica, sans-serif;
  color: #102015;
  padding: 14px;
}

.bv-shell {
  max-width: 1500px;
  margin: 0 auto;
}

.bv-header {
  height: 104px;
  background: rgba(255,255,255,.94);
  border: 1px solid #e2ebe0;
  border-radius: 22px;
  padding: 18px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 14px 36px rgba(0,0,0,.08);
  margin-bottom: 10px;
}

.bv-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bv-logo {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(145deg, #dceee2, #f8fff9);
  color: #136b3d;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 23px;
  border: 1px solid #d6eadc;
}

.bv-header h1 {
  margin: 0;
  font-size: 36px;
  letter-spacing: .5px;
  color: #0b3b28;
  line-height: 1;
}

.bv-header p {
  margin: 6px 0 0;
  font-size: 15px;
  color: #53635a;
}

.bv-button {
  background: linear-gradient(135deg, #0f7a3c, #108e49);
  color: white;
  border-radius: 16px;
  padding: 16px 28px;
  font-weight: 900;
  font-size: 16px;
  box-shadow: 0 10px 22px rgba(15,122,60,.28);
}

.bv-filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}

.bv-filter {
  height: 72px;
  background: white;
  border: 1px solid #e2ebe0;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 22px rgba(0,0,0,.055);
}

.bv-filter span {
  font-size: 23px;
}

.bv-filter small {
  display: block;
  color: #68766d;
  font-weight: 700;
  font-size: 12px;
}

.bv-filter select {
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 18px;
  font-weight: 900;
  color: #102015;
  width: 100%;
}

.bv-kpis {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 14px;
}

.bv-kpi {
  background: white;
  border: 1px solid #e2ebe0;
  border-radius: 18px;
  min-height: 86px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 8px 22px rgba(0,0,0,.055);
}

.bv-kpi span {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: #e8f5eb;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.bv-kpi small {
  display: block;
  font-size: 13px;
  color: #53635a;
  font-weight: 800;
}

.bv-kpi strong {
  display: block;
  font-size: 30px;
  color: #0f7a3c;
  line-height: 1.05;
}

.danger {
  color: #c84a12 !important;
}

.bv-content {
  display: grid;
  grid-template-columns: 1.45fr .9fr;
  gap: 18px;
}

.bv-panel,
.bv-exec {
  background: rgba(255,255,255,.96);
  border: 1px solid #e2ebe0;
  border-radius: 22px;
  padding: 20px;
  box-shadow: 0 12px 32px rgba(0,0,0,.07);
}

.bv-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.bv-panel-head h2 {
  margin: 0;
  font-size: 23px;
}

.bv-panel-head span {
  color: #53635a;
  font-size: 13px;
}

.bv-list {
  max-height: 430px;
  overflow-y: auto;
  padding-right: 4px;
}

.bv-card {
  background: #fbfefb;
  border: 1px solid #e2ebe0;
  border-radius: 20px;
  padding: 16px;
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  margin-bottom: 12px;
}

.bv-card-icon {
  width: 62px;
  height: 62px;
  border-radius: 999px;
  background: #eef7ec;
  display: grid;
  place-items: center;
  font-size: 30px;
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
}

.bv-id {
  color: #0f7a3c;
  font-size: 12px;
  font-weight: 900;
}

.bv-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.bv-row h3 {
  margin: 4px 0;
  font-size: 23px;
  line-height: 1;
}

.bv-card p {
  margin: 0 0 12px;
  color: #53635a;
  font-size: 15px;
}

.bv-status {
  border-radius: 999px;
  padding: 7px 13px;
  font-size: 12px;
  font-weight: 900;
  background: #dff7e8;
  color: #08713a;
  height: fit-content;
}

.bv-status.seguimiento {
  background: #e5f0ff;
  color: #125ea8;
}

.bv-status.planificado {
  background: #eee4ff;
  color: #6333a5;
}

.bv-progress {
  height: 8px;
  background: #dfe8dd;
  border-radius: 999px;
  overflow: hidden;
}

.bv-progress div {
  height: 100%;
  background: linear-gradient(90deg, #0f7a3c, #2dbb6a);
  border-radius: 999px;
}

.bv-card-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 12px;
  font-size: 14px;
  color: #405247;
}

.bv-card-stats b {
  color: #0f7a3c;
}

.bv-exec {
  background: linear-gradient(145deg, #f8fff8, #edf7ed);
}

.bv-summary {
  height: 64px;
  background: white;
  border: 1px solid #e2ebe0;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 48px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 10px;
  box-shadow: 0 7px 18px rgba(0,0,0,.055);
}

.bv-summary span {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #e8f5eb;
  display: grid;
  place-items: center;
}

.bv-summary p {
  margin: 0;
  font-weight: 700;
}

.bv-summary strong {
  color: #0f7a3c;
  font-size: 22px;
}

.bv-state {
  margin-top: 18px;
  background: linear-gradient(135deg, #e1f2e4, #f8fff8);
  border-radius: 20px;
  padding: 22px;
  min-height: 160px;
  border: 1px solid #dceee2;
}

.bv-state small {
  color: #0f7a3c;
  font-weight: 900;
}

.bv-state h3 {
  margin: 18px 0 12px;
  font-size: 34px;
  color: #0f7a3c;
  line-height: 1;
}

.bv-state p {
  margin: 0;
  color: #405247;
  font-size: 14px;
  line-height: 1.45;
}

.bv-mobile-nav {
  display: none;
}

@media (max-width: 900px) {
  .bv-main {
    padding: 10px 10px 76px;
  }

  .bv-header {
    height: auto;
    padding: 14px;
    border-radius: 18px;
  }

  .bv-logo {
    width: 44px;
    height: 44px;
    border-radius: 15px;
    font-size: 17px;
  }

  .bv-header h1 {
    font-size: 22px;
  }

  .bv-header p {
    font-size: 12px;
  }

  .bv-button {
    padding: 12px 14px;
    font-size: 13px;
  }

  .bv-filters {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .bv-filter {
    height: 60px;
    padding: 10px;
  }

  .bv-filter select {
    font-size: 15px;
  }

  .bv-kpis {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .bv-kpi {
    min-height: 72px;
    padding: 12px;
  }

  .bv-kpi strong {
    font-size: 25px;
  }

  .bv-content {
    grid-template-columns: 1fr;
  }

  .bv-panel,
  .bv-exec {
    padding: 14px;
    border-radius: 20px;
  }

  .bv-list {
    max-height: none;
    overflow: visible;
  }

  .bv-card {
    grid-template-columns: 52px 1fr;
    gap: 12px;
    padding: 13px;
  }

  .bv-card-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .bv-row h3 {
    font-size: 18px;
  }

  .bv-card p {
    font-size: 13px;
  }

  .bv-card-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
    font-size: 13px;
  }

  .bv-state h3 {
    font-size: 27px;
  }

  .bv-mobile-nav {
    position: fixed;
    left: 10px;
    right: 10px;
    bottom: 10px;
    height: 58px;
    background: white;
    border: 1px solid #dfe8dd;
    border-radius: 20px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    box-shadow: 0 10px 30px rgba(0,0,0,.15);
    z-index: 50;
  }

  .bv-mobile-nav span {
    display: grid;
    place-items: center;
    font-size: 18px;
    color: #53635a;
  }

  .bv-mobile-nav small {
    font-size: 10px;
  }

  .bv-mobile-nav .active {
    width: 46px;
    height: 46px;
    background: #0f7a3c;
    color: white;
    border-radius: 999px;
    margin: 0 auto;
    font-size: 26px;
  }
}
`;
