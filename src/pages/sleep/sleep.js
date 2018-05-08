var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActionSheetController, Config, NavController, LoadingController, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { httpManager } from '../../providers/httpManager';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { SQLite } from '@ionic-native/sqlite';
import { dataClass } from '../../entity/dataClass';
import { databaseManager } from '../../providers/databaseManager';
import * as Highcharts from 'highcharts';
// TODO remove
var SleepPage = /** @class */ (function () {
    function SleepPage(actionSheetCtrl, navCtrl, confData, config, inAppBrowser, sqlite, dm, loadingCtrl, user, events, hm) {
        this.actionSheetCtrl = actionSheetCtrl;
        this.navCtrl = navCtrl;
        this.confData = confData;
        this.config = config;
        this.inAppBrowser = inAppBrowser;
        this.sqlite = sqlite;
        this.dm = dm;
        this.loadingCtrl = loadingCtrl;
        this.user = user;
        this.events = events;
        this.hm = hm;
        this.speakers = [];
    }
    SleepPage.prototype.ionViewDidLoad = function () {
        console.log('sleep.ts  ionViewDidLoad');
        var loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        setTimeout(function () {
            loader.dismiss();
        }, 1000);
    };
    SleepPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.dm.databaseInit();
        setTimeout(function () {
            _this.render3();
            _this.render2();
            _this.render1();
        }, 300);
        console.log('进入了 sleep 页面');
    };
    SleepPage.prototype.test_chart = function () {
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
                        ['浅睡眠', 35],
                        ['轻睡眠', 25],
                        {
                            name: '中睡眠',
                            y: 18,
                            sliced: true,
                            selected: true
                        },
                        ['深睡眠', 22],
                    ]
                }]
        });
    };
    SleepPage.prototype.cal = function (num) {
        var tmp = new Date();
        var time = tmp.getTime();
        tmp = new Date(time + 24 * 60 * 60 * 1000 * num);
        var day = (tmp.getFullYear() % 100).toString();
        if (tmp.getMonth() < 9) {
            day += ('0' + (tmp.getMonth() + 1).toString());
        }
        else {
            day += (tmp.getMonth() + 1).toString();
        }
        if (tmp.getDate() < 10) {
            day += ('0' + tmp.getDate().toString());
        }
        else {
            day += tmp.getDate().toString();
        }
        return day;
    };
    SleepPage.prototype.insert = function () {
        var dc = new dataClass();
        var str1 = ['18', '1', '27', '50', '255', '2', '1', '2', '1', '2', '1', '2', '1'];
        var index = 18012750;
        for (var i = 0; i < 20; ++i) {
            dc.setData(str1);
            dc.setId(index.toString());
            this.dm.insert(dc).then(function (result) {
                console.log(result);
            }, function (err) {
                console.log(err);
            });
            index++;
        }
    };
    SleepPage.prototype.render1 = function () {
        var obj = document.getElementById("container");
        if (obj) {
            console.log("sleep.ts ionviewDidload  find container");
        }
        else {
            console.log("sleep.ts/ionviewDidload  not find container");
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
                    data: [
                        ['浅睡眠', 35],
                        ['轻睡眠', 25],
                        {
                            name: '中睡眠',
                            y: 18,
                            sliced: true,
                            selected: true
                        },
                        ['深睡眠', 22],
                    ]
                }]
        });
    };
    SleepPage.prototype.render2 = function () {
        var _this = this;
        var yesterday = this.cal(-1);
        var strToday = this.cal(0);
        var tommorrow = this.cal(1);
        var ids = [];
        for (var i = 0; i < 10; i++) {
            ids.push(strToday + "0" + i.toString());
        }
        for (var i = 10; i < 96; i++) {
            ids.push(strToday + i.toString());
        }
        console.log("sleep.ts  today = " + strToday + " yesterday = " + yesterday);
        console.log("sleep.ts  ids " + ids);
        var arr = new Array(96);
        for (var i = 0; i < 96; i++) {
            arr[i] = 0;
        }
        var tmp2 = [':00', ":15", ":30", ':45'];
        var categorySpecific = [];
        for (var i = 0; i < 24; i++) {
            for (var j = 0; j < 4; j++) {
                categorySpecific.push(i.toString() + tmp2[j]);
            }
        }
        this.specific = Highcharts.chart('specific', {
            chart: {
                type: 'column'
            },
            title: {
                text: '近日详细睡眠质量',
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
                categories: categorySpecific
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
                    formatter: function () {
                        if (this.value <= 5000) {
                            return this.value;
                        }
                        else if (this.value > 5000 && this.value <= 10000) {
                            return this.value;
                        }
                        else {
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
                    name: '睡眠质量',
                    data: arr
                }]
        });
        var aspect = ["FF", 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM'];
        this.dm.querySleep(yesterday, tommorrow).then(function (answer) {
            console.log('sleep.ts length ' + answer.rows.length);
            var len = answer.rows.length;
            var sleep1 = 0, sleep2 = 0, sleep3 = 0, sleep4 = 1, sleepelse = 0;
            for (var i = 0; i < 96; i++) {
                // console.log(answer.rows.item(i)['id']);
                // console.log(answer.rows.item(i)["FF + GG + HH + II +JJ +KK+ LL +MM"]);
                for (var j = 0; j < len; j++) {
                    if (ids[i] == answer.rows.item(j)['id']) {
                        for (var asp = 0; asp < 8; asp++) {
                            if (answer.rows.item(j)[aspect[asp]] != 0) {
                                var x = 256 - (answer.rows.item(j)[aspect[asp]]);
                                arr[i] += x;
                                if (x <= 64) {
                                    sleep4++;
                                }
                                else if (x <= 128 && x > 64) {
                                    sleep3++;
                                }
                                else if (x <= 192 && x > 128) {
                                    sleep2++;
                                }
                                else if (x > 192) {
                                    sleep1++;
                                }
                            }
                        }
                    }
                }
            }
            _this.specific.series[0].update({
                name: '睡眠质量',
                data: arr
            });
            _this.specific.redraw();
            _this.chart.series[0].update({
                type: 'pie',
                name: '睡眠时间占比',
                data: [
                    ['浅睡眠', sleep4],
                    ['轻睡眠', sleep3],
                    {
                        name: '中睡眠',
                        y: sleep2,
                        sliced: true,
                        selected: true
                    },
                    ['深睡眠', sleep1],
                ]
            });
            _this.chart.redraw();
            console.log('sleep.ts arr 四种睡眠' + arr);
        }, function (Error) {
            console.log("sleep.ts " + Error);
        });
    };
    //画出最近七天的睡眠情况
    SleepPage.prototype.render3 = function () {
        var _this = this;
        var categoies = [];
        for (var i = 6; i >= 0; i--) {
            var x = new Date().getTime();
            var date = new Date(x - 24 * 60 * 60 * 1000 * i);
            var mon = date.getMonth() + 1;
            var day = date.getDate();
            categoies.push(mon + '\\' + day);
        }
        console.log(categoies);
        var obj = document.getElementById("container7");
        if (obj) {
            console.log("sleep.ts ionviewDidload  find container7");
        }
        else {
            console.log("sleep.ts/ionviewDidload  not find container7");
        }
        this.chart7 = Highcharts.chart('container7', {
            chart: {
                type: 'column'
            },
            title: {
                text: '近一星期睡眠质量分析',
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
                    text: '睡眠质量'
                },
                plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }],
                labels: {
                    formatter: function () {
                        if (this.value <= 5000) {
                            return this.value;
                        }
                        else if (this.value > 5000 && this.value <= 10000) {
                            return this.value;
                        }
                        else {
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
                    data: [5535, 5654, 451, 2124, 4579, 1249, 1547]
                }]
        });
        var strYesterday = this.cal(-7);
        var strToday = this.cal(0);
        var sum = [];
        for (var i = 0; i < 7; i++) {
            sum.push(0);
        }
        var ids = [];
        for (var i = -7; i <= 0; i++) {
            ids.push(this.cal(i));
        }
        var aspect = ["FF", 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM'];
        var time = new Date().getTime();
        console.log(time);
        this.dm.querySleep(strYesterday, strToday).then(function (answer) {
            console.log('sleep.ts chart3 length ' + answer.rows.length);
            var len = answer.rows.length;
            var cnt = [];
            for (var i = 0; i < 7; i++) {
                cnt.push(0);
            }
            for (var i = 0; i < len; i++) {
                var x = answer.rows.item(i);
                for (var j = 0; j < 7; j++) {
                    if (+x['id'] < +(ids[j + 1] + '48') && +x['id'] >= +(ids[j] + '48')) {
                        for (var asp = 0; asp < 8; asp++) {
                            if (x[aspect[asp]] != 0) {
                                sum[j] += 256 - (x[aspect[asp]]);
                            }
                        }
                        break;
                    }
                }
            }
            _this.user.getUsername().then(function (userName) {
                _this.hm.sendSleepToServer(userName, Math.round(sum[6] / 6000) / 10);
            });
            _this.user.setSleepData(Math.round(sum[6] / 6000) / 10);
            _this.events.publish('sleepChanged');
            console.log('this.user.setSleepData(sum[6]/60000);', Math.round(sum[6] / 6000) / 10);
            console.log('sleep.ts chart3 sum ' + sum);
            _this.chart7.series[0].update({
                name: '每天睡眠质量',
                data: sum
            });
            _this.chart7.redraw();
            var time = new Date().getTime();
            console.log(time);
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
        }, function (Error) {
            console.log("sleep.ts " + Error);
        });
    };
    SleepPage = __decorate([
        Component({
            selector: 'page-sleep',
            templateUrl: 'sleep.html'
        }),
        __metadata("design:paramtypes", [ActionSheetController,
            NavController,
            ConferenceData,
            Config,
            InAppBrowser,
            SQLite,
            databaseManager,
            LoadingController,
            UserData,
            Events,
            httpManager])
    ], SleepPage);
    return SleepPage;
}());
export { SleepPage };
//# sourceMappingURL=sleep.js.map