const flashInput = document.getElementById('flashFileInput');
const deckNameLabel = document.getElementById('deckNameStatus');
const faceFront = document.getElementById('frontFace');
const faceBack = document.getElementById('backFace');
const showNextBtn = document.getElementById('showNextBtn');
const flipBtn = document.getElementById('flipBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const restartBtn = document.getElementById('restartBtn');
const errorMessage = document.getElementById('errorMessage');
const helpText = document.getElementById('helpText');

let cards = [];
let currentIndex = 0;
let showingFront = true;

function parseDeckFile(text) {
  return text
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim())
    .map(line => {
      const [front, ...rest] = line.split('\t');
      const backText = rest.join('\t');
      return {
        front: front ? front.trim() : '',
        back: backText ? backText.trim().replace(/\t/g, '\n') : '',
      };
    })
    .filter(card => card.front || card.back);
}

function updateCardDisplay() {
  if (!cards.length) {
    faceFront.textContent = 'Load a deck.txt file to begin.';
    faceBack.textContent = "The current card will appear here after you load and shuffle the deck.";
    return;
  }

  const card = cards[currentIndex];
  faceFront.textContent = card.front || '(no front text)';
  faceBack.textContent = card.back || '(no back text)';
  showingFront = true;
  faceFront.parentElement.style.display = 'block';
  faceBack.parentElement.style.display = 'none';
  flipBtn.disabled = false;
}

function setStatus() {
  if (!cards.length) {
    deckNameLabel.textContent = 'No deck loaded yet.';
    return;
  }
  deckNameLabel.textContent = `Deck loaded: ${cards.length} cards — showing ${currentIndex + 1}/${cards.length}`;
}

function showNextCard() {
  if (!cards.length) return;
  currentIndex = (currentIndex + 1) % cards.length;
  showingFront = true;
  faceFront.parentElement.style.display = 'block';
  faceBack.parentElement.style.display = 'none';
  updateCardDisplay();
  setStatus();
}

function flipCard() {
  if (!cards.length) return;
  showingFront = !showingFront;
  faceFront.parentElement.style.display = showingFront ? 'block' : 'none';
  faceBack.parentElement.style.display = showingFront ? 'none' : 'block';
}

function shuffleCards() {
  if (!cards.length) return;
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  currentIndex = 0;
  updateCardDisplay();
  setStatus();
}

function restartDeck() {
  if (!cards.length) return;
  currentIndex = 0;
  showingFront = true;
  updateCardDisplay();
  setStatus();
}

function onFileLoad(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const parsed = parseDeckFile(reader.result);
    if (!parsed.length) {
      errorMessage.textContent = 'No valid card lines found in deck.txt. Use tab-separated Front and Back text.';
      cards = [];
      setStatus();
      updateCardDisplay();
      return;
    }

    cards = parsed;
    shuffleCards();
    errorMessage.textContent = '';
    deckNameLabel.textContent = `Loaded deck: ${file.name} (${cards.length} cards)`;
  };

  reader.readAsText(file);
}

const cardPanel = document.getElementById('cardPanel');

flashInput.addEventListener('change', onFileLoad);
showNextBtn.addEventListener('click', showNextCard);
flipBtn.addEventListener('click', flipCard);
shuffleBtn.addEventListener('click', shuffleCards);
restartBtn.addEventListener('click', restartDeck);
cardPanel.addEventListener('click', flipCard);
cardPanel.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    flipCard();
  }
});

updateCardDisplay();
setStatus();
