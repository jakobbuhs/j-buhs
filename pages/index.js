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

        {/* Stats Section */}
        <section className="section section-light" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className="container">
            <div className="stats-grid animate-on-scroll">
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Apper utviklet</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Tidsbesparelse</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Kundetilfredshet</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support tilgjengelig</div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Våre løsninger</h2>
              <p className="section-description">
                Vi har utviklet skreddersydde løsninger for ulike bransjer - fra e-handel til regnskap. 
                Hver app er bygget med fokus på automatisering, effektivitet og brukervennlighet.
              </p>
            </div>

            <div className="portfolio-grid">
              {/* Gmail Automation */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container">
                  <video autoPlay loop muted playsInline>
                    <source src="/Skjermopptak 2025-01-29 kl. 07.49.31.mp4" type="video/mp4" />
                    Nettleseren din støtter ikke videoavspilling.
                  </video>
                </div>
                <div className="content-container">
                  <div className="project-category">Kundeservice Automatisering</div>
                  <h3>Gmail AI Automatisering</h3>
                  <p>
                    En revolusjonerende løsning som bruker avansert AI for å automatisere e-posthåndtering. 
                    Systemet analyserer innkommende e-poster, forstår kontekst og sender intelligente, 
                    personaliserte svar automatisk.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">95%</span>
                      <span className="metric-label">Mindre tid på e-post</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">10x</span>
                      <span className="metric-label">Raskere responstid</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">AI/ML</span>
                    <span className="tech-tag">Gmail API</span>
                    <span className="tech-tag">Natural Language Processing</span>
                  </div>
                </div>
              </div>

              {/* Product Description Generator */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container">
                  <video autoPlay loop muted playsInline>
                    <source src="/Skjermopptak%202025-01-31%20kl.%2021.25.27.mp4" type="video/mp4"/>
                    Nettleseren din støtter ikke videoavspilling.
                  </video>
                </div>
                <div className="content-container">
                  <div className="project-category">E-handel Verktøy</div>
                  <h3>AI Produktbeskrivelse Generator</h3>
                  <p>
                    Kraftig AI-drevet verktøy som genererer overbevisende, SEO-optimaliserte produktbeskrivelser 
                    på sekunder. Perfekt for nettbutikker med hundrevis eller tusenvis av produkter som trenger 
                    unike, engasjerende beskrivelser.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">100+</span>
                      <span className="metric-label">Beskrivelser/time</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">40%</span>
                      <span className="metric-label">Økt konvertering</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">AI/GPT</span>
                    <span className="tech-tag">SEO Optimalisering</span>
                    <span className="tech-tag">Bulk Processing</span>
                  </div>
                </div>
              </div>

              {/* iOS POS Shopify App */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📱</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>iOS POS System</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>Shopify Integration</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Retail & E-handel</div>
                  <h3>iOS POS Shopify App</h3>
                  <p>
                    Komplett kassasystem (Point of Sale) for iOS med sømløs Shopify-integrasjon. 
                    Gjør det mulig for butikker å håndtere salg både i fysisk butikk og online fra én plattform. 
                    Sanntidssynkronisering av lager, produkter og kundedata.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">Sanntid</span>
                      <span className="metric-label">Lagersynkronisering</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">Multi-kanal</span>
                      <span className="metric-label">Salg håndtering</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">iOS/Swift</span>
                    <span className="tech-tag">Shopify API</span>
                    <span className="tech-tag">Real-time Sync</span>
                    <span className="tech-tag">Payment Integration</span>
                  </div>
                </div>
              </div>

              {/* Dealer Tracker */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Dealer Tracker</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>Delay Management System</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Supply Chain Management</div>
                  <h3>Dealer Tracking System</h3>
                  <p>
                    Avansert system for å spore og håndtere forsinkelser fra leverandører og dealers. 
                    Automatisk logging av alle endringer, delay-notifikasjoner, og omfattende rapportering. 
                    Gir fullstendig oversikt over leverandørkjeden og identifiserer mønstre i forsinkelser.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">Auto</span>
                      <span className="metric-label">Change logging</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">Real-time</span>
                      <span className="metric-label">Varsler</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Node.js</span>
                    <span className="tech-tag">Real-time Updates</span>
                    <span className="tech-tag">Analytics</span>
                  </div>
                </div>
              </div>

              {/* PowerOffice Bookkeeping App */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Automatisk Regnskap</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>PowerOffice Integration</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Økonomi & Regnskap</div>
                  <h3>PowerOffice Journal Entry App</h3>
                  <p>
                    Intelligent regnskapsløsning som automatiserer bilagsføring i PowerOffice. 
                    AI-drevet system som kategoriserer transaksjoner, validerer data og fører bilag 
                    automatisk i riktig konto. Reduserer regnskapsarbeid fra timer til minutter.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">90%</span>
                      <span className="metric-label">Mindre manuelt arbeid</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">100%</span>
                      <span className="metric-label">Nøyaktighet</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">PowerOffice API</span>
                    <span className="tech-tag">AI Classification</span>
                    <span className="tech-tag">Automation</span>
                    <span className="tech-tag">Validation</span>
                  </div>
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