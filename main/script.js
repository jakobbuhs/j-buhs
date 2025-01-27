document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
  });

  // Story form handling
  const storyForm = document.getElementById('storyForm');
  const storiesSection = document.getElementById('stories');

  storyForm.addEventListener('submit', function(e) {
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

  // Chat functionality
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

  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';

    // Simulate response
    setTimeout(() => {
      addMessage('Takk for meldingen din! Vi vil svare så snart som mulig.', 'system');
    }, 1000);
  });

  // Initialize theme based on system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
  }
});