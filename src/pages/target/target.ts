import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { UserData } from '../../providers/user-data';
import {databaseManager} from '../../providers/databaseManager';

@IonicPage()
@Component({
  selector: 'page-target',
  templateUrl: 'target.html',
})
export class TargetPage {

  targetFinishedPic: any ;
  targetFinishedPer: number = 38;
  stepTarget: number;
  timeTarget: number;
  caloTarget: number;
  distTarget: number;
  stepData : number[] =[0,0,0,0,0,0,0];
  timeData : number[] =[0,0,0,0,0,0,0];
  caloData : number[] =[0,0,0,0,0,0,0];
  distData : number[] =[0,0,0,0,0,0,0];
  unstepData : number[] =[0,0,0,0,0,0,0];
  untimeData : number[] =[0,0,0,0,0,0,0];
  uncaloData : number[] =[0,0,0,0,0,0,0];
  undistData : number[] =[0,0,0,0,0,0,0];
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private userdata: UserData, public dm:databaseManager) {}

  ionViewDidLoad() {
    this.userdata.getStepTarget().then((value) => {
      this.stepTarget = value;
    });
    this.userdata.getTimeTarget().then((value) => {
      this.timeTarget = value;
    });
    this.userdata.getcaloriesTarget().then((value) => {
      this.caloTarget = value;
    });
    this.userdata.getdistTarget().then((value) => {
      this.distTarget = value;
    });
    this.dm.databaseInit();
    setTimeout(() => {
      this.drawTargetFinished();
    },1000);

  }

  drawTargetFinished(){
    var categories = [];
    for (var i = 6; i >= 0; i--) {
      var x=new Date().getTime();
      var date=new Date(x-24*60*60*1000*i);
      var mon=date.getMonth()+1;
      var strMon = ''
      if(mon<10){
        strMon = '0'+mon;
      }else{
        strMon = ''+mon;
      }
      var day=date.getDate();
      categories.push(strMon+'-'+day);
    }
    this.dm.queryLastAse(7,['HH','II'],"0").then(
      (resultSet)=>{
        var run_data : number[] =[0,0,0,0,0,0,0];
        for (var i=0 ; i<resultSet.rows.length;i++) {
          var x= resultSet.rows.item(i);
          for (var j in categories) {
            if (categories[j] == x["datee"].substring(5,10)) {
              run_data[j]=x["sum(II)"]*256+x["sum(HH)"];
            }
          }
        }
        for(let i=0;i<7;i++){
          this.stepData[i] = Math.min(run_data[i]/this.stepTarget*100,100);
        }
        for(let i=0;i<7;i++){
          this.unstepData[i] = 100 - this.stepData[i];
        }
      }
    );
    this.dm.queryLastAse(7,['FF','GG'],"0").then(
      (resultSet)=>{
        var cal_data : number[] =[0,0,0,0,0,0,0];

        for (var i=0 ; i<resultSet.rows.length;i++) {
          var x= resultSet.rows.item(i);
          for (var j in categories) {
            if (categories[j] == x["datee"].substring(5,10)) {
              cal_data[j]=x["sum(GG)"]*256+x["sum(FF)"];
            }
          }
        }
        for(let i=0;i<7;i++){
          this.caloData[i] = Math.min(cal_data[i]/this.caloTarget*100,100);
        }
        for(let i=0;i<7;i++){
          this.uncaloData[i] = 100 - this.caloData[i];
        }
      }
    );

    this.dm.queryLastAse(7,['JJ','KK'],"0").then(
      (resultSet)=>{
        var dist_data : number[] =[0,0,0,0,0,0,0];

        for (var i=0 ; i<resultSet.rows.length;i++) {
          var x= resultSet.rows.item(i);
          for (var j in categories) {
            if (categories[j] == x["datee"].substring(5,10)) {
              dist_data[j]=x["sum(KK)"]*256+x["sum(JJ)"];
            }
          }
        }
        for(let i=0;i<7;i++){
          this.distData[i] = Math.min(dist_data[i]/this.distTarget*100,100);
        }
        for(let i=0;i<7;i++){
          this.undistData[i] = 100 - this.distData[i];
        }
      }
    );

    this.dm.queryLastAse(7,['LL','MM'],"0").then(
      (resultSet)=>{
        var time_data : number[] =[0,0,0,0,0,0,0];
        for (var i=0 ; i<resultSet.rows.length;i++) {
          var x= resultSet.rows.item(i);
          for (var j in categories) {
            if (categories[j] == x["datee"].substring(5,10)) {
              time_data[j]=x["sum(MM)"]*256+x["sum(LL)"];
            }
          }
        }
        for(let i=0;i<7;i++){
          this.timeData[i] = Math.min(time_data[i]/this.timeTarget*100,100);
        }
        for(let i=0;i<7;i++){
          this.untimeData[i] = 100 - this.timeData[i];
        }
      }
    );

    setTimeout(() => {
      this.targetFinishedPic = Highcharts.chart('targetFinished', {
        chart:{
          type:'column'
        },
        title: {
          text: '最近七天运动完成情况',
          x: -20
        },
        plotOptions: {
          column: {
                  stacking: 'normal',
                  dataLabels: {
                  }
              }
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
          min: 0,
          max:100,
          title: {
              text: '目标百分比'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
        },
        tooltip: {
            valueSuffix: '%'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
          name: '步数已完成',
          data: this.stepData,
          stack: 'step'
        },{
          name: '步数未完成',
          data: this.unstepData,
          stack: 'step'
        },{
          name: '卡路里已完成',
          data: this.caloData,
          stack: 'calo'
        },{
          name: '卡路里未完成',
          data: this.uncaloData,
          stack: 'calo'
        },{
          name: '距离已完成',
          data: this.distData,
          stack: 'dist'
        },{
          name: '距离未完成',
          data: this.undistData,
          stack: 'dist'
        },{
          name: '时间已完成',
          data: this.timeData,
          stack: 'time'
        },{
          name: '时间未完成',
          data: this.untimeData,
          stack: 'time'
        }]
      });
    }, 3000);

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
    }, 3000);
  }

}
