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

var current = 0;

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
  if (match) {
    const ans = probs[it].querySelector('.ans');
    ans.innerText = match[1];
    if (match[1] == getAnswer(problems[it])) {
      ans.classList.add('correct');
    } else {
      ans.classList.add('wrong');
    }
    next();
  }
});


function getAnswer(data) {
  let answer = 0;
  switch(data.op) {
    case '-':
      answer = data.op1 - data.op2;
      break;
    case '+':
      answer = data.op1 + data.op2;
      break;
  }
  return answer;
}
/**
 * Advance to the next problem.
 */
function next() {
  const probs = document.querySelectorAll('.prob');
  probs[current].classList.remove('current');
  current = (current + 1) % problems.length;
  if (current == 0) {
    const modal = documengt.querySelector('.modal');
    model.querySelector('span');
    modal.classList.add('win');
  }
  probs[current].classList.add('current');
}


function createProblem(data) {
 return `
   <div class="op1">${data.op1}</div>
   <div class="op2">${data.op} ${data.op2}</div>
   <div class="ans">&nbsp;</div>`;
}
