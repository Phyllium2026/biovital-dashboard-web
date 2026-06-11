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

  const especies = normalizarLista(especiesRaw);
  const topEspecies = especies.slice(0, 6);

  const cards = [
    ["🌱", "Plantas a Reponer", kpis.plantasReponer],
    ["📊", "Prendimiento Promedio", `${kpis.prendimientoPromedio}%`],
    ["📑", "Compromisos Ambientales", kpis.compromisos],
    ["🤝", "EECC Participantes", kpis.eecc],
    ["📋", "Registros Incorporados", kpis.registros],
    ["🌳", "Predios Monitoreados", kpis.predios],
    ["🪴", "Especies Monitoreadas", kpis.especies],
    ["⚠️", "Registros a Revisión", kpis.registrosRevision],
  ];

  return (
    <main style={styles.main}>
      <section style={styles.panel}>
        <div style={styles.header}>
          <p style={styles.label}>BIOVITAL V1</p>

          <h1 style={styles.title}>
            Dashboard de Replantes Ambientales
          </h1>

          <p style={styles.subtitle}>
            Información operacional para la toma de decisiones.
          </p>
        </div>

        <div style={styles.grid}>
          {cards.map(([icon, title, value]) => (
            <div key={title as string} style={styles.card}>
              <div style={styles.icon}>{icon}</div>

              <div>
                <div style={styles.cardTitle}>{title}</div>
                <div style={styles.cardValue}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Top especies a reponer</h2>
            <p style={styles.sectionSubtitle}>
              Ranking operativo según demanda estimada de replantes.
            </p>
          </div>

          <div style={styles.table}>
            <div style={styles.tableHead}>
              <div>Especie</div>
              <div style={styles.right}>Plantas a reponer</div>
            </div>

            {topEspecies.length === 0 ? (
              <div style={styles.empty}>
                No hay datos disponibles para especies.
              </div>
            ) : (
              topEspecies.map((item: any, index: number) => (
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
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: any = {
  main: {
    minHeight: "100vh",
    background: "#f4f7f2",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },

  panel: {
    maxWidth: "1180px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },

  header: {
    marginBottom: "26px",
  },

  label: {
    margin: 0,
    color: "#4f7f38",
    fontWeight: 700,
    fontSize: "13px",
  },

  title: {
    margin: "10px 0",
    fontSize: "36px",
    color: "#1f2d1f",
  },

  subtitle: {
    color: "#5f6f5c",
    fontSize: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
    gap: "18px",
  },

  card: {
    background: "#f9fbf7",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "32px",
  },

  cardTitle: {
    color: "#61705d",
    fontSize: "14px",
  },

  cardValue: {
    marginTop: "6px",
    fontSize: "30px",
    fontWeight: 800,
    color: "#223322",
  },

  section: {
    marginTop: "26px",
    background: "#f9fbf7",
    borderRadius: "18px",
    padding: "24px",
  },

  sectionHeader: {
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#1f2d1f",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#5f6f5c",
    fontSize: "15px",
  },

  table: {
    width: "100%",
  },

  tableHead: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
    padding: "12px 0",
    borderBottom: "2px solid #dfe9d8",
    fontWeight: 700,
    color: "#4f7f38",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
    padding: "14px 0",
    borderBottom: "1px solid #e6eee2",
    color: "#223322",
  },

  right: {
    textAlign: "right",
  },

  empty: {
    padding: "18px 0",
    color: "#7a8576",
    fontStyle: "italic",
  },
};
