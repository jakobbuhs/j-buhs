// Skroll til seksjoner
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

// Vis/skjul kontakt pop-up
function toggleContactPopup() {
  const popup = document.getElementById('contact-popup');
  popup.classList.toggle('hidden');
}

// Håndter innsending av skjema (for eksempel sender e-post)
document.getElementById('contact-form').addEventListener('submit', function (event) {
  event.preventDefault();
  alert('Takk for din melding! Vi kontakter deg snart.');
  toggleContactPopup();
});
