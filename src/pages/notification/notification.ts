import { Component } from '@angular/core';

import { NavParams, ViewController } from 'ionic-angular';

import { ConferenceData } from '../../providers/conference-data';


@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  tracks: Array<{name: string, isChecked: boolean}> =
    [{name:'久坐提醒', isChecked: false},
     {name:'来电提醒', isChecked: false},
     {name:'短信提醒', isChecked: false},
     {name:'微信提醒', isChecked: false}];

  constructor(
    public confData: ConferenceData,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) { }

  jumpToSportNotice(){

  }

  jumpToClockNotice(){

  }

}
