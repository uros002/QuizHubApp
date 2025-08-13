export const QuizDifficulty = {
  Easy: "Easy",
  Medium: "Medium",
  Hard: "Hard",
};

export const AnswerType = {
  OneCorrect: "OneCorrect",
  TrueFalse: "TrueFalse",
  MultipleChoice: "MultipleChoice",
  FillTheBlank: "FillTheBlank",
};
export class Answer {
  constructor({
    id = 0,
    text = "",
    isCorrect = false,
    questionId = 0,
    //question = null,
  } = {}) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
    this.questionId = questionId;
    //this.question = question;
  }
}
export class Question {
  constructor({
    id = 0,
    body = "",
    answers = [],
    answerType = AnswerType.OneCorrect,
    points = 0,
    quizId = 0,
    parentQuestion = 0,
    //quiz = null,
  } = {}) {
    this.id = id;
    this.body = body;
    this.answers = answers; // Array of Answer
    this.answerType = answerType;
    this.points = points;
    this.quizId = quizId;
    this.parentQuestion = parentQuestion; // ID of the parent question if this is a sub-question
    //this.quiz = quiz;
  }
}
export class Quiz {
  constructor({
    id = 0,
    name = "",
    numOfQuestions = 0,
    timeDuration = 0,
    description = "",
    difficulty = QuizDifficulty.Easy,
    category = "",
    questions = [],
    parentQuiz = 0,
    versionParentQuiz = 0,
  } = {}) {
    this.id = id;
    this.name = name;
    this.numOfQuestions = numOfQuestions;
    this.timeDuration = timeDuration; // in seconds
    this.description = description;
    this.difficulty = difficulty;
    this.category = category;
    this.questions = questions; // Array of Question
    this.parentQuiz = parentQuiz; // ID of the parent quiz if this is a sub-quiz
    this.versionParentQuiz = versionParentQuiz;
  }
}

export class QuizCompletition {
  constructor({ userId = 0, quizId = 0, answers = [], timeDuration = 0 } = {}) {
    this.userId = userId;
    this.quizId = quizId;
    this.answers = answers;
    this.timeDuration = timeDuration;
  }
}

export class QuizResult {
  constructor({
    id = 0,
    userId = 0,
    user = null,
    quizId = 0,
    quiz = null,
    selectedAnswers = [],
    rightAnwers = 0,
    points = 0,
    timeDuration = 0,
    dateOfCompletition = new Date(),
  } = {}) {
    this.id = id;
    this.userId = userId;
    this.user = user;
    this.quizId = quizId;
    this.quiz = quiz;
    this.selectedAnswers = selectedAnswers; // Array of QuizResultAnswer
    this.rightAnwers = rightAnwers;
    this.points = points;
    this.timeDuration = timeDuration;
    this.dateOfCompletition = dateOfCompletition;
  }
}

export class User {
  constructor({
    id = 0,
    username = "",
    password = "",
    email = "",
    profileImage = null,
    quizResults = [],
  } = {}) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.profileImage = profileImage; // base64 string or null
    this.quizResults = quizResults; // Array of QuizResult
  }
}
