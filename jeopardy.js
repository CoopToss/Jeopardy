const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CAT = 5;
let categories = [
  { title: '100', clues: [] },
  { title: '200', clues: [] },
  { title: '300', clues: [] },
  { title: '400', clues: [] },
  { title: '500', clues: [] },
  { title: '600', clues: [] }
];

// Function to fetch new categories and questions
async function fetchCategoriesAndQuestions() {
  try {
    const response = await axios.get("https://opentdb.com/api.php?amount=50");
    const { results } = response.data;

    // Reset categories
    categories.forEach(category => {
      category.clues = [];
    });

    // Distribute questions into categories
    for (let i = 0; i < NUM_CATEGORIES; i++) {
      const categoryQuestions = results.splice(0, NUM_QUESTIONS_PER_CAT);
      const clues = categoryQuestions.map(question => ({
        question: decodeHTML(question.question), // Decode HTML entities
        answer: decodeHTML(question.correct_answer), // Decode HTML entities
        showing: null
      }));
      categories[i].clues = clues;
    }

    renderGameBoard();
  } catch (error) {
    console.error("Error fetching categories and questions:", error);
  }
}

// Function to decode HTML entities
function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// Function to render the game board
function renderGameBoard() {
  const jeopardyTable = document.getElementById('jeopardy');

  // Clear the existing table
  jeopardyTable.innerHTML = '';

  // Create header row with category titles
  const headerRow = document.createElement('tr');
  categories.forEach(category => {
    const th = document.createElement('th');
    th.textContent = category.title;
    headerRow.appendChild(th);
  });
  jeopardyTable.appendChild(headerRow);

  // Create cells for questions
  for (let i = 0; i < NUM_QUESTIONS_PER_CAT; i++) {
    const row = document.createElement('tr');
    categories.forEach((category, index) => {
      const td = document.createElement('td');
      const clue = category.clues[i];
      td.textContent = clue ? '?' : '-';
      if (clue) {
        td.dataset.categoryIndex = index;
        td.dataset.clueIndex = i;
        td.addEventListener('click', handleClueClick);
      }
      row.appendChild(td);
    });
    jeopardyTable.appendChild(row);
  }
}

// Function to handle click on a clue
function handleClueClick(event) {
  const { categoryIndex, clueIndex } = event.target.dataset;
  const category = categories[categoryIndex];
  
  // Check if category and clue exist
  if (category && category.clues && category.clues[clueIndex]) {
    const clue = category.clues[clueIndex];

    if (!clue.showing) {
      event.target.textContent = clue.question;
      clue.showing = 'question';
    } else if (clue.showing === 'question') {
      event.target.textContent = clue.answer;
      clue.showing = 'answer';
    }
  }
}

// Function to reset the game
function restartGame() {
  fetchCategoriesAndQuestions();
}

// Function to start the game
function startGame() {
  fetchCategoriesAndQuestions();
}

// Event listener for restart button
document.getElementById('restart').addEventListener('click', restartGame);

// Event listener for start button
document.getElementById('start').addEventListener('click', startGame);

// Initialize the game
startGame();
