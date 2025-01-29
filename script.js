function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.scrollIntoView({ behavior: 'smooth' });
}

function toggleContactPopup() {
  const popup = document.getElementById('contact-popup');
  popup.classList.toggle('hidden');
}


// Event listener for skjema
document.getElementById("contact-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
 
  try {
      const response = await fetch("http://localhost:3000/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
          alert("Takk for din melding! Vi kontakter deg snart.");
      } else {
          alert("Feil under sending av e-post. Prøv igjen senere.");
      }
  } catch (error) {
      console.error("En feil oppstod:", error);
      alert("En feil oppstod. Vennligst prøv igjen.");
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("portfolio-video");

  video.addEventListener("click", function () {
      if (video.paused) {
          video.play();
      } else {
          video.pause();
      }
  });
});
