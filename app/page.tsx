export default function Home() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <p style={styles.label}>BIOVITAL V1</p>

        <h1 style={styles.title}>
          Dashboard de Replantes Ambientales
        </h1>

        <p style={styles.subtitle}>
          Sistema operativo para apoyar la toma de decisiones sobre demanda de replantes ambientales.
        </p>

        <div style={styles.status}>
          ✅ Estructura base creada correctamente
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "#f4f7f2",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  label: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 700,
    color: "#4f7f38",
    letterSpacing: "1px",
  },
  title: {
    margin: "10px 0",
    fontSize: "36px",
    color: "#1f2d1f",
  },
  subtitle: {
    fontSize: "17px",
    color: "#5f6f5c",
    lineHeight: 1.5,
  },
  status: {
    marginTop: "24px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "#edf7e8",
    color: "#2f6b22",
    fontWeight: 700,
  },
};
