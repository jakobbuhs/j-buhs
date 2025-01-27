// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');

  themeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  // Preserve theme across sessions
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  // Smooth scroll for navigation
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Dynamic project videos
  const projectCards = document.querySelectorAll('.project-card video');
  projectCards.forEach(video => {
    video.addEventListener('mouseenter', () => video.play());
    video.addEventListener('mouseleave', () => video.pause());
  });

  // Consultation button handler
  const consultationButton = document.querySelector('.btn-primary[href="#consultation"]');
  consultationButton?.addEventListener('click', () => {
    alert('Takk for interessen! Vi kontakter deg snart for en gratis konsultasjon.');
  });

  // Contact form submission (mockup)
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    console.log('Form submitted:', Object.fromEntries(formData));
    alert('Takk! Din melding er sendt.');
    contactForm.reset();
  });

  // Animate elements on scroll
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade').forEach(el => observer.observe(el));
});
