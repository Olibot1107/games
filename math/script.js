const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const timerEl = document.getElementById("timer");

let score = 0;
let highScore = 0;
let time = 20;
let timer;
let difficulty = 10;

function startTimer() {
  clearInterval(timer);
  time = 20;
  timerEl.textContent = `Time: ${time}`;
  timer = setInterval(() => {
    time--;
    timerEl.textContent = `Time: ${time}`;
    if (time <= 0) {
      clearInterval(timer);
      resultEl.textContent = "⏰ Time's up!";
      resultEl.style.color = "orange";
      setTimeout(generateQuestion, 1000);
    }
  }, 1000);
}

function generateQuestion() {
  resultEl.textContent = "";
  startTimer();

  const a = Math.floor(Math.random() * difficulty) + 1;
  const b = Math.floor(Math.random() * difficulty) + 1;
  const ops = ["+", "-", "*", "/", "%"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let correct;
  switch(op){
    case "+": correct = a + b; break;
    case "-": correct = a - b; break;
    case "*": correct = a * b; break;
    case "/": correct = Math.floor(a / b); break;
    case "%": correct = a % b; break;
  }

  questionEl.textContent = `Solve: ${a} ${op} ${b} = ?`;

  const choices = [correct];
  while(choices.length < 4){
    let rand = Math.floor(Math.random() * (difficulty * 3)) - difficulty;
    if(!choices.includes(rand)) choices.push(rand);
  }

  shuffle(choices);
  answersEl.innerHTML = "";
  choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice, correct);
    answersEl.appendChild(btn);
  });

  document.body.style.background = `hsl(${Math.random() * 360}, 70%, 80%)`;
}

function checkAnswer(choice, correct){
  clearInterval(timer);
  if(choice === correct){
    resultEl.textContent = "🎉 Correct!";
    resultEl.style.color = "green";
    score += 10;
    difficulty += 1;
  } else {
    resultEl.textContent = "❌ Wrong!";
    resultEl.style.color = "red";
    score -= 5;
    if(score < 0) score = 0;
  }
  scoreEl.textContent = `Score: ${score}`;
  if(score > highScore) highScore = score;
  highScoreEl.textContent = `High Score: ${highScore}`;
}

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

nextBtn.addEventListener("click", generateQuestion);

generateQuestion();