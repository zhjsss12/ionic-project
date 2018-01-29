import { Component, NgZone } from '@angular/core';

import { NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConferenceData } from '../../providers/conference-data';
import { BLE } from '@ionic-native/ble';
import { bleManager } from '../../providers/bleManager';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-plan',
  templateUrl: 'plan.html'
})
export class PlanPage {
  value: any;
  timeTarget: number;
  stepTarget: number;
  distTarget: number;
  CaloTarget: number;
  constructor(
    public confData: ConferenceData,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private ble: BLE,
    private bm: bleManager,
    private ngZone: NgZone,
    private storage: Storage,
    public alertCtrl: AlertController,
    private userdata: UserData
  ) {
  }
  //以下几个set均需写入storage，手环和服务器
  setSportTime(){
    let prompt = this.alertCtrl.create({
      title: '设置时长',
      inputs: [
        {
          name: 'time',
          placeholder: '0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.timeTarget = data.time;
            this.userdata.setTimeTarget(this.timeTarget);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  setCalories(){
    let prompt = this.alertCtrl.create({
      title: '设置卡路里',
      inputs: [
        {
          name: 'calo',
          placeholder: '0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.CaloTarget = data.calo;
            this.userdata.setcaloriesTarget(this.CaloTarget);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  setStep(){
    let prompt = this.alertCtrl.create({
      title: '设置步数',
      inputs: [
        {
          name: 'step',
          placeholder: '0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.stepTarget = data.step;
            this.userdata.setStepTarget(this.stepTarget);
          }
        }
      ]
    });
    prompt.present();

  }

  setDistance(){
    let prompt = this.alertCtrl.create({
      title: '设置距离',
      inputs: [
        {
          name: 'dist',
          placeholder: '0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.distTarget = data.dist;
            this.userdata.setdistTarget(this.distTarget);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}
