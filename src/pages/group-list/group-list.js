var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, ToastController, LoadingController } from 'ionic-angular';
/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { SessionDetailPage } from '../session-detail/session-detail';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { httpManager } from '../../providers/httpManager';
import { GroupCreatePage } from '../group-create/group-create';
var GroupListPage = /** @class */ (function () {
    function GroupListPage(alertCtrl, app, loadingCtrl, modalCtrl, navCtrl, toastCtrl, confData, user, hm) {
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.confData = confData;
        this.user = user;
        this.hm = hm;
        this.dayIndex = 0;
        this.queryText = '';
        this.segment = 'all';
        this.excludeTracks = [];
        this.shownSessions = [];
        this.groups = [];
    }
    GroupListPage.prototype.ionViewDidLoad = function () {
        this.app.setTitle('Schedule');
        // console.log('group-list');
        // this.hm.getSelfGroupFriends('二狗子');
    };
    GroupListPage.prototype.ionViewWillEnter = function () {
        this.updateSchedule();
        console.log('group-list will enter');
    };
    GroupListPage.prototype.updateSchedule = function () {
        var _this = this;
        // Close any open sliding items when the schedule updates
        this.scheduleList && this.scheduleList.closeSlidingItems();
        this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then(function (data) {
            console.log('this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then( (data:any) =>{ ', data);
            _this.groups = data[0];
            _this.shownSessions = data[0].show;
            _this.user._favorites = [];
            for (var i = 0; i < data[1].length; i++) {
                _this.user.addFavorite(data[1][i]);
            }
            console.log("this.user._favorites", _this.user._favorites);
        });
    };
    GroupListPage.prototype.presentFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
        modal.present();
        modal.onWillDismiss(function (data) {
            if (data) {
                _this.excludeTracks = data;
                _this.updateSchedule();
            }
        });
    };
    GroupListPage.prototype.goToSessionDetail = function (sessionData) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(SessionDetailPage, { name: sessionData });
    };
    GroupListPage.prototype.addFavorite = function (slidingItem, sessionData) {
        var _this = this;
        if (this.user.hasFavorite(sessionData.groupName)) {
            // woops, they already favorited it! What shall we do!?
            // prompt them to remove it
            this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
        }
        else {
            // create an alert instance
            console.log(sessionData);
            var havePass = this.alertCtrl.create({
                title: '请输入群组密码',
                message: "非常抱歉，这是一个密码群组，请输入群组密码",
                inputs: [
                    {
                        name: 'title',
                        placeholder: '输入密码'
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: function (data) {
                            console.log('Cancel clicked');
                            slidingItem.close();
                        }
                    },
                    {
                        text: 'Save',
                        handler: function (data) {
                            console.log("这是输入的密码");
                            console.log(data);
                            if (sessionData.password == data.title) {
                                noPass_1.present();
                                // remember this session as a user favorite
                                // this.user.addFavorite(sessionData.groupName);
                            }
                            else {
                                enterFail_1.present();
                            }
                        }
                    }
                ]
            });
            var noPass_1 = this.alertCtrl.create({
                title: '成功加入群组',
                buttons: [{
                        text: 'OK',
                        handler: function () {
                            // close the sliding item
                            _this.hm.sendEnterGroupToServer(sessionData.groupName);
                            _this.user.addFavorite(sessionData.groupName);
                            slidingItem.close();
                        }
                    }]
            });
            var enterFail_1 = this.alertCtrl.create({
                title: '加入群组失败',
                message: "非常抱歉，这是一个密码群组，您输入的群组密码错误",
                buttons: [{
                        text: 'OK',
                        handler: function () {
                            // close the sliding item
                            slidingItem.close();
                        }
                    }]
            });
            if (sessionData.hasPass == '1') {
                havePass.present();
            }
            else {
                noPass_1.present();
            }
        }
    };
    GroupListPage.prototype.removeFavorite = function (slidingItem, sessionData, title) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            message: 'Would you like to remove this session from your favorites?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: function () {
                        // they clicked the cancel button, do not remove the session
                        // close the sliding item and hide the option buttons
                        slidingItem.close();
                    }
                },
                {
                    text: 'Remove',
                    handler: function () {
                        // they want to remove this session from their favorites
                        _this.user.removeFavorite(sessionData.groupName);
                        _this.hm.sendExitGroupToServer(sessionData.groupName);
                        _this.updateSchedule();
                        // close the sliding item and hide the option buttons
                        slidingItem.close();
                    }
                }
            ]
        });
        // now present the alert on top of all other content
        alert.present();
    };
    GroupListPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    GroupListPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.groups = this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment);
        this.shownSessions = this.groups["show"];
        // simulate a network request that would take longer
        // than just pulling from out local json file
        setTimeout(function () {
            refresher.complete();
            var toast = _this.toastCtrl.create({
                message: 'Sessions have been updated.',
                duration: 3000
            });
            toast.present();
        }, 1000);
    };
    GroupListPage.prototype.updateFriends = function () {
        // let popover = this.popoverCtrl.create(GroupCreatePage);
        //
        // popover.present();
        this.navCtrl.push(GroupCreatePage);
    };
    __decorate([
        ViewChild('scheduleList', { read: List }),
        __metadata("design:type", List)
    ], GroupListPage.prototype, "scheduleList", void 0);
    GroupListPage = __decorate([
        Component({
            selector: 'page-group',
            templateUrl: 'group-list.html'
        }),
        __metadata("design:paramtypes", [AlertController,
            App,
            LoadingController,
            ModalController,
            NavController,
            ToastController,
            ConferenceData,
            UserData,
            httpManager])
    ], GroupListPage);
    return GroupListPage;
}());
export { GroupListPage };
//# sourceMappingURL=group-list.js.map