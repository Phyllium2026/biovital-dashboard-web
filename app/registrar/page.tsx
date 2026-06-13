export default function RegistrarPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <img
          src="/logo-biovital.png"
          alt="BIOVITAL"
          style={styles.logo}
        />

        <h1 style={styles.title}>Centro de Registro</h1>

        <p style={styles.description}>
          Seleccione el tipo de registro que desea realizar en BIOVITAL.
        </p>

        <a
          href="https://docs.google.com/forms/d/e/18tqEnm3dwWAyzlbjDMMlsaJfdWyDmDxBmEC1G7WTAEc/viewform"
          style={styles.primaryButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Registrar Censo
        </a>

        <a
          href="PEGA_AQUI_URL_PUBLICA_DEL_FORMULARIO_ESTADO_CENSOS"
          style={styles.secondaryActionButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          Actualizar Estado de Censos
        </a>

        <a href="/" style={styles.secondaryButton}>
          ← Volver al Dashboard
        </a>

        <div style={styles.footer}>
          <strong>BIOVITAL</strong>
          <span>
            Monitoreo de biodiversidad y compromisos ambientales
          </span>
        </div>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f7faf6, #eef5ec)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "Inter, Arial, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "440px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "28px 24px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
    textAlign: "center" as const,
    border: "1px solid #e1eadf",
  },

  logo: {
    width: "112px",
    height: "112px",
    objectFit: "contain" as const,
    marginBottom: "12px",
  },

  title: {
    margin: "0 0 12px",
    color: "#0b3b28",
    fontSize: "32px",
    fontWeight: 900,
  },

  description: {
    color: "#53635a",
    fontSize: "15px",
    lineHeight: 1.5,
    marginBottom: "24px",
  },

  primaryButton: {
    display: "flex",
    width: "100%",
    minHeight: "58px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #0f7a3c, #108e49)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: "16px",
    marginBottom: "14px",
    boxShadow: "0 8px 20px rgba(15,122,60,.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryActionButton: {
    display: "flex",
    width: "100%",
    minHeight: "56px",
    borderRadius: "14px",
    background: "#e9f6ed",
    color: "#0b3b28",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: "15px",
    marginBottom: "14px",
    border: "1px solid #cfe7d5",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButton: {
    display: "flex",
    width: "100%",
    minHeight: "54px",
    borderRadius: "14px",
    background: "#f4f7f3",
    color: "#0b3b28",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: "15px",
    border: "1px solid #dce6d9",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    marginTop: "26px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    color: "#68766d",
    fontSize: "12px",
  },
};
