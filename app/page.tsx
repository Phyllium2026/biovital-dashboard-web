const API_URL =
  "https://script.google.com/macros/s/AKfycbxlJ54EDwB8EeU9mQD06Iz_63jKP4DiST_xnj-U616eSLQb8TtwWUwPOBAyXEERFTlN/exec";

async function getData(view: string) {
  const response = await fetch(`${API_URL}?view=${view}&anio=2026`, {
    cache: "no-store",
  });

  return response.json();
}

function normalizarLista(data: any) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.resultados)) return data.resultados;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function obtenerTexto(item: any, campos: string[]) {
  for (const campo of campos) {
    if (item?.[campo] !== undefined && item?.[campo] !== "") {
      return item[campo];
    }
  }
  return "Sin dato";
}

function obtenerNumero(item: any, campos: string[]) {
  for (const campo of campos) {
    if (item?.[campo] !== undefined && item?.[campo] !== "") {
      return item[campo];
    }
  }
  return 0;
}

export default async function Home() {
  const kpis = await getData("kpis");
  const especiesRaw = await getData("especies");
  const prediosRaw = await getData("predios");

  const especies = normalizarLista(especiesRaw);
  const predios = normalizarLista(prediosRaw);

  const topEspecies = especies.slice(0, 6);
  const topPredios = predios.slice(0, 6);

  const secundarios = [
    ["📊", "Prendimiento", `${kpis.prendimientoPromedio}%`],
    ["🌳", "Predios", kpis.predios],
    ["🪴", "Especies", kpis.especies],
    ["⚠️", "A revisión", kpis.registrosRevision],
  ];

  return (
    <main style={styles.main}>
      <section style={styles.panel}>
        <div style={styles.header}>
          <p style={styles.label}>BIOVITAL V1</p>

          <h1 style={styles.title}>
            Centro de Control de Replantes Ambientales
          </h1>

          <p style={styles.subtitle}>
            Información operacional para priorizar decisiones de replante.
          </p>
        </div>

        <section style={styles.heroGrid}>
          <div style={styles.hero}>
            <div style={styles.heroIcon}>🌱</div>
            <div>
              <p style={styles.heroLabel}>Plantas a Reponer</p>
              <h2 style={styles.heroValue}>{kpis.plantasReponer}</h2>
              <p style={styles.heroText}>
                Demanda total estimada según censos de sobrevivencia validados.
              </p>
            </div>
          </div>

          <div style={styles.sideBox}>
            <div style={styles.sideItem}>
              <p style={styles.sideLabel}>Compromisos Ambientales</p>
              <p style={styles.sideValue}>{kpis.compromisos}</p>
            </div>

            <div style={styles.sideItem}>
              <p style={styles.sideLabel}>EECC Participantes</p>
              <p style={styles.sideValue}>{kpis.eecc}</p>
            </div>

            <div style={styles.sideItem}>
              <p style={styles.sideLabel}>Registros Incorporados</p>
              <p style={styles.sideValue}>{kpis.registros}</p>
            </div>
          </div>
        </section>

        <div style={styles.kpiRow}>
          {secundarios.map(([icon, title, value]) => (
            <div key={title as string} style={styles.kpiCard}>
              <div style={styles.kpiIcon}>{icon}</div>
              <div>
                <div style={styles.kpiTitle}>{title}</div>
                <div style={styles.kpiValue}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        <section style={styles.twoColumns}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Top especies a reponer</h2>
              <p style={styles.sectionSubtitle}>
                Ranking operativo según demanda estimada.
              </p>
            </div>

            <div style={styles.table}>
              <div style={styles.tableHead}>
                <div>Especie</div>
                <div style={styles.right}>Plantas</div>
              </div>

              {topEspecies.map((item: any, index: number) => (
                <div key={index} style={styles.tableRow}>
                  <div>
                    <strong>
                      {obtenerTexto(item, [
                        "especie",
                        "Especie",
                        "NOMBRE_ESPECIE",
                        "Nombre_Especie",
                        "nombre",
                      ])}
                    </strong>
                  </div>

                  <div style={styles.right}>
                    {obtenerNumero(item, [
                      "plantasReponer",
                      "Plantas_Reponer",
                      "PLANTAS_REPONER",
                      "reponer",
                      "total",
                      "Total",
                    ])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Predios críticos</h2>
              <p style={styles.sectionSubtitle}>
                Concentración territorial de la demanda.
              </p>
            </div>

            <div style={styles.table}>
              <div style={styles.tableHead}>
                <div>Predio</div>
                <div style={styles.right}>Plantas</div>
              </div>

              {topPredios.map((item: any, index: number) => (
                <div key={index} style={styles.tableRow}>
                  <div>
                    <strong>{item.nombre}</strong>
                  </div>

                  <div style={styles.right}>{item.reponer}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: any = {
  main: {
    minHeight: "100vh",
    background: "#eef4ea",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },

  panel: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.09)",
  },

  header: {
    marginBottom: "26px",
  },

  label: {
    margin: 0,
    color: "#4f7f38",
    fontWeight: 800,
    fontSize: "13px",
    letterSpacing: "0.8px",
  },

  title: {
    margin: "10px 0",
    fontSize: "38px",
    color: "#1f2d1f",
    lineHeight: 1.1,
  },

  subtitle: {
    color: "#5f6f5c",
    fontSize: "16px",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "22px",
    marginBottom: "22px",
  },

  hero: {
    background: "linear-gradient(135deg, #2f5f2f, #6fa84f)",
    borderRadius: "24px",
    padding: "34px",
    color: "#ffffff",
    display: "flex",
    gap: "24px",
    alignItems: "center",
    minHeight: "210px",
  },

  heroIcon: {
    fontSize: "64px",
  },

  heroLabel: {
    margin: 0,
    fontSize: "17px",
    opacity: 0.9,
  },

  heroValue: {
    margin: "8px 0",
    fontSize: "64px",
    lineHeight: 1,
  },

  heroText: {
    margin: 0,
    fontSize: "15px",
    opacity: 0.9,
  },

  sideBox: {
    display: "grid",
    gap: "14px",
  },

  sideItem: {
    background: "#f9fbf7",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },

  sideLabel: {
    margin: 0,
    color: "#61705d",
    fontSize: "14px",
  },

  sideValue: {
    margin: "6px 0 0",
    color: "#223322",
    fontSize: "30px",
    fontWeight: 800,
  },

  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  kpiCard: {
    background: "#f9fbf7",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    gap: "14px",
    alignItems: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },

  kpiIcon: {
    fontSize: "30px",
  },

  kpiTitle: {
    color: "#61705d",
    fontSize: "14px",
  },

  kpiValue: {
    marginTop: "5px",
    fontSize: "28px",
    fontWeight: 800,
    color: "#223322",
  },

  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "22px",
  },

  section: {
    background: "#f9fbf7",
    borderRadius: "18px",
    padding: "24px",
  },

  sectionHeader: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "23px",
    color: "#1f2d1f",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#5f6f5c",
    fontSize: "14px",
  },

  table: {
    width: "100%",
  },

  tableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    padding: "12px 0",
    borderBottom: "2px solid #dfe9d8",
    fontWeight: 700,
    color: "#4f7f38",
    fontSize: "14px",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 120px",
    padding: "14px 0",
    borderBottom: "1px solid #e6eee2",
    color: "#223322",
    fontSize: "14px",
  },

  right: {
    textAlign: "right",
  },
};
