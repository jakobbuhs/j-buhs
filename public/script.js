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

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        company: document.getElementById("company").value,
        message: document.getElementById("message").value
    };

    try {
        const response = await fetch("https://j-buhs-62ue9r1fy-jakob-buhs-projects.vercel.app/api/sendEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("Takk for din melding! Vi kontakter deg snart.");
            this.reset();
        } else {
            const errorData = await response.json();
            console.error("Server Error:", errorData);
            alert("Beklager, det oppstod en feil. Vennligst prøv igjen senere.");
        }
    } catch (error) {
        console.error("Network Error:", error);
        alert("Kunne ikke koble til serveren. Sjekk internettforbindelsen din og prøv igjen.");
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
  