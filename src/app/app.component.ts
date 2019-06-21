import {Component, OnInit} from '@angular/core';
import {AppService} from './service/app.service';
import {QuestionAnswer} from './model/QuestionAnswer';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Quiz Form group
   */
  quizForm: FormGroup;

  /**
   * Boolean to record if user has clicked on Submit
   */
  isFormSubmitted: boolean = false;

  /**
   * Data obtained from json file. All modifications/iterations done in this.
   */
  originalData: QuestionAnswer[];

  /**
   * Data obtained from json file original copy
   */
  copyOrigData: QuestionAnswer[];

  /**
   * Chart data built out of answers given
   */
  chartData: any[];

  /**
   * Record of correct and incorrect answers
   */
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;

  /**
   * All answers submitted boolean
   */
  allAnswersSubmitted: boolean = false;


  /**
   * All properties for graph
   */
  view: any[];
  width: number = 300;
  height: number = 600;
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  tooltipDisabled = false;
  xAxisLabel = 'Results';
  showYAxisLabel = true;
  yAxisLabel = 'Score';
  showGridLines = true;
  barPadding = 8;
  roundEdges: boolean = true;
  yScaleMax: number;
  showDataLabel = false;
  noBarWhenZero = true;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;

  constructor(private appService: AppService, private fb: FormBuilder) {
  }

  /**
   * Getting json data when the component initialises
   */
  ngOnInit() {
    this.quizForm = this.fb.group({
      quizQues: ['', Validators.required]
    });
    this.appService.getJsonData().subscribe((data) => {
      this.originalData = data['questionaire'];
      this.copyOrigData = JSON.parse(JSON.stringify(data['questionaire']));
    });
  }

  /**
   * Build the chart once all questions are answered
   * @param correct
   * @param incorrect
   */
  buildChartData(correct: number = 0, incorrect: number = 0) {
    this.view = [this.width, this.height];
    this.chartData = [
      {
        name: 'Correct',
        value: correct
      }, {
        name: 'Incorrect',
        value: incorrect
      }
    ]
  }

  /**
   * Click of any answer dropdown will set the userAnswerCorrect property to true or false.
   * I am using the same object and adding UI specific properties to it for a simpler
   * implementation.
   * @param ques
   * @param ans
   */
  handleAnswerClick(ques: QuestionAnswer, ans: any) {
    for (let i = 0; i < this.originalData.length; i++) {
      if (this.originalData[i].question === ques.question) {
        if (this.originalData[i].answer === ans) {
          this.originalData[i].userAnswerCorrect = true;
        } else {
          this.originalData[i].userAnswerCorrect = false;
        }
        break;
      }
    }
  }

  /**
   * On click of submit, fields are validated and if any question is unanswered,
   * then the error is shown.
   */
  submitQuiz() {
    this.isFormSubmitted = true;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.allAnswersSubmitted = true;
    for (let i = 0; i < this.originalData.length; i++) {
      if (!this.originalData[i].userAnswer) {
        this.allAnswersSubmitted = false;
        break;
      } else {
        if (this.originalData[i].userAnswerCorrect) {
          this.correctAnswers++;
        } else {
          this.incorrectAnswers++;
        }
      }
    }
    if (this.allAnswersSubmitted) {
      this.buildChartData(this.correctAnswers, this.incorrectAnswers);
    }
  }

  /**
   * Resets the form.s
   */
  clearQuiz() {
    this.isFormSubmitted = false;
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.allAnswersSubmitted = false;
    this.originalData = [];
    this.originalData = [...this.copyOrigData];
  }
}
