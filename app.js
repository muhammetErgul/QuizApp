// Global 
const quizOrder = document.getElementById('quizOrder');
const quizProgressBar = document.querySelector('.quizProgress');
const questionsContent = document.getElementById('questionsContent');
const quizNextBtn = document.querySelector('.quizNextBtn');
const alertDiv = document.getElementById('alert');

// Modal 
const totalCorrectScore = document.getElementById('totalCorrectScore');
const quizModal = document.querySelector('.quizModal');

const choices = ['A', 'B', 'C', 'D'];
let globalQuestions = [];
let questionsCount = 0;
let activeQuestionsIndex = 0;
let selectedAnswer;
let totalCorrectChoice = 0;

window.onload = () => {
    fetch('questions.json')
        .then(res => res.json())
        .then((questions) => {
            globalQuestions = questions;
            questionsCount = globalQuestions.length;
        });
}

const updateQuizOrder = () => {
    quizOrder.innerHTML = activeQuestionsIndex + 1 + "/" + questionsCount;
    quizProgressBar.style.width = ((activeQuestionsIndex + 1) / questionsCount) * 100 + "%";
    if (activeQuestionsIndex === questionsCount - 1) {
        quizNextBtn.textContent = 'complete';
    }
    updateQuestion();
}

const updateQuestion = () => {
    const activeQuestion = globalQuestions[activeQuestionsIndex];
    let questionHTML = `
    <h1>${activeQuestionsIndex + 1} - ${activeQuestion.text}</h1>
    <div class="questionBody">
      <div class="questionAnswers">
        ${createQuestionAnswers(activeQuestion)}
      </div>
    </div>
    `;
    questionsContent.innerHTML = questionHTML;
}

const createQuestionAnswers = (activeQuestion) => {
    let questionAnswersHTML = "";
    activeQuestion.answers.forEach((answer, index) => {
        questionAnswersHTML += `
       <div class="questionAnswer" data-id="${answer.id}" onclick="selectChoice(this)">
         <div class="choice"> ${choices[index]}</div>
         <div class="text">${answer.text}</div>
       </div>
       `
    })
    return questionAnswersHTML;
}

const selectChoice = (el) => {
    const questionAnswersEls = Array.from(document.querySelectorAll('.questionAnswer'));
    questionAnswersEls.find((el) => {
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        }
    })
    selectedAnswer = el.dataset.id;
    el.classList.add('selected');
}

const checkAnswer = () => {
    const selectedAnswerObj = globalQuestions[activeQuestionsIndex].answers.find((answer) => answer.id == selectedAnswer);
    if (selectedAnswerObj.isCorrect == true) {
        totalCorrectChoice++;
    }
}

function nextQuestion() {
    if (selectedAnswer) {
        checkAnswer()
        if (activeQuestionsIndex < questionsCount - 1) {
            activeQuestionsIndex++;
            selectedAnswer = '';
            updateQuizOrder();
        } else {
            totalCorrectScore.innerHTML = totalCorrectChoice;
            quizModal.classList.add('show');
        }
    } else {
        let html = `
        <div class="alert alert-dark alert-dismissible fade show" role="alert">
          <strong>Please make a choice!</strong>  
           <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
           </button>
        </div>
        `;
        alertDiv.innerHTML = html;
        return false;
    }
}


const closeModal = () => {
    quizModal.classList.remove('show');
}

const repeatQuiz = () => {
    activeQuestionsIndex = 0;
    totalCorrectChoice = 0;
    selectedAnswer = undefined;
    closeModal();
    updateQuizOrder()
    quizNextBtn.textContent = 'next';
}

setTimeout(() => {
    updateQuizOrder();
}, 100)
