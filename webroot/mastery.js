// TODO: Read from JSON and allow more natural format.
const problems = [
  { op1: 9, op: '-', op2: 2 },
  { op1: 8, op: '-', op2: 2 },
  { op1: 7, op: '-', op2: 2 },
  { op1: 6, op: '-', op2: 2 },
  { op1: 5, op: '-', op2: 2 },
  { op1: 4, op: '-', op2: 2 },
  { op1: 3, op: '-', op2: 2 },
  { op1: 2, op: '-', op2: 2 },
  { op1: 9, op: '-', op2: 1 },
  { op1: 8, op: '-', op2: 1 },
  { op1: 7, op: '-', op2: 1 },
  { op1: 6, op: '-', op2: 1 },
  { op1: 5, op: '-', op2: 1 },
  { op1: 4, op: '-', op2: 1 },
  { op1: 3, op: '-', op2: 1 },
  { op1: 2, op: '-', op2: 1 },
  { op1: 1, op: '-', op2: 1 },
  { op1: 7, op: '-', op2: 2 },
  { op1: 6, op: '-', op2: 1 },
  { op1: 5, op: '-', op2: 2 }
];

const timeAllowed = 120;

var current = 0;
var timer = null;
var expired = false;
var wrongAnswers = 0;

// TODO: Sort better.
problems.sort(() => Math.random() - 0.5);

problems.forEach((p, index) => {
  let container = document.createElement("div");
  container.classList.add("prob");
  if (index == current) {
    container.classList.add("current");
  }
  container.innerHTML = createProblem(p);
  const el = document.getElementById('page');
  el.appendChild(container);
});

// TODO: Should support real inputs
document.addEventListener('keydown', (e) => {
  const it = current;
  const probs = document.querySelectorAll('.prob');
  const match = /Digit(\d)/.exec(e.code);
  if (!expired && match) {
    startTimer();
    const ans = probs[it].querySelector('.ans');
    ans.innerText = match[1];
    if (match[1] == getAnswer(problems[it])) {
      ans.classList.add('correct');
    } else {
      ans.classList.add('wrong');
      wrongAnswers += 1;
    }
    next();
  }
});

const restartButton = document.getElementById("restart");
restartButton.addEventListener('click', (e) => {
  window.location.reload();
});

function startTimer() {
  if (!timer) {
    let timeLeft = timeAllowed;
    const timebar = document.getElementById('timebar');
    const timespan = document.querySelector('.win-message span');
    timer = window.setInterval(() => {
      timeLeft -= 1;
      timespan.innerText = timeLeft;
      const timepct = (timeLeft / timeAllowed * 100);
      timebar.style.width = timepct + '%';
      if (timepct < 10) {
         timebar.classList.add('error');
      } else if (timepct < 40) {
        timebar.classList.add('warn');
      }
      if (timeLeft <= 0) {
      	window.clearInterval(timer);
        expired = true;
        timer = null;
        finish();
      }
    }, 1000);
  }
}

/**
 * Calculate the correct answer.
 * @param {object} data
 */
function getAnswer(data) {
  let answer = 0;
  switch(data.op) {
    case '-':
      answer = data.op1 - data.op2;
      break;
    case '+':
      answer = data.op1 + data.op2;
      break;
    case '*':
      answer = data.op1 * data.op2;
      break;
    }
  return answer;
}


/**
 * Handle the end of game.
 * Possible outcomes are:
 *  - Perfect Before timeout all correct
 *  - Sloppy Before timeout with some wrong
 *  - Slow Timeout
 */
function finish() {
  const modal = document.querySelector('.modal');
  if (wrongAnswers > 0) {
    modal.classList.add('errors');
    const errors = document.querySelector('.errors-message span');
    errors.innerText = wrongAnswers;
  }
  if (timer) {
    window.clearInterval(timer);
  }
  if (!expired) {
    if (wrongAnswers == 0) {
      modal.classList.add('perfect');
    } else {
      modal.classList.add('sloppy');
    }
  } else {
    modal.classList.add('slow');
  }
}

/**
 * Advance to the next problem.
 */
function next() {
  const probs = document.querySelectorAll('.prob');
  probs[current].classList.remove('current');
  current += 1;
  if (current >= problems.length) {
    finish();
  } else {
    probs[current].classList.add('current');
  }
}


function createProblem(data) {
 return `
   <div class="op1">${data.op1}</div>
   <div class="op2">${data.op} ${data.op2}</div>
   <div class="ans">&nbsp;</div>`;
}
