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

function startTimer() {
  if (!timer) {
    let timeLeft = timeAllowed;
    const timebar = document.getElementById('timebar');
    const timespan = document.querySelector('.modal .win span');
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
      	window.stopInterval(timer);
        expired = true;
        timer = null;
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
 */
function finish() {
  const modal = document.querySelector('.modal');
  if (wrongAnswers > 0) {
    modal.classList.add('errors');
    const errors = document.querySelector('.modal .errors span');
    errors.innerText = wrongAnswers;
  }
  if (!expired) {
    modal.classList.add('win');
  } else {
    modal.classList.add('timeour');
  }
  if (timer) {
    window.clearInterval(timer);
  }
}

/**
 * Advance to the next problem.
 */
function next() {
  const probs = document.querySelectorAll('.prob');
  probs[current].classList.remove('current');
  current = (current + 1) % problems.length;
  if (current == 0) {
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
