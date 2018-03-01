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
  ionViewWillEnter(){
    this.userdata.getTimeTarget().then((value) => {
      if(!value){
        this.timeTarget = value;
      }
    });
    this.userdata.getcaloriesTarget().then((value) => {
      if(!value){
        this.CaloTarget = value;
      }
    });
    this.userdata.getStepTarget().then((value) => {
      if(!value){
        this.stepTarget = value;
      }
    });
    this.userdata.getdistTarget().then((value) => {
      if(!value){
        this.distTarget = value;
      }
    });
  }
  //以下几个set均需写入storage，手环和服务器
  setSportTime(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置时长');
    let times: string[] = ['15分钟','30分钟','45分钟','1小时','1.5小时','2小时','2.5小时','3小时','3.5小时','4小时','4.5小时','5小时','5.5小时','6小时'];
    let timesLength: number[] = [900,1800,2700,3600,5400,7200,9000,10800,12600,14400,16200,18000,19800,21600];
    for(let i=0;i<times.length;i++){
      let check = false;
      if(timesLength[i] == this.timeTarget){
        check = true;
      }
      alert.addInput({
        type: 'radio',
        label: times[i],
        value: timesLength[i].toString(),
        checked: check
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.timeTarget = data*1;
        this.userdata.setTimeTarget(this.timeTarget);
      }
    });
    alert.present();
  }

  setCalories(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置卡路里');
    let calos: string[] = ['100','200','300','400','500','600','700','800','900','1000','1500','2000','2500','3000'];

    for(let i=0;i<calos.length;i++){
      let check = false;
      if(parseInt(calos[i]) == this.CaloTarget){
        check = true;
      }
      alert.addInput({
        type: 'radio',
        label: calos[i],
        value: calos[i],
        checked: check
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.CaloTarget = data*1;
        this.userdata.setcaloriesTarget(this.CaloTarget);
      }
    });
    alert.present();

  }

  setStep(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置步数');
    let steps: string[] = ['500','1000','1500','2000','2500','3000','3500','4000','4500','5000','6000','7000','8000','9000','10000','11000','12000','13000','14000','15000','20000','25000','30000','50000'];

    for(let i=0;i<steps.length;i++){
      let check = false;
      if(parseInt(steps[i]) == this.stepTarget){
        check = true;
      }
      alert.addInput({
        type: 'radio',
        label: steps[i]+'步',
        value: steps[i],
        checked: check
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.stepTarget = data*1;
        this.userdata.setStepTarget(this.stepTarget);
      }
    });
    alert.present();

  }

  setDistance(){
    let alert = this.alertCtrl.create();
    alert.setTitle('设置距离');
    let dists: string[] = ['500','1000','1500','2000','2500','3000','3500','4000','4500','5000','6000','7000','8000','9000','10000','11000','12000','13000','14000','15000','20000','25000','30000','50000'];

    for(let i=0;i<dists.length;i++){
      let check = false;
      if(parseInt(dists[i]) == this.distTarget){
        check = true;
      }
      alert.addInput({
        type: 'radio',
        label: dists[i]+'m',
        value: dists[i],
        checked: check
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.distTarget = data*1;
        this.userdata.setdistTarget(this.distTarget);
      }
    });
    alert.present();
  }

}
