import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as Highcharts from 'highcharts';


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
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
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
        }
        else{
          console.log("no find 30day");
        }
        cnt++;
      },10);
    }
  }
  change(){
    var categoies = [];
    for (var i = 6; i >= 0; i--) {
      var x=new Date().getTime() ;
      var date=new Date(x-24*60*60*1000*i);
      var mon=date.getMonth()+1;
      var day=date.getDate();
      categoies.push(mon+'\\'+day);
    }
    console.log(this.chart7.series);
    console.log(this.chart7.series[0]);
    this.chart7=Highcharts.chart('container7',{
      chart:{
        type:'column'
      },
      title: {
        text: '运动数据',
        x: -20
      },
      subtitle: {
          text: 'subtitle',
          x: -20
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
        data: [535,654,451,124,479,149,157]
      }]
    });
    // this.chart7.redraw();

  }

}