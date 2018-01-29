import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {databaseManager} from '../../providers/databaseManager';
import * as Highcharts from 'highcharts';
import {dataClass} from '../../entity/dataClass';

@IonicPage()
@Component({
  selector: 'page-run',
  templateUrl: 'run.html',
})
export class RunPage {
  //设置默认seg
  segment: string = "30day";
  chart7: any;
  chart30: any; 
  average7: number = 0;
  average30: number = 0;
  sum7: number = 0;
  sum30: number = 0;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public dm:databaseManager,) {}

  ionViewDidLoad() {
    this.dm.databaseInit();
    console.log('run.ts  ionViewDidLoad ');
    this.ionChange();
  }

  renderday1(){
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
        text: '最近七天运动数据',
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
            text: '步数'
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
        name: '步数',
        data: [5535,5654,451,2124,4579,1249,1547]
      }]
    });   
  }
  renderday2(){
    var categoies1 = [];
    for (var i = 29; i >= 0; i--) {
      var x1=new Date().getTime() ;
      var date1=new Date(x1-24*60*60*1000*i);
      var mon1=date1.getMonth()+1;
      var day1=date1.getDate();
      categoies1.push(mon1+'\\'+day1);
    }
    console.log(categoies1);
    this.chart30 = Highcharts.chart('container30', {
      chart:{
        type:'column'
      },
      title: {
        text: '最近30天运动数据',
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
          categories: categoies1
      },
      yAxis: {
        title: {
            text: '步数'
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
        name: '步数',
        data: [5535,5654,451,2124,4579,1249,1547,5535,5654,451,2124,4579,1249,1547,5535,5654,451,2124,4579,1249,1547,5535,5654,451,2124,4579,1249,1547,4554,7777]
      }]
    });
  }
  ionChange(){
    console.log("current page " +this.segment);
    var self = this;
    if(this.segment== "7day"){
      var cnt=0;
      var time = setInterval(function(){
        cnt++;
        var obj = document.getElementById("container7"); 
        if (obj||cnt>30){ 
          clearInterval(time);
          console.log("find 7day");
          self.renderday1();
          self.change7();
        }
        else{
          console.log("no find 7day");
        }
      },10);
    }
    else if(this.segment=="30day"){
      var cnt=0;
      var time = setInterval(function(){
        var obj = document.getElementById("container30"); 
        if (obj||cnt>30){ 
          clearInterval(time);
          console.log("find 30day");
          self.renderday2();
          self.change30();
        }
        else{
          console.log("no find 30day");
        }
        cnt++;
      },10);
    }
  }
  change7(){
    var categories1 = [];
    for (var i = 6; i >= 0; i--) {
      var x1=new Date().getTime() ;
      var date1=new Date(x1-24*60*60*1000*i);
      var day1=date1.getDate();
      if(day1<10){
        categories1.push('0'+day1.toString());
      }
      categories1.push(day1.toString());
    }
    console.log(categories1);

    this.dm.queryLastAse(7,['HH','II'],"0").then(
      (resultSet)=>{
        console.log("run.ts resultSet \n");
        console.log('length ' + resultSet.rows.length);
        for ( var i=0 ; i<resultSet.rows.length;i++) {
            console.log(' for loop i = ', i);
            var x= resultSet.rows.item(i);
            var listAtr=[];
            var listData=[];
            for (var j in x) {
              listAtr.push(j);
              listData.push(x[j]);
            }
            console.log(listAtr);
            console.log(listData);
        }
        console.log("run.ts resultSet.length \n" + resultSet.rows.length);

        var run_data : number[] =[0,0,0,0,0,0,0];

          
        for (var i=0 ; i<resultSet.rows.length;i++) {
          console.log(categories1);
          var x= resultSet.rows.item(i);
          for (var j in categories1) {
            console.log(categories1[j] +"   "+ x["datee"].substring(8,10));
            if (categories1[j] == x["datee"].substring(8,10)) {
              run_data[j]=x["sum(II)"]*256+x["sum(HH)"];
            }
          }
        }        
        var cnt=0;
        var sum=0;
        for (var i = 0; i < 7; i++) {
          if (run_data[i]>0) {
            cnt++;
            sum+=run_data[i];
          }
        }
        if (cnt>0) {
          this.average7= sum/cnt;
        }
        else this.average7= 0; 
        this.sum7=sum;
        console.log("run.ts run_data7 \n" + run_data)
        this.chart7.series[0].update({
          name: '步数',
          data:run_data});
        this.chart7.redraw();
      }
    );
  }
  change30(){
    var categories = [];
    for (var i = 29; i >= 0; i--) {
      var x=new Date().getTime() ;
      var date=new Date(x-24*60*60*1000*i);
      var day=date.getDate();
      var mon=date.getMonth()+1;
      var tmp="";
      if(mon<10){
        tmp+=('0'+mon.toString());
      }
      else{
        tmp+=(mon.toString());
      }
      tmp+='-';
      if(day<10){
        tmp+=('0'+day.toString());
      }
      else{
        tmp+=(day.toString());
      }      
      categories.push(tmp);
    }
    console.log(categories);
    this.dm.queryLastAse(30,['HH','II'],"0").then(
      (resultSet)=>{

        console.log("run.ts resultSet.length \n" + resultSet.rows.length);
        var run_data : number[] =[];
        for (var i = 0; i < 30; ++i) {
          run_data.push(0);
        }
        for (var i=0 ; i<resultSet.rows.length;i++) {
          console.log(categories);
          var x= resultSet.rows.item(i);
          for (var j in categories) {
            console.log(categories[j] +"   "+ x["datee"].substring(5,10));
            if (categories[j] == x["datee"].substring(5,10)) {
              run_data[j]=x["sum(II)"]*256+x["sum(HH)"];
            }
          }
        }         
        var cnt=0;
        var sum=0;
        for (var i = 0; i < 30; i++) {
          if (run_data[i]>0) {
            cnt++;
            sum+=run_data[i];
          }
        }
        if (cnt>0) {
          this.average30= sum/cnt;
        }
        else this.average30= 0; 
        this.sum30 = sum; 
        console.log("run.ts run_data30 \n" + run_data)
        this.chart30.series[0].update({
          name: '步数',
          data:run_data});  
        this.chart30.redraw();
      }
    );
    // this.dm.query();
  }
  query(){
    this.dm.query();
  }
  insert(){
    let dc= new dataClass();
    let str1 : string[]=['18','1','19','2','0','2','1','2','1','2','1','2','1'];
    var index= 18011900;
    for (var i = 0; i < 96; ++i) {
      dc.setData(str1);
      dc.setId(index.toString());
      this.dm.insert(dc).then((result)=>{
        console.log(result);
      },(err)=>{
        console.log(err);
      });
      index++;
    }
  }
  query2(){
    this.dm.queryDataFull(-1).then(
      (answer)=>{
        console.log(answer);
      }
    );
  }
}