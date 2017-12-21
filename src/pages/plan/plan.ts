import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';


@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html'
})
export class PlanPage {

  constructor(
    public confData: ConferenceData,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  setSportTime(){

  }

  setCalories(){

  }

  setStep(){

  }

  setDistance(){

  }

}
