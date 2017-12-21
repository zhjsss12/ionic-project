import { Component } from '@angular/core';

import {
  ActionSheet,
  ActionSheetController,
  ActionSheetOptions,
  Config,
  NavController
} from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';

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
  myAppDatabase: SQLiteObject;
  

  speakers: any[] = [];
  chart:any;
  chart7:any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser,
    private sqlite: SQLite,
    public dm:databaseManager,

  ) {}

  ionViewDidLoad() {
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
            text: '近日睡眠质量分析'
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
    var categoies = [];
    for (var i = 6; i >= 0; i--) {
      var x=new Date().getTime() ;
      var date=new Date(x-24*60*60*1000*i);
      var mon=date.getMonth()+1;
      var day=date.getDate();
      categoies.push(mon+'\\'+day);
    }
    console.log(categoies);
    this.chart7 = Highcharts.chart('container7', {
      chart:{
        type:'column'
      },
      title: {
        text: '近一星期睡眠质量分析',
        x: -20
      },
      subtitle: {
          text: 'subtitle',
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
          categories: categoies
      },
      yAxis: {
        title: {
            text: '睡眠质量'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        labels: {
          formatter:function(){
            if(this.value <=5000) { 
              return this.value;
            }else if(this.value >5000 && this.value <=10000) { 
              return this.value;
            }else { 
              return this.value;
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
        data: [5535,5654,451,2124,4579,1249,1547]
      }]
    });   
  }


}
