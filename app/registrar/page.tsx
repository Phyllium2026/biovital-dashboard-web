export default function RegistrarPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <img src="/logo-biovital.png" alt="BIOVITAL" style={styles.logo} />

        <h1 style={styles.title}>Registrar Censo</h1>

        <p style={styles.description}>
          Acceda al registro oficial de censos o actualice el estado de avance de censos,
          informes, revisión ITO y carga en BIOVITAL.
        </p>

        <a
          href="https://docs.google.com/forms/d/e/18tqEnm3dwWAyzlbjDMMlsaJfdWyDmDxBmEC1G7WTAEc/viewform"
          style={styles.primaryButton}
        >
          
          Registrar Censo
        </a>

        <a
          href="https://docs.google.com/forms/d/1wGHBlVF1RpGrpDMlQbnPX1oCsdbzM_0w5FL6AQfXtMo/edit"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.secondaryActionButton}
        >
         
          Actualizar Estado de Censos
        </a>

        <a href="/" style={styles.secondaryButton}>
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

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h6l1 2h3v15H5V6h3l1-2Z" />
      <path d="M9 11h6" />
      <path d="M12 8v6" />
      <path d="M9 14h6" />
    </svg>
  );
}

function TrafficIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M4.9 4.9l2.1 2.1" />
      <path d="M17 17l2.1 2.1" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
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
    padding: '24px',
    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
    textAlign: 'center',
    border: '1px solid #e1eadf',
  },
  logo: {
    width: '118px',
    height: '118px',
    objectFit: 'contain',
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 12px',
    color: '#0b3b28',
    fontSize: '32px',
    fontWeight: 900,
  },
  description: {
    color: '#53635a',
    fontSize: '15px',
    lineHeight: 1.5,
    marginBottom: '24px',
  },
  primaryButton: {
    display: 'flex',
    width: '100%',
    minHeight: '58px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #0f7a3c, #108e49)',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: 900,
    fontSize: '16px',
    marginBottom: '12px',
    boxShadow: '0 8px 20px rgba(15,122,60,.18)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  secondaryActionButton: {
    display: 'flex',
    width: '100%',
    minHeight: '56px',
    borderRadius: '14px',
    background: '#ffffff',
    color: '#0f7a3c',
    textDecoration: 'none',
    fontWeight: 900,
    fontSize: '15px',
    border: '1px solid #cfe8d8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  secondaryButton: {
    display: 'flex',
    width: '100%',
    minHeight: '54px',
    borderRadius: '14px',
    background: '#f4f7f3',
    color: '#0b3b28',
    textDecoration: 'none',
    fontWeight: 800,
    fontSize: '15px',
    border: '1px solid #dce6d9',
    alignItems: 'center',
    justifyContent: 'center',
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
