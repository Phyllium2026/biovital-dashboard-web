const API_URL =
  "https://script.google.com/macros/s/AKfycbxlJ54EDwB8EeU9mQD06Iz_63jKP4DiST_xnj-U616eSLQb8TtwWUwPOBAyXEERFTlN/exec";

async function getData(view: string) {
  const response = await fetch(`${API_URL}?view=${view}&anio=2026`, {
    cache: "no-store",
  });

  return response.json();
}

export default async function Home() {
  const kpis = await getData("kpis");
  const especies = await getData("especies");

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

  const topEspecies = especies.slice(0, 6);

  return (
    <main style={styles.main}>
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

          {topEspecies.map((item: any, index: number) => (
            <div key={index} style={styles.tableRow}>
              <div>
                <strong>{item.especie}</strong>
              </div>

              <div style={styles.right}>
                {item.plantasReponer}
              </div>
            </div>
          ))}
        </div>
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

  header: {
    marginBottom: "30px",
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
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "24px",
    display: "flex",
    gap: "18px",
    alignItems: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "34px",
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
    marginTop: "30px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "26px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  sectionHeader: {
    marginBottom: "20px",
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
    borderBottom: "2px solid #e2eadc",
    fontWeight: 700,
    color: "#4f7f38",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 180px",
    padding: "14px 0",
    borderBottom: "1px solid #edf1ea",
    color: "#223322",
  },

  right: {
    textAlign: "right",
  },
};
