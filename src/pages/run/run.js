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
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { databaseManager } from '../../providers/databaseManager';
import * as Highcharts from 'highcharts';
import { dataClass } from '../../entity/dataClass';
var RunPage = /** @class */ (function () {
    function RunPage(navCtrl, loadingCtrl, navParams, dm) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.navParams = navParams;
        this.dm = dm;
        //设置默认seg
        this.segment = "30day";
        this.average7 = 0;
        this.average30 = 0;
        this.sum7 = 0;
        this.sum30 = 0;
    }
    RunPage.prototype.ionViewDidLoad = function () {
        console.log('进入了 run.ts 页面');
        var loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        setTimeout(function () {
            loader.dismiss();
        }, 1000);
        console.log('run.ts  ionViewDidLoad ');
    };
    RunPage.prototype.ionViewWillEnter = function () {
        console.log('run.ts  ionViewWillEnter ');
        this.dm.databaseInit();
        this.ionChange();
    };
    RunPage.prototype.renderday1 = function () {
        var categoies = [];
        for (var i = 6; i >= 0; i--) {
            var x = new Date().getTime();
            var date = new Date(x - 24 * 60 * 60 * 1000 * i);
            var mon = date.getMonth() + 1;
            var day = date.getDate();
            categoies.push(mon + '\\' + day);
        }
        console.log(categoies);
        this.chart7 = Highcharts.chart('container7', {
            chart: {
                type: 'column'
            },
            title: {
                text: '最近七天运动数据',
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
                    text: '步数'
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
                    name: '步数',
                    data: [5535, 5654, 451, 2124, 4579, 1249, 1547]
                }]
        });
    };
    RunPage.prototype.renderday2 = function () {
        var categoies1 = [];
        for (var i = 29; i >= 0; i--) {
            var x1 = new Date().getTime();
            var date1 = new Date(x1 - 24 * 60 * 60 * 1000 * i);
            var mon1 = date1.getMonth() + 1;
            var day1 = date1.getDate();
            categoies1.push(mon1 + '\\' + day1);
        }
        console.log(categoies1);
        this.chart30 = Highcharts.chart('container30', {
            chart: {
                type: 'column'
            },
            title: {
                text: '最近30天运动数据',
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
                    name: '步数',
                    data: [5535, 5654, 451, 2124, 4579, 1249, 1547, 5535, 5654, 451, 2124, 4579, 1249, 1547, 5535, 5654, 451, 2124, 4579, 1249, 1547, 5535, 5654, 451, 2124, 4579, 1249, 1547, 4554, 7777]
                }]
        });
    };
    RunPage.prototype.ionChange = function () {
        console.log("current page " + this.segment);
        var self = this;
        if (this.segment == "7day") {
            var cnt = 0;
            var time = setInterval(function () {
                cnt++;
                var obj = document.getElementById("container7");
                if (obj || cnt > 30) {
                    clearInterval(time);
                    console.log("find 7day");
                    self.renderday1();
                    self.change7();
                }
                else {
                    console.log("no find 7day");
                }
            }, 10);
        }
        else if (this.segment == "30day") {
            var cnt = 0;
            var time = setInterval(function () {
                var obj = document.getElementById("container30");
                if (obj || cnt > 30) {
                    clearInterval(time);
                    console.log("find 30day");
                    self.renderday2();
                    self.change30();
                }
                else {
                    console.log("no find 30day");
                }
                cnt++;
            }, 10);
        }
    };
    RunPage.prototype.change7 = function () {
        var _this = this;
        var categories1 = [];
        for (var i = 6; i >= 0; i--) {
            var x1 = new Date().getTime();
            var date1 = new Date(x1 - 24 * 60 * 60 * 1000 * i);
            var day1 = date1.getDate();
            if (day1 < 10) {
                categories1.push('0' + day1.toString());
            }
            else {
                categories1.push(day1.toString());
            }
        }
        console.log(categories1);
        this.dm.queryLastAse(7, ['HH', 'II'], "0").then(function (resultSet) {
            console.log("run.ts resultSet \n");
            console.log('length ' + resultSet.rows.length);
            for (var i = 0; i < resultSet.rows.length; i++) {
                console.log(' for loop i = ', i);
                var x = resultSet.rows.item(i);
                var listAtr = [];
                var listData = [];
                for (var j in x) {
                    listAtr.push(j);
                    listData.push(x[j]);
                }
                console.log(listAtr);
                console.log(listData);
            }
            console.log("run.ts resultSet.length \n" + resultSet.rows.length);
            var run_data = [0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < resultSet.rows.length; i++) {
                // console.log(categories1);
                var x = resultSet.rows.item(i);
                for (var j in categories1) {
                    // console.log(categories1[j] +"   "+ x["datee"].substring(8,10));
                    if (categories1[j] == x["datee"].substring(8, 10)) {
                        run_data[j] = x["sum(II)"] * 256 + x["sum(HH)"];
                    }
                }
            }
            var cnt = 0;
            var sum = 0;
            for (var i = 0; i < 7; i++) {
                if (run_data[i] > 0) {
                    cnt++;
                    sum += run_data[i];
                }
            }
            if (cnt > 0) {
                _this.average7 = Math.round(sum / cnt);
            }
            else
                _this.average7 = 0;
            _this.sum7 = sum;
            console.log("run.ts run_data7 \n" + run_data);
            _this.chart7.series[0].update({
                name: '步数',
                data: run_data
            });
            _this.chart7.redraw();
        });
    };
    RunPage.prototype.change30 = function () {
        var _this = this;
        var categories = [];
        for (var i = 29; i >= 0; i--) {
            var x = new Date().getTime();
            var date = new Date(x - 24 * 60 * 60 * 1000 * i);
            var day = date.getDate();
            var mon = date.getMonth() + 1;
            var tmp = "";
            if (mon < 10) {
                tmp += ('0' + mon.toString());
            }
            else {
                tmp += (mon.toString());
            }
            tmp += '-';
            if (day < 10) {
                tmp += ('0' + day.toString());
            }
            else {
                tmp += (day.toString());
            }
            categories.push(tmp);
        }
        console.log(categories);
        this.dm.queryLastAse(30, ['HH', 'II'], "0").then(function (resultSet) {
            console.log("run.ts resultSet.length \n" + resultSet.rows.length);
            var run_data = [];
            for (var i = 0; i < 30; ++i) {
                run_data.push(0);
            }
            for (var i = 0; i < resultSet.rows.length; i++) {
                console.log(categories);
                var x = resultSet.rows.item(i);
                for (var j in categories) {
                    // console.log(categories[j] +"   "+ x["datee"].substring(5,10));
                    if (categories[j] == x["datee"].substring(5, 10)) {
                        run_data[j] = x["sum(II)"] * 256 + x["sum(HH)"];
                    }
                }
            }
            var cnt = 0;
            var sum = 0;
            for (var i = 0; i < 30; i++) {
                if (run_data[i] > 0) {
                    cnt++;
                    sum += run_data[i];
                }
            }
            if (cnt > 0) {
                _this.average30 = Math.round(sum / cnt);
            }
            else
                _this.average30 = 0;
            _this.sum30 = sum;
            console.log("run.ts run_data30 \n" + run_data);
            _this.chart30.series[0].update({
                name: '步数',
                data: run_data
            });
            _this.chart30.redraw();
        });
        // this.dm.query();
    };
    RunPage.prototype.query = function () {
        this.dm.query();
    };
    RunPage.prototype.insert = function () {
        var dc = new dataClass();
        var str1 = ['18', '1', '19', '2', '0', '2', '1', '2', '1', '2', '1', '2', '1'];
        var index = 18011900;
        for (var i = 0; i < 96; ++i) {
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
    RunPage.prototype.query2 = function () {
        this.dm.queryDataFull(-1).then(function (answer) {
            console.log(answer);
        });
    };
    RunPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-run',
            templateUrl: 'run.html',
        }),
        __metadata("design:paramtypes", [NavController,
            LoadingController,
            NavParams,
            databaseManager])
    ], RunPage);
    return RunPage;
}());
export { RunPage };
//# sourceMappingURL=run.js.map