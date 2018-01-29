import { Component } from '@angular/core';

import { NavParams, ViewController, Events } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

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
  origin: boolean[] = [false, false, false, false];
  constructor(
    public userData: UserData,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events
  ) {
    this.userData.getNotiCall().then((value) => {
      this.tracks[1].isChecked = value;
      this.origin[1] = value;
    });
    this.userData.getNotiQQ().then((value) => {
      this.tracks[2].isChecked = value;
      this.origin[2] = value;
    });
    this.userData.getNotiWeChat().then((value) => {
      this.tracks[3].isChecked = value;
      this.origin[3] = value;
    });

  }

  ionViewWillLeave(){
    if(this.origin[1] != this.tracks[1].isChecked){
      this.events.publish("notification:call");
    }
    if(this.origin[2] != this.tracks[2].isChecked){
      this.events.publish("notification:qq");
    }
    if(this.origin[3] != this.tracks[3].isChecked){
      this.events.publish("notification:wechat");
    }
  }

  jumpToSportNotice(){

  }

  jumpToClockNotice(){

  }

}
