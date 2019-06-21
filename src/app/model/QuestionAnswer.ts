export class QuestionAnswer {
  question: string;
  options: number[];
  answer: any; // Since it can be number/string/boolean etc

  // For UI purpose
  userAnswerCorrect: boolean = false;
  userAnswer: any = null;
}