import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    message: '',
    isError: false
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      };

      window.toggleContactPopup = () => {
        const popup = document.getElementById('contact-popup');
        if (popup) {
          popup.classList.toggle('hidden');
        }
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, message: '', isError: false });

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      company: e.target.company.value,
      message: e.target.message.value
    };

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error sending email');
      }

      setFormStatus({
        submitting: false,
        message: 'Melding sendt! Vi tar kontakt snart.',
        isError: false
      });
      
      // Clear form
      e.target.reset();
      
      // Close popup after 3 seconds
      setTimeout(() => {
        window.toggleContactPopup?.();
        setFormStatus({ submitting: false, message: '', isError: false });
      }, 3000);

    } catch (error) {
      setFormStatus({
        submitting: false,
        message: 'Beklager, noe gikk galt. Vennligst prøv igjen.',
        isError: true
      });
    }
  };

  return (
    <>
      <Head>
        <title>J.BUHS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="navbar">
        <div className="container">
          <h1 className="logo">J.BUHS</h1>
          <nav>
            <ul>
              <li><button onClick={() => window.scrollToSection?.('home')}>Hjem</button></li>
              <li><button onClick={() => window.scrollToSection?.('why')}>Hvorfor J.BUHS</button></li>
              <li><button onClick={() => window.scrollToSection?.('portfolio')}>Portefølje</button></li>
              <li><button onClick={() => window.toggleContactPopup?.()}>Kontakt oss</button></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="section home">
          <h2>Velkommen til J.BUHS</h2>
          <p>Lite tid?
            Vi hjelper deg med å automatisere prosesser slik at du kan fokusere på det viktigste.
            Ta kontakt for en uforpliktende prat om hva vi kan hjelpe deg med. Vi tilbyr de beste tjenestene for meget gode priser.
          </p>
        </section>

        <section id="why" className="section why">
          <h2>Hvorfor velge oss?</h2>
          <p>Vi leverer skreddersydde, gjennomførte og automatiserende løsninger slik at du kan fokusere på det viktigste.
            Alt vi gjør blir gjort etter kunders behov og ønsker.
            Vi har lang erfaring og kan hjelpe deg med alt fra nettsider til automatisering av prosesser.
            Vi har også et stort fokus på sikkerhet og personvern slik at du kan være trygg på at dine data er i trygge hender.
            Ta kontakt for en uforpliktende prat om hva vi kan hjelpe deg med.
            Videre har vi god erfaring med bedriftutvikling og har tidligere hjulpet bedrifter fra NOK 30 millioner i omsetning til over NOK 140 millioner i omsetning.
          </p>
        </section>

        <section id="portfolio" className="section portfolio">
          <h2>Portefølje</h2>
          <p>Se våre tidligere prosjekter og hva vi kan tilby.</p>

          <div className="portfolio-item">
            <h3>Gmail Automatisering</h3>
            <p>
              Denne løsningen bruker AI for å automatisere svar på e-poster, noe som kan redusere tiden brukt på kundekontakt med opptil <strong>95%</strong>.
              Dette gir mer effektiv kundehåndtering og raskere responstider.
            </p>
            <video id="portfolio-video" autoPlay loop muted>
              <source src="/Skjermopptak 2025-01-29 kl. 07.49.31.mp4" type="video/mp4" />
              Nettleseren din støtter ikke videoavspilling.
            </video>
          </div>
        </section>
      </main>

      <div id="contact-popup" className="popup hidden">
        <div className="popup-content">
          <button className="close-popup" onClick={() => window.toggleContactPopup?.()}>×</button>
          <h2>Kontakt oss</h2>
          <form id="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Navn:</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="email">E-post:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="company">Bedrift:</label>
            <input type="text" id="company" name="company" />
            <label htmlFor="message">Melding:</label>
            <textarea id="message" name="message" rows="4" required></textarea>
            <button type="submit" disabled={formStatus.submitting}>
              {formStatus.submitting ? 'Sender...' : 'Send'}
            </button>
            {formStatus.message && (
              <div className={`form-message ${formStatus.isError ? 'error' : 'success'}`}>
                {formStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p>© 2025 J.BUHS | Org.nr: 934 868 943 | All rights reserved</p>
        </div>
      </footer>
    </>
  );
}