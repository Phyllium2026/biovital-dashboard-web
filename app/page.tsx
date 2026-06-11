const API_URL =
  "https://script.google.com/macros/s/AKfycbxlJ54EDwB8EeU9mQD06Iz_63jKP4DiST_xnj-U616eSLQb8TtwWUwPOBAyXEERFTlN/exec";

async function getKpis() {
  const response = await fetch(
    `${API_URL}?view=kpis&anio=2026`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function Home() {
  const kpis = await getKpis();

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
              <div style={styles.cardTitle}>
                {title}
              </div>

              <div style={styles.cardValue}>
                {value}
              </div>
            </div>
          </div>
        ))}
      </div>
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
};
