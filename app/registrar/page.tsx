export default function RegistrarPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <img
          src="/logo-biovital.png"
          alt="BIOVITAL"
          style={styles.logo}
        />

        <h1 style={styles.title}>Registrar Censo</h1>

        <p style={styles.description}>
          Registre un nuevo censo de monitoreo ambiental utilizando el
          formulario oficial de BIOVITAL.
        </p>

        <a
          href="https://docs.google.com/forms/d/e/18tqEnm3dwWAyzlbjDMMlsaJfdWyDmDxBmEC1G7WTAEc/viewform"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.primaryButton}
        >
          🌱 Abrir Formulario
        </a>

        <a
          href="/"
          style={styles.secondaryButton}
        >
          ← Volver al Dashboard
        </a>

        <div style={styles.footer}>
          <strong>BIOVITAL</strong>
          <span>Monitoreo de biodiversidad y compromisos ambientales</span>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f7faf6, #eef5ec)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    fontFamily: 'Inter, Arial, sans-serif',
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '32px 24px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
    textAlign: 'center',
    border: '1px solid #e1eadf',
  },

  logo: {
    width: '120px',
    height: '120px',
    objectFit: 'contain',
    marginBottom: '12px',
  },

  title: {
    margin: '0 0 12px',
    color: '#0b3b28',
    fontSize: '32px',
    fontWeight: 800,
  },

  description: {
    color: '#53635a',
    fontSize: '15px',
    lineHeight: 1.5,
    marginBottom: '32px',
  },

  primaryButton: {
    display: 'block',
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #0f7a3c, #108e49)',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '16px',
    marginBottom: '14px',
    boxShadow: '0 8px 20px rgba(15,122,60,.18)',
  },

  secondaryButton: {
    display: 'block',
    width: '100%',
    padding: '14px',
    borderRadius: '14px',
    background: '#f4f7f3',
    color: '#0b3b28',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '15px',
    border: '1px solid #dce6d9',
  },

  footer: {
    marginTop: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    color: '#68766d',
    fontSize: '12px',
  },
};
