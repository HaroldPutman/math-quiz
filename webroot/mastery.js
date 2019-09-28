// TODO: Read from JSON and allow more natural format.
const problems = [
  { op1: 9, op: "-", op2: 2 },
  { op1: 8, op: "-", op2: 2 },
  { op1: 7, op: "-", op2: 2 },
  { op1: 6, op: "-", op2: 2 },
  { op1: 5, op: "-", op2: 2 },
  { op1: 4, op: "-", op2: 2 },
  { op1: 3, op: "-", op2: 2 },
  { op1: 2, op: "-", op2: 2 },
  { op1: 9, op: "-", op2: 1 },
  { op1: 8, op: "-", op2: 1 },
  { op1: 7, op: "-", op2: 1 },
  { op1: 6, op: "-", op2: 1 },
  { op1: 5, op: "-", op2: 1 },
  { op1: 4, op: "-", op2: 1 },
  { op1: 3, op: "-", op2: 1 },
  { op1: 2, op: "-", op2: 1 },
  { op1: 1, op: "-", op2: 1 },
  { op1: 7, op: "-", op2: 2 },
  { op1: 6, op: "-", op2: 1 },
  { op1: 5, op: "-", op2: 2 }
];

/**
 * When to start the timer?
 *   - From a Go button that covers the screen
 *   - From the first number entry
 * When to show right and wrong answers?
 *   - On blur (just one)
 *   - When all are completed (all)
 *   - When time expires. (all)
 * */

const timeAllowed = 120;

var timer = null;
var expired = false;
var wrongAnswers = 0;

function startTimer() {
  if (!timer) {
    let timeLeft = timeAllowed;
    const timebar = document.getElementById("timebar");
    const timespan = document.querySelector(".win-message span");
    timer = window.setInterval(() => {
      timeLeft -= 1;
      timespan.innerText = timeLeft;
      const timepct = (timeLeft / timeAllowed) * 100;
      timebar.style.width = timepct + "%";
      if (timepct < 10) {
        timebar.classList.add("error");
      } else if (timepct < 40) {
        timebar.classList.add("warn");
      }
      if (timeLeft <= 0) {
        window.clearInterval(timer);
        timer = null;
        finish(score(true), true);
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
  switch (data.op) {
    case "-":
      answer = data.op1 - data.op2;
      break;
    case "+":
      answer = data.op1 + data.op2;
      break;
    case "*":
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
function finish(results, expired) {
  const modal = document.querySelector(".modal");
  if (results.wrong > 0) {
    modal.classList.add("errors");
    const errors = document.querySelector(".errors-message span");
    errors.innerText = results.wrong;
  }
  if (!expired) {
    if (results.wrong == 0 && results.unanswered == 0) {
      modal.classList.add("perfect");
    } else {
      modal.classList.add("sloppy");
    }
  } else {
    modal.classList.add("slow");
  }
}

function score(show) {
  const inputs = document.querySelectorAll("article input");
  let unanswered = 0;
  let wrong = 0;
  inputs.forEach((inp) => {
    if (inp.value.length == 0) {
      unanswered += 1
    } else if (inp.value != inp.dataset.answer) {
      if (show) {
        inp.classList.add('incorrect');
      }
      wrong += 1;
    } else if (show) {
      inp.classList.add('correct');
    }
  });
  return { unanswered, wrong };
}

// TODO: use template
// TODO: Store answer as data-answer
function createProblem(data) {
  const answer = getAnswer(data);
  return `
   <div class="op1">${data.op1}</div>
   <div class="op2">${data.op} ${data.op2}</div>
   <input type="text" pattern="\\d*" data-answer="${answer}"/>`;
}

// TODO: Sort better.
problems.sort(() => Math.random() - 0.5);

// Populate the worksheet
problems.forEach((p) => {
  let container = document.createElement("article");
  container.classList.add("prob");
  container.innerHTML = createProblem(p);
  const el = document.querySelector(".worksheet");
  el.appendChild(container);
});

// TODO: Should support real inputs
const inputs = document.querySelectorAll("article input");
inputs.forEach((inp) => {
  // Start timer on first keypress
  inp.addEventListener('keypress', startTimer);
  inp.addEventListener('blur', (evt) => {
    const result = score(false);
    if (result.unanswered == 0) {
      finish(score(true));
    }
  })
});

const restartButton = document.getElementById("restart");
restartButton.addEventListener("click", () => {
  window.location.reload();
});

