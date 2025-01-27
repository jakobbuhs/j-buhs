// Hent elementene vi trenger
const storyForm = document.getElementById('storyForm');
const storiesSection = document.getElementById('stories');

storyForm.addEventListener('submit', function(event) {
  event.preventDefault();

  // Hent verdier fra skjema
  const title = document.getElementById('title').value;
  const story = document.getElementById('story').value;
  let author = document.getElementById('author').value;
  if (!author) {
    author = 'Anonym';
  }

  // Opprett nytt artikkel-element
  const newArticle = document.createElement('article');
  newArticle.classList.add('story');

  // Tittel
  const titleElem = document.createElement('h2');
  titleElem.classList.add('story-title');
  titleElem.textContent = title;

  // Historietekst
  const textElem = document.createElement('p');
  textElem.classList.add('story-text');
  textElem.textContent = story;

  // Meta-info (forfatter + dato)
  const metaElem = document.createElement('p');
  metaElem.classList.add('story-meta');
  const currentDate = new Date().toLocaleDateString('no-NO');
  metaElem.textContent = `Postet av ${author}, ${currentDate}`;

  // Legg til i article
  newArticle.appendChild(titleElem);
  newArticle.appendChild(textElem);
  newArticle.appendChild(metaElem);

  // Legg article til i storiesSection
  storiesSection.insertBefore(newArticle, storiesSection.firstChild);

  // Nullstill skjema
  storyForm.reset();
});
