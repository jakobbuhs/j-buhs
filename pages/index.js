import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    message: '',
    isError: false
  });
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [calculatorValues, setCalculatorValues] = useState({
    taskTime: 1, // hours
    employeeValue: 800, // kr per hour
    numberOfEmployees: 1
  });

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    // Handle scroll effect for navbar and parallax
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Parallax effect for hero content
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
      }
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

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

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
        <title>DriftSmart - App Utvikling & Digitale Løsninger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Vi utvikler skreddersydde apper og digitale løsninger som tar bedriften din til neste nivå. Få din egen app fra 50.000 NOK." />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.webp" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.webp" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.webp" />
        <link rel="shortcut icon" href="/favicon.webp" />
      </Head>

      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo" onClick={() => window.scrollToSection?.('home')} style={{ cursor: 'pointer' }}>
            <img src="/full_size_logo.webp" alt="DriftSmart Logo" style={{ height: '48px', width: 'auto' }} />
          </div>
          <nav>
            <ul>
              <li><button onClick={() => window.scrollToSection?.('home')}>Hjem</button></li>
              <li><button onClick={() => window.scrollToSection?.('why')}>Hvorfor oss</button></li>
              <li><button onClick={() => window.scrollToSection?.('portfolio')}>Portefølje</button></li>
              <li><button onClick={() => window.scrollToSection?.('pricing')}>Priser</button></li>
              <li><button onClick={() => window.scrollToSection?.('about')}>Om oss</button></li>
              <li><button onClick={() => window.toggleContactPopup?.()}>Kontakt oss</button></li>
            </ul>
          </nav>
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            style={{
              background: 'transparent',
              border: '2px solid var(--blue)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              marginLeft: '1rem',
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="mobile-menu-toggle" aria-label="Meny">
            ☰
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero">
          <video autoPlay loop muted playsInline className="hero-video" poster="/favicon.webp">
            <source src="/northern_lights.mp4" type="video/mp4" />
            {/* Add your atmospheric video here - replace the source above with your video file */}
          </video>
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-headline">Smarte Løsninger for Moderne Drift</h1>
              <p className="hero-subtitle">Vi digitaliserer og automatiserer bedriftens arbeidsprosesser med skreddersydde løsninger</p>
              <div className="hero-buttons">
                <button className="hero-cta-primary" onClick={() => window.toggleContactPopup?.()}>
                  Start Ditt Prosjekt
                </button>
                <button className="hero-cta-secondary" onClick={() => window.scrollToSection?.('portfolio')}>
                  Se Våre Løsninger ↓
                </button>
              </div>
            </div>
          </div>
          <div className="scroll-indicator" onClick={() => window.scrollToSection?.('calculator')} style={{ cursor: 'pointer' }}>
            <span>↓</span>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Hvorfor velge DriftSmart?</h2>
              <p className="section-description">
                Vi leverer skreddersydde løsninger som er tilpasset akkurat dine behov. 
                Med fokus på automatisering, sikkerhet og resultater.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card animate-on-scroll fade-in-up-delay-1">
                <div className="feature-icon">⚡</div>
                <h3>Lynrask levering</h3>
                <p>
                  <strong>MVP på 1 dag på forespørsel!</strong> Mens andre bruker uker på planlegging, 
                  leverer vi funksjonelle løsninger umiddelbart. Raske iterasjoner og endringer er vår superkraft.
                </p>
              </div>

              <div className="feature-card animate-on-scroll fade-in-up-delay-2">
                <div className="feature-icon">🚀</div>
                <h3>Skreddersydde løsninger</h3>
                <p>
                  Hver løsning tilpasses dine spesifikke behov og utfordringer. 
                  Vi lytter, forstår og leverer nøyaktig det du trenger - raskt og effektivt.
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
            <div className="stats-grid animate-on-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
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

        {/* Savings Calculator Section */}
        <section id="calculator" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Beregn din potensielle besparelse</h2>
              <p className="section-description">
                Se hvor mye du kan spare ved å automatisere repetetive oppgaver. 
                Juster verdiene nedenfor for å se beregnet besparelse.
              </p>
            </div>

            <div className="calculator-container animate-on-scroll" style={{ 
              maxWidth: '900px', 
              margin: '0 auto', 
              background: 'var(--white)',
              borderRadius: '20px',
              padding: '3rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
              {/* Task Time Slider */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-dark)'
                }}>
                  Hvor lang tid tar en repetetiv oppgave? 
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '800', 
                    color: 'var(--blue)', 
                    marginLeft: '1rem' 
                  }}>
                    {calculatorValues.taskTime.toFixed(1)} timer
                  </span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="40"
                  step="0.5"
                  value={calculatorValues.taskTime}
                  onChange={(e) => setCalculatorValues({...calculatorValues, taskTime: parseFloat(e.target.value)})}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    background: 'var(--gray)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>0.5 timer</span>
                  <span>40 timer</span>
                </div>
              </div>

              {/* Employee Value Slider */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-dark)'
                }}>
                  Produktiv verdi per ansatt per time
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '800', 
                    color: 'var(--blue)', 
                    marginLeft: '1rem' 
                  }}>
                    {calculatorValues.employeeValue.toLocaleString('no-NO')} kr/time
                  </span>
                </label>
                <input
                  type="range"
                  min="400"
                  max="2000"
                  step="50"
                  value={calculatorValues.employeeValue}
                  onChange={(e) => setCalculatorValues({...calculatorValues, employeeValue: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    background: 'var(--gray)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>400 kr/time</span>
                  <span>2000 kr/time</span>
                </div>
              </div>

              {/* Number of Employees Slider */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  marginBottom: '1rem',
                  color: 'var(--text-dark)'
                }}>
                  Hvor mange ansatte påvirkes av denne løsningen?
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '800', 
                    color: 'var(--blue)', 
                    marginLeft: '1rem' 
                  }}>
                    {calculatorValues.numberOfEmployees} ansatte
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={calculatorValues.numberOfEmployees}
                  onChange={(e) => setCalculatorValues({...calculatorValues, numberOfEmployees: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '5px',
                    background: 'var(--gray)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                  <span>1 ansatt</span>
                  <span>50 ansatte</span>
                </div>
              </div>

              {/* Calculations */}
              {(() => {
                // Assuming tasks are done daily (5 days a week, ~22 working days per month)
                const tasksPerMonth = 22; // working days
                const hoursSavedPerMonth = calculatorValues.taskTime * tasksPerMonth * calculatorValues.numberOfEmployees;
                const monthlySavings = hoursSavedPerMonth * calculatorValues.employeeValue;
                const serviceCost = 150000;
                const monthsToRecoup = monthlySavings > 0 ? (serviceCost / monthlySavings) : 0;
                const annualSavings = monthlySavings * 12;

                return (
                    <div className="calculator-results" style={{
                      borderRadius: '16px',
                      padding: '2.5rem',
                      marginTop: '2rem'
                    }}>
                      <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        marginBottom: '1.5rem',
                        color: 'var(--text-dark)',
                        textAlign: 'center'
                      }}>
                        Din estimerte besparelse
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800', 
                            color: 'var(--blue)',
                            marginBottom: '0.5rem'
                          }}>
                            {hoursSavedPerMonth.toFixed(0)}
                          </div>
                          <div className="calculator-label" style={{ fontSize: '0.95rem' }}>
                            Timer spart per måned
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800', 
                            color: '#10b981',
                            marginBottom: '0.5rem'
                          }}>
                            {monthlySavings.toLocaleString('no-NO')} kr
                          </div>
                          <div className="calculator-label" style={{ fontSize: '0.95rem' }}>
                            Månedlig besparelse
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800', 
                            color: '#10b981',
                            marginBottom: '0.5rem'
                          }}>
                            {annualSavings.toLocaleString('no-NO')} kr
                          </div>
                          <div className="calculator-label" style={{ fontSize: '0.95rem' }}>
                            Årlig besparelse
                          </div>
                        </div>
                      </div>
                      <div className="calculator-investment-box" style={{
                        background: 'var(--white)',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '2px solid var(--blue)'
                      }}>
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                          <div className="calculator-label" style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: '600', 
                            marginBottom: '0.5rem'
                          }}>
                            Investering: 150.000 kr
                          </div>
                          <div style={{ 
                            fontSize: '2rem', 
                            fontWeight: '800', 
                            color: 'var(--blue)'
                          }}>
                            {monthsToRecoup > 0 && monthsToRecoup < 1000 ? (
                              <>
                                {monthsToRecoup < 1 
                                  ? `${Math.ceil(monthsToRecoup * 30)} dager` 
                                  : monthsToRecoup < 12
                                  ? `${monthsToRecoup.toFixed(1)} måneder`
                                  : `${(monthsToRecoup / 12).toFixed(1)} år`
                                } til tilbakebetaling
                              </>
                            ) : (
                              'Beregning ikke tilgjengelig'
                            )}
                          </div>
                        </div>
                        {monthsToRecoup > 0 && monthsToRecoup < 12 && (
                          <div style={{
                            textAlign: 'center',
                            fontSize: '0.95rem',
                            color: '#10b981',
                            fontWeight: '600'
                          }}>
                            ✓ Din investering betaler seg tilbake i løpet av {monthsToRecoup < 1 ? 'første måned' : 'året'}!
                          </div>
                        )}
                      </div>
                    </div>
                );
              })()}
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

        {/* Portfolio Section */}
        <section id="portfolio" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Noen av løsnignene vi har laget for våre kunder</h2>
              <p className="section-description">
                Vi har utviklet skreddersydde løsninger for ulike bransjer - fra e-handel til regnskap. 
                Hver app er bygget med fokus på automatisering, effektivitet og brukervennlighet.
              </p>
            </div>

            <div className="portfolio-grid">
              {/* iOS POS Shopify App */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📱</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>iOS POS System</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>Shopify Integrasjon</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Butikk & E-handel</div>
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
                    <span className="tech-tag">Sanntids Synkronisering</span>
                    <span className="tech-tag">Betalingsintegrasjon</span>
                  </div>
                </div>
              </div>

              {/* Dealer Tracker */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Dealer Tracker</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>Forsinkelseshåndtering</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Forsyningskjedestyring</div>
                  <h3>Dealer Tracking System</h3>
                  <p>
                    Avansert system for å spore og håndtere forsinkelser fra leverandører og dealers. 
                    Automatisk logging av alle endringer, delay-notifikasjoner, og omfattende rapportering. 
                    Gir fullstendig oversikt over leverandørkjeden og identifiserer mønstre i forsinkelser.
                  </p>
                  <div className="project-metrics">
                    <div className="metric">
                      <span className="metric-value">Auto</span>
                      <span className="metric-label">Endringslogging</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">Sanntid</span>
                      <span className="metric-label">Varsler</span>
                    </div>
                  </div>
                  <div className="project-tech">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Node.js</span>
                    <span className="tech-tag">Sanntids Oppdateringer</span>
                    <span className="tech-tag">Analyseverktøy</span>
                  </div>
                </div>
              </div>

              {/* PowerOffice Bookkeeping App */}
              <div className="portfolio-item animate-on-scroll">
                <div className="video-container" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>Automatisk Regnskap</div>
                    <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: '0.9' }}>PowerOffice Integrasjon</div>
                  </div>
                </div>
                <div className="content-container">
                  <div className="project-category">Økonomi & Regnskap</div>
                  <h3>PowerOffice AI Bilagsføring</h3>
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
                    <span className="tech-tag">AI Klassifisering</span>
                    <span className="tech-tag">Automatisering</span>
                    <span className="tech-tag">Validering</span>
                  </div>
                </div>
              </div>

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
                    <span className="tech-tag">Naturlig Språkbehandling</span>
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
                    <span className="tech-tag">Massebehandling</span>
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

        {/* Team/About Section */}
        <section id="about" className="section section-light">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Møt teamet bak DriftSmart</h2>
              <p className="section-description">
                Vi er et dedikert team av utviklere og automatiseringseksperter som brenner for 
                å hjelpe norske bedrifter med å vokse gjennom smart teknologi.
              </p>
            </div>

            <div className="team-grid">
              <div className="team-member animate-on-scroll fade-in-up-delay-1">
                <div className="team-photo">
                  <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', width: '100%', height: '250px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                    👨‍💻
                  </div>
                </div>
                <div className="team-info">
                  <h3>Jakob Buhs</h3>
                  <p className="team-role">Daglig leder & Gründer</p>
                  <p className="team-bio">
                    Dataingeniør: Spesialist i RPA og AI-automatisering med lidenskap for å levere raske, 
                    effektive løsninger. Erfaring fra å skalere bedrifter fra NOK 30M til 140M+.
                  </p>
                  <div className="team-contact">
                    <a href="mailto:jakob@jbuhs.no">📧 jakob@jbuhs.no</a>
                    <a href="tel:+4795498228">📞 954 98 228</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="company-stats animate-on-scroll" style={{ marginTop: '4rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-dark)' }}>
                Hvorfor velge oss?
              </h3>
              <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem' }}>1 dag</div>
                  <div style={{ color: '#64748b' }}>MVP-levering</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem' }}>2-3 uker</div>
                  <div style={{ color: '#64748b' }}>Pilot-resultater</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem' }}>100%</div>
                  <div style={{ color: '#64748b' }}>Norsk support</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem' }}>24/7</div>
                  <div style={{ color: '#64748b' }}>Tilgjengelighet</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="section section-gradient">
          <div className="container">
            <div className="section-header animate-on-scroll">
              <h2 className="section-title">Ofte stilte spørsmål</h2>
              <p className="section-description">
                Vi besvarer de vanligste spørsmålene om våre tjenester og prosesser.
              </p>
            </div>

            <div className="faq-grid">
              <div className="faq-item animate-on-scroll fade-in-up-delay-1">
                <h3>Hvor raskt kan vi se resultater?</h3>
                <p>
                  Vi kan levere en fungerende MVP på én dag på forespørsel! Pilot-prosjekter viser 
                  målbare resultater i løpet av 2-3 uker. Fullstendige automatiseringsprogrammer 
                  leverer ROI innen 3-6 måneder i gjennomsnitt.
                </p>
              </div>

              <div className="faq-item animate-on-scroll fade-in-up-delay-2">
                <h3>Hva koster det å komme i gang?</h3>
                <p>
                  Vi har transparente priser fra NOK 50.000 for enkle apper. Kompleksiteten 
                  varierer basert på dine behov. Vi tilbyr alltid en gratis konsultasjon for å 
                  gi deg et nøyaktig pristilbud før vi starter.
                </p>
              </div>

              <div className="faq-item animate-on-scroll fade-in-up-delay-3">
                <h3>Hvilken teknisk kunnskap trenger vi?</h3>
                <p>
                  Ingen! Vi håndterer all teknisk implementering og gir opplæring slik at ditt 
                  ikke-tekniske team kan bruke løsningene. Målet vårt er at dere skal eie og 
                  forstå løsningen.
                </p>
              </div>

              <div className="faq-item animate-on-scroll fade-in-up-delay-1">
                <h3>Hva om det ikke fungerer for vår prosess?</h3>
                <p>
                  Vi gjennomfører gratis prosessvurderinger før enhver forpliktelse. Hvis 
                  automatisering ikke er en god løsning, vil vi si det ærlig. Vi vil heller 
                  bygge langsiktige relasjoner enn å selge upassende løsninger.
                </p>
              </div>

              <div className="faq-item animate-on-scroll fade-in-up-delay-2">
                <h3>Får vi support etter lansering?</h3>
                <p>
                  Ja! Alle prosjekter inkluderer support-periode (3-6 måneder avhengig av pakke). 
                  Vi tilbyr også månedlig support uten langsiktige kontrakter. Du kan når som helst 
                  kontakte oss for raske endringer.
                </p>
              </div>

              <div className="faq-item animate-on-scroll fade-in-up-delay-3">
                <h3>Hvor lang tid tar en typisk implementering?</h3>
                <p>
                  Enkle apper: 2-4 uker. Avanserte løsninger: 4-8 uker. Enterprise-løsninger: 
                  8-12 uker. Vi leverer raskt ved å fokusere på MVP først, deretter itererer vi 
                  basert på tilbakemelding.
                </p>
              </div>
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
                Få et fungerende MVP på 1 dag - ta kontakt i dag for en uforpliktende prat.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                <button 
                  className="hero-cta-primary" 
                  onClick={() => window.toggleContactPopup?.()}
                >
                  Book gratis konsultasjon
                </button>
                <a 
                  href="mailto:jakob@jbuhs.no" 
                  className="hero-cta-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                >
                  📧 Send e-post
                </a>
              </div>
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
            <div style={{ marginBottom: '1rem' }}>
              <img src="/full_size_logo.webp" alt="DriftSmart Logo" style={{ height: '32px', width: 'auto' }} />
            </div>
            <p style={{ marginBottom: '1rem' }}>Vi utvikler skreddersydde apper og digitale løsninger for fremtidens bedrifter.</p>
            <p><strong>🚀 MVP på 1 dag på forespørsel</strong></p>
            <p>Rask utvikling • Norsk support • Transparente priser</p>
          </div>
          <div className="footer-section">
            <h3>Kontakt oss</h3>
            <p><strong>Daglig leder:</strong> Jakob Buhs</p>
            <p>📞 <a href="tel:+4795498228" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>954 98 228</a></p>
            <p>📧 <a href="mailto:jakob@jbuhs.no" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>jakob@jbuhs.no</a></p>
            <p style={{ marginTop: '0.5rem' }}><strong>Responstid:</strong> Innen 24 timer</p>
            <p><strong>Åpningstider:</strong> Man-Fre 09:00-17:00</p>
          </div>
          <div className="footer-section">
            <h3>Firma informasjon</h3>
            <p><strong>Driftes av:</strong> Miljø-IT AS</p>
            <p><strong>Org.nr:</strong> 992 874 058</p>
            <p><strong>Lokasjon:</strong> Norge</p>
            <div style={{ marginTop: '1rem' }}>
              <button 
                onClick={() => window.scrollToSection?.('home')} 
                style={{ 
                  background: 'var(--white)', 
                  color: 'var(--blue)', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginTop: '0.5rem'
                }}
              >
                Tilbake til toppen ↑
              </button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2025 DriftSmart. Alle rettigheter reservert. | Lynrask utvikling • MVP på 1 dag</p>
          </div>
        </div>
      </footer>
    </>
  );
}