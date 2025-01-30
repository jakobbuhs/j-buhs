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
    const company = document.getElementById("company").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("https://j-buhs-62ue9r1fy-jakob-buhs-projects.vercel.app/api/sendEmail", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ name, email, company, message }),
        });

        if (response.ok) {
            alert("Takk for din melding! Vi kontakter deg snart.");
            this.reset(); // Reset the form after successful submission
        } else {
            const errorData = await response.json();
            console.error("Feil under sending:", errorData);
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
  