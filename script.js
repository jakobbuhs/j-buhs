document.addEventListener('DOMContentLoaded', function () {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');

    // Save theme preference to localStorage
    const isDarkMode = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  });

  // Initialize theme based on system preference or localStorage
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Chat widget functionality
  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatContainer = document.getElementById('chatContainer');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  function toggleChat() {
    chatContainer.classList.toggle('hidden');
    chatToggle.classList.toggle('hidden');
  }

  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
      </div>
    `;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';

    // Simulate a response from the system
    setTimeout(() => {
      addMessage('Takk for meldingen din! Vi vil svare så snart som mulig.', 'system');
    }, 1000);
  });

  // Form submission handling (for story submission)
  const storyForm = document.getElementById('storyForm');
  const storiesSection = document.getElementById('stories');

  storyForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const story = document.getElementById('story').value;
    const author = document.getElementById('author').value || 'Anonym';

    const newStory = document.createElement('article');
    newStory.className = 'story';
    newStory.innerHTML = `
      <h2 class="story-title">${title}</h2>
      <p class="story-text">${story}</p>
      <p class="story-meta">Postet av ${author}, ${new Date().toLocaleDateString('no-NO')}</p>
    `;

    storiesSection.insertBefore(newStory, storiesSection.firstChild);
    storyForm.reset();
  });

  // Mobile menu toggle (if needed)
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
});
