import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Config,
  NavController,
  LoadingController,
  Events
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { httpManager } from '../../providers/httpManager';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { SpeakerDetailPage } from '../speaker-detail/speaker-detail';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {dataClass} from '../../entity/dataClass';
import {databaseManager} from '../../providers/databaseManager';
import * as Highcharts from 'highcharts';
// TODO remove


@Component({
  selector: 'page-sleep',
  templateUrl: 'sleep.html'
})
export class SleepPage {
  actionSheet: ActionSheet;


  speakers: any[] = [];
  chart:any;
  chart7:any;
  specific: any;
  test: any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    private sqlite: SQLite,
    public dm:databaseManager,
    public loadingCtrl: LoadingController,
    public user: UserData,
    public events: Events,
    private hm: httpManager,
  ) {}

  ionViewDidLoad() {
    var time_load = new Date().getTime();
    //console.log("time_load :" , time_load)
    console.log('sleep.ts  ionViewDidLoad');
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
    }, 500);
  }
  ionViewWillEnter(){
    this.dm.databaseInit();
    setTimeout(() => {
    this.render3();
    this.render2();
    this.render1();
    }, 100);
    console.log('进入了 sleep 页面');
  }
  test_chart(){
this.chart = Highcharts.chart('test', {
      chart: {
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
        },
        title: {
            text: '近日睡眠质量比例'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
          }
        },
        series: [{
          type: 'pie',
          name: '睡眠时间占比',
          data: [
            ['浅睡眠',   35],
            ['轻睡眠',       25],
            {
                name: '中睡眠',
                y: 18,
                sliced: true,
                selected: true
            },
            ['深睡眠',    22],
          ]
        }]
    });
  }

  cal(num :number) : string{
    var tmp= new Date();
    var time = tmp.getTime();
    tmp= new Date(time + 24*60*60*1000*num);
    var day = (tmp.getFullYear()%100).toString();
    if(tmp.getMonth()<9){
      day+= ('0'+ (tmp.getMonth() + 1 ).toString());
    }
    else {
      day += (tmp.getMonth() + 1 ).toString();
    }
    if ( tmp.getDate() < 10){
      day += ('0'+tmp.getDate().toString() );
    }
    else{
      day += tmp.getDate().toString();
    }
    return day;
  }
  insert(){
    let dc= new dataClass();
    let str1 : string[]=['18','1','27','50','255','2','1','2','1','2','1','2','1'];
    var index= 18012750;
    for (var i = 0; i < 20; ++i) {
      dc.setData(str1);
      dc.setId(index.toString());
      this.dm.insert(dc).then((result)=>{
        //console.log(result);
      },(err)=>{
        //console.log(err);
      });
      index++;
    }
  }

  render1(){
    var obj = document.getElementById("container");
    if(obj){
      //console.log("sleep.ts ionviewDidload  find container");
    }
    else {
      //console.log("sleep.ts/ionviewDidload  not find container");
    }
    this.chart = Highcharts.chart('container', {
      chart: {
          type: 'pie',
          options3d: {
              enabled: true,
              alpha: 45,
              beta: 0
          }
        },
        title: {
            text: '近日睡眠质量比例'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
          }
        },
        series: [{
          type: 'pie',
          name: '睡眠时间占比',
          data: []
        }]
    });
  }
  render2(){
    var yesterday = this.cal(-1);
    var strToday = this.cal(0);
    var tommorrow = this.cal(1);

    var ids =[];
    for (var i = 0; i < 10; i++) {
      ids.push(strToday+ "0" + i.toString());
    }
    for (var i = 10; i < 96; i++) {
      ids.push(strToday + i.toString());
    }
    //console.log( "sleep.ts  today = " + strToday + " yesterday = " + yesterday );
    //console.log( "sleep.ts  ids " + ids );
    var arr = new Array(96);
    for (var i = 0; i < 96; i++) {
      arr[i]=0;
    }
    var tmp2 = [':00',":15",":30",':45'];
    var categorySpecific =[];

    for (var i = 0; i <24 ; i++) {
      for (var j = 0; j < 4; j++) {
        categorySpecific.push(i.toString() + tmp2[j]);
      }
    }

    this.specific = Highcharts.chart('specific', {
      chart:{
        type:'column'
      },
      title: {
        text: '时段睡眠质量分析（每15分钟）',
        x: -20
      },
      subtitle: {
          text: '未佩戴手环或者未进入睡眠都会记录为空白',
          x: -20
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          }
        }
      },
      xAxis: {
          categories: categorySpecific
      },
      yAxis: {
        title: {
            text: '时段睡眠质量'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        labels: {
          formatter:function(){
            if(this.value <=300) {
              return "浅睡（"+this.value+")";
            }else if(this.value >300 && this.value <=600) {
              return "轻睡（"+this.value+")";
            }else if(this.value >600 && this.value <=1000) {
              return "中睡（"+this.value+")";
            }else{
              return "深睡（"+this.value+")";
            }
          }
        }
      },
      tooltip: {
          valueSuffix: 'm'
      },
      legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
      },
      series: [{
        name : '时段睡眠质量',
        data: arr
      }]
    });
    var aspect = ["FF",'GG','HH','II','JJ','KK','LL','MM']
    this.dm.querySleep(yesterday,tommorrow).then(
      (answer)=>{
        //console.log('sleep.ts length ' + answer.rows.length);
        var len = answer.rows.length;
        var sleep1 = 0 ,sleep2 = 0 ,sleep3 = 0 ,sleep4 = 1 ,sleepelse = 0 ;
        for (var i = 0; i < 96; i++) {
          // console.log(answer.rows.item(i)['id']);
          // console.log(answer.rows.item(i)["FF + GG + HH + II +JJ +KK+ LL +MM"]);
          for (var j = 0; j < len; j++) {
            if( ids[i] == answer.rows.item(j)['id']){
              for (var asp = 0; asp < 8; asp++) {
                if(answer.rows.item(j)[aspect[asp]] != 0){
                  var x = 256-(answer.rows.item(j)[aspect[asp]]);
                  arr[i] += x;
                  if (x <= 64 ) {
                    sleep4 ++;
                  }
                  else if(x <= 128 && x > 64){
                    sleep3 ++;
                  }
                  else if(x <= 192 && x > 128){
                    sleep2 ++;
                  }
                  else if(x > 192){
                    sleep1 ++;
                  }
                }
              }
            } 
          }
        }
        this.specific.series[0].update({
          name: '时段睡眠质量',
          data: arr
        });
        this.specific.redraw();


        this.chart.series[0].update({
          type: 'pie',
          name: '睡眠时间占比',
          data: [
            ['浅睡眠',   sleep4],
            ['轻睡眠',   sleep3],
            {
                name: '中睡眠',
                y: sleep2,
                sliced: true,
                selected: true
            },
            ['深睡眠',   sleep1],
          ]
        });
        this.chart.redraw();
        //console.log('sleep.ts arr 四种睡眠' ,[sleep4,sleep3,sleep2,sleep1]);
      },
      (Error)=>{
        //console.log("sleep.ts " + Error);
    });
  }
  //画出最近七天的睡眠情况
  render3(){
    var time_render3 = new Date().getTime();
    //console.log("time_render3 :" , time_render3)
    var categoies = [];
    for (var i = 6; i >= 0; i--) {
      var x=new Date().getTime() ;
      var date=new Date(x-24*60*60*1000*i);
      var mon=date.getMonth()+1;
      var day=date.getDate();
      categoies.push(mon+'\\'+day);
    }
    //console.log(categoies);

    var obj = document.getElementById("container7");
    if(obj){
      //console.log("sleep.ts ionviewDidload  find container7");
    }
    else {
      //console.log("sleep.ts/ionviewDidload  not find container7");
    }

    var strYesterday = this.cal(-7);
    var strToday = this.cal(0);
    var sum = [];
    for (var i = 0; i < 7; i++) {
      sum.push(0);
    }
    var ids = [];
    for (var i = -7; i <= 0 ; i++) {
      ids.push(this.cal(i));
    }
    var aspect = ["FF",'GG','HH','II','JJ','KK','LL','MM']
    var time_query = new Date().getTime();
    //console.log("time_query :" , time_query)
    this.dm.querySleep(strYesterday,strToday).then(
      (answer)=>{
        //console.log('sleep.ts chart3 length ' + answer.rows.length);
        var len = answer.rows.length;
        var cnt = [];
        for (var i = 0; i < 7 ; i++) {
          cnt.push(0);
        }
        for (var i = 0; i < len; i++) {
          var x = answer.rows.item(i)
          for (var j = 0; j < 7; j++) {
            if(+x['id'] < +(ids[j+1] + '48') &&  +x['id'] >=  +(ids[j] + '48')){
              for (var asp = 0; asp < 8; asp++) {
                if(x[aspect[asp]] != 0){
                  sum[j] += 256-(x[aspect[asp]]);
                }
              }
              break;
            }
          }
        }
        this.user.getUsername().then(
          userName =>{
            this.hm.sendSleepToServer(userName,Math.round(sum[6]/6000)/10);
          });
        this.user.setSleepData(Math.round(sum[6]/6000)/10);
        this.events.publish('sleepChanged');
        //console.log('this.user.setSleepData(sum[6]/60000);',Math.round(sum[6]/6000)/10)

        //console.log('sleep.ts chart3 sum ' + sum);
        var time_before_draw = new Date().getTime();
        //console.log("time_before_draw:",time_before_draw)
        this.chart7 = Highcharts.chart('container7', {
          chart:{
            type:'column'
          },
          title: {
            text: '近一星期睡眠质量分析（每天）',
            x: -20
          },
          // subtitle: {
          //     text: 'subtitle',
          //     x: -20
          // },
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              }
            }
          },
          xAxis: {
              categories: categoies
          },
          yAxis: {
            title: {
                text: '每天睡眠质量'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            labels: {
              formatter:function(){
                if(this.value <=5000) {
                  return "差("+this.value+")";
                }else if(this.value >5000 && this.value <=10000) {
                  return "较差("+this.value+")";
                }
                else if(this.value >10000 && this.value <=20000) {
                  return "适中("+this.value+")";
                }
                else if(this.value >20000 && this.value <=30000) {
                  return "好("+this.value+")";
                }
                else if(this.value >30000 && this.value <=40000) {
                  return "睡神("+this.value+")";
                }
                else {
                  return "猪八戒级("+this.value+")";
                }
              }
            }
          },
          // tooltip: {
          //     valueSuffix: 'm'
          // },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
            name: '每天睡眠质量',
            data: sum
          }]
        });
        // this.chart7.series[0].update({
        //   name: '每天睡眠质量',
        //   data: sum
        // });
        // this.chart7.redraw();

        var time = new Date().getTime();
        //console.log("final：",time)

        // for ( var i=0 ; i<answer.rows.length;i++) {
        //   var x= answer.rows.item(i);
        //   var listAtr=[];
        //   var listData=[];
        //   for (var jj in x) {
        //     listAtr.push(jj);
        //     listData.push(x[jj]);
        //   }
        //   console.log(listAtr);
        //   console.log(listData);
        // }
      },
      (Error)=>{
        //console.log("sleep.ts " + Error);
    });
  }
}
