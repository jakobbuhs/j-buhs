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

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    try {
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            company: document.getElementById("company").value,
            message: document.getElementById("message").value
        };

        const response = await fetch('https://j-buhs-62ue9r1fy-jakob-buhs-projects.vercel.app/api/sendEmail', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                alert('Takk for din melding! Vi kontakter deg snart.');
                this.reset();
            } else {
                throw new Error('Sending feilet');
            }
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Sending feilet');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Det oppstod en feil ved sending av skjemaet. Vennligst prøv igjen senere.');
    } finally {
        submitButton.disabled = false;
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
  