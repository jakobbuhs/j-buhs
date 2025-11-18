import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    message: '',
    isError: false
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Handle scroll effect for navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Smooth scroll function
    if (typeof window !== 'undefined') {
      window.scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const offset = 80; // Navbar height
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };

      window.toggleContactPopup = () => {
        const popup = document.getElementById('contact-popup');
        if (popup) {
          popup.classList.toggle('hidden');
        }
      };
    }

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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
        <title>TechFlow - App Utvikling & Digitale Løsninger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Vi utvikler skreddersydde apper og digitale løsninger som tar bedriften din til neste nivå. Få din egen app fra 50.000 NOK." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <h1 className="logo">TechFlow</h1>
          <nav>
            <ul>
              <li><button onClick={() => window.scrollToSection?.('home')}>Hjem</button></li>
              <li><button onClick={() => window.scrollToSection?.('why')}>Hvorfor oss</button></li>
              <li><button onClick={() => window.scrollToSection?.('portfolio')}>Portefølje</button></li>
              <li><button onClick={() => window.scrollToSection?.('pricing')}>Priser</button></li>
              <li><button onClick={() => window.toggleContactPopup?.()}>Kontakt oss</button></li>
            </ul>
          </nav>
          <button className="mobile-menu-toggle" aria-label="Meny">
            ☰
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="container">
            <div className="hero-content">
              <span className="hero-tag">Automatisering & Digitale Løsninger</span>
              <h1>Mer tid til det som betyr mest</h1>
              <p>
                Vi hjelper deg med å automatisere prosesser og skape digitale løsninger som frigjør tiden din. 
                La teknologien jobbe for deg, slik at du kan fokusere på å vokse.
              </p>
              <button className="hero-cta" onClick={() => window.scrollToSection?.('portfolio')}>
                Se våre løsninger
              </button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Hvorfor velge J.BUHS?</h2>
              <p className="section-description">
                Vi leverer skreddersydde løsninger som er tilpasset akkurat dine behov. 
                Med fokus på automatisering, sikkerhet og resultater.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card animate-on-scroll fade-in-up-delay-1">
                <div className="feature-icon">🚀</div>
                <h3>Skreddersydde løsninger</h3>
                <p>
                  Hver løsning tilpasses dine spesifikke behov og utfordringer. 
                  Vi lytter, forstår og leverer nøyaktig det du trenger.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-2">
                <div className="feature-icon">⚡</div>
                <h3>Effektiv automatisering</h3>
                <p>
                  Spar opptil 95% av tiden på repeterende oppgaver. 
                  La AI og automatisering gjøre jobben mens du fokuserer på vekst.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-3">
                <div className="feature-icon">🔒</div>
                <h3>Sikkerhet først</h3>
                <p>
                  Dine data er i trygge hender. Vi har stort fokus på sikkerhet og personvern 
                  i alle våre løsninger.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-1">
                <div className="feature-icon">📈</div>
                <h3>Dokumenterte resultater</h3>
                <p>
                  Vi har hjulpet bedrifter fra NOK 30 millioner til over NOK 140 millioner i omsetning. 
                  Erfaring som gir resultater.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-2">
                <div className="feature-icon">💡</div>
                <h3>Innovativ teknologi</h3>
                <p>
                  Vi bruker de nyeste teknologiene innen AI og automatisering for å gi deg 
                  konkurransefortrinn.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-3">
                <div className="feature-icon">🤝</div>
                <h3>Personlig oppfølging</h3>
                <p>
                  Du får dedikert støtte og oppfølging gjennom hele prosessen. 
                  Vi er med deg hele veien.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="section section-light">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Våre løsninger</h2>
              <p className="section-description">
                Se hvordan vi har hjulpet bedrifter med å automatisere prosesser og spare verdifull tid.
              </p>
            </div>

            <div className="portfolio-grid">
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container">
                  <video autoPlay loop muted playsInline>
                    <source src="/Skjermopptak 2025-01-29 kl. 07.49.31.mp4" type="video/mp4" />
                    Nettleseren din støtter ikke videoavspilling.
                  </video>
                </div>
                <div className="content-container">
                  <h3>Gmail Automatisering</h3>
                  <p>
                    Denne løsningen bruker AI for å automatisere svar på e-poster, noe som kan redusere 
                    tiden brukt på kundekontakt med opptil <strong>95%</strong>. Dette gir mer effektiv 
                    kundehåndtering og raskere responstider, slik at teamet ditt kan fokusere på viktigere oppgaver.
                  </p>
                  <p style={{ marginTop: '1rem', color: '#1e3a8a', fontWeight: '600' }}>
                    ✓ Automatiske svar basert på AI<br/>
                    ✓ 95% tidsbesparelse<br/>
                    ✓ Bedre kundetilfredshet
                  </p>
                </div>
              </div>

              <div className="portfolio-item animate-on-scroll">
                <div className="video-container">
                  <video autoPlay loop muted playsInline>
                    <source src="/Skjermopptak%202025-01-31%20kl.%2021.25.27.mp4" type="video/mp4"/>
                    Nettleseren din støtter ikke videoavspilling.
                  </video>
                </div>
                <div className="content-container">
                  <h3>AI Produktbeskrivelse Generator</h3>
                  <p>
                    Vår AI-drevne produktbeskrivelse generator hjelper deg med å lage profesjonelle, 
                    SEO-optimaliserte beskrivelser på sekunder. Perfekt for nettbutikker som ønsker 
                    å spare tid og forbedre konvertering samtidig.
                  </p>
                  <p style={{ marginTop: '1rem', color: '#1e3a8a', fontWeight: '600' }}>
                    ✓ SEO-optimaliserte beskrivelser<br/>
                    ✓ Ferdig på sekunder<br/>
                    ✓ Profesjonell kvalitet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Apps Matter Section */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Hvorfor trenger bedriften din en app?</h2>
              <p className="section-description">
                I dagens digitale verden er en skreddersydd app ikke lenger en luksus - det er en nødvendighet 
                for bedrifter som ønsker å være konkurransedyktige.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card animate-on-scroll fade-in-up-delay-1" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>📱</div>
                <h3 style={{ color: 'white' }}>Tilgjengelighet 24/7</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Kundene dine får tilgang til dine tjenester når som helst, hvor som helst. 
                  Ingen åpningstider, ingen begrensninger.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-2" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>🚀</div>
                <h3 style={{ color: 'white' }}>Økt produktivitet</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Automatiser arbeidsflyter, reduser manuelt arbeid og la teamet ditt fokusere 
                  på det som skaper verdi.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-3" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>💰</div>
                <h3 style={{ color: 'white' }}>Kostnadsbesparelser</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Automatisering kan redusere driftskostnader med opptil 70% ved å 
                  erstatte manuelle prosesser.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-1" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>📊</div>
                <h3 style={{ color: 'white' }}>Bedre innsikt</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Få verdifull data om hvordan kundene bruker tjenestene dine og ta 
                  informerte beslutninger basert på faktisk bruk.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-2" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>💎</div>
                <h3 style={{ color: 'white' }}>Konkurransefortrinn</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Skill deg ut fra konkurrentene med en profesjonell app som gir kundene 
                  dine en overlegen opplevelse.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-3" style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>🎯</div>
                <h3 style={{ color: 'white' }}>Direkte kommunikasjon</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Kommuniser direkte med kundene dine gjennom push-varsler, tilbud og 
                  personaliserte meldinger.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Transparente priser</h2>
              <p className="section-description">
                Vi tror på åpenhet. Her er våre startpriser for ulike typer løsninger. 
                Kontakt oss for et skreddersydd tilbud tilpasset dine behov.
              </p>
            </div>

            <div className="pricing-grid">
              <div className="pricing-card animate-on-scroll fade-in-up-delay-1">
                <div className="pricing-header">
                  <h3>Enkel App</h3>
                  <div className="price">
                    <span className="price-amount">50.000,-</span>
                    <span className="price-period">fra</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>✓ Grunnleggende funksjonalitet</li>
                  <li>✓ Responsivt design</li>
                  <li>✓ Brukervennlig interface</li>
                  <li>✓ 3 måneders support</li>
                  <li>✓ Grunnleggende sikkerhet</li>
                  <li>✓ Deployment</li>
                </ul>
                <button className="pricing-cta" onClick={() => window.toggleContactPopup?.()}>
                  Få tilbud
                </button>
              </div>

              <div className="pricing-card featured animate-on-scroll fade-in-up-delay-2">
                <div className="featured-badge">Mest populær</div>
                <div className="pricing-header">
                  <h3>Avansert App</h3>
                  <div className="price">
                    <span className="price-amount">150.000,-</span>
                    <span className="price-period">fra</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>✓ Alt i Enkel App</li>
                  <li>✓ Database-integrasjon</li>
                  <li>✓ API-utvikling</li>
                  <li>✓ Brukerautentisering</li>
                  <li>✓ Admin-panel</li>
                  <li>✓ 6 måneders support</li>
                  <li>✓ Push-varsler</li>
                  <li>✓ Analytics-integrasjon</li>
                </ul>
                <button className="pricing-cta primary" onClick={() => window.toggleContactPopup?.()}>
                  Få tilbud
                </button>
              </div>

              <div className="pricing-card animate-on-scroll fade-in-up-delay-3">
                <div className="pricing-header">
                  <h3>Enterprise-løsning</h3>
                  <div className="price">
                    <span className="price-amount">Tilpasset</span>
                    <span className="price-period">pris</span>
                  </div>
                </div>
                <ul className="pricing-features">
                  <li>✓ Alt i Avansert App</li>
                  <li>✓ Skreddersydd arkitektur</li>
                  <li>✓ Skalerbar infrastruktur</li>
                  <li>✓ Avansert sikkerhet</li>
                  <li>✓ Dedikert support</li>
                  <li>✓ SLA-garantier</li>
                  <li>✓ Integrasjoner</li>
                  <li>✓ Continuous deployment</li>
                </ul>
                <button className="pricing-cta" onClick={() => window.toggleContactPopup?.()}>
                  Kontakt oss
                </button>
              </div>
            </div>

            <div className="pricing-note animate-on-scroll" style={{ marginTop: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                <strong>Merk:</strong> Alle priser er startpriser og kan variere basert på kompleksitet, 
                funksjonalitet og dine spesifikke behov. Kontakt oss for et nøyaktig tilbud.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Klar for å ta bedriften din til neste nivå?</h2>
              <p className="section-description">
                La oss skape en skreddersydd løsning som passer perfekt for din bedrift. 
                Ta kontakt i dag for en uforpliktende prat.
              </p>
              <button 
                className="hero-cta" 
                onClick={() => window.toggleContactPopup?.()}
                style={{ marginTop: '2rem' }}
              >
                Kontakt oss i dag
              </button>
            </div>
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
          <div className="footer-section">
            <h3>TechFlow</h3>
            <p>Vi utvikler skreddersydde apper og digitale løsninger for fremtidens bedrifter.</p>
          </div>
          <div className="footer-section">
            <h3>Driftes av</h3>
            <p>Miljø-IT AS</p>
            <p>Org.nr: 992 874 058</p>
          </div>
          <div className="footer-section">
            <h3>Kontakt</h3>
            <p>Daglig leder: Jakob Buhs</p>
            <p>Telefon: 95498228</p>
            <p>E-post: jakob@jbuhs.no</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2025 TechFlow. Alle rettigheter reservert.</p>
          </div>
        </div>
      </footer>
    </>
  );
}