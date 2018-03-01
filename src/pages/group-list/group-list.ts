import { Component, ViewChild } from '@angular/core';

import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

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
import { GroupCreatePage} from '../group-create/group-create';



@Component({
  selector: 'page-group',
  templateUrl: 'group-list.html'
})
export class GroupListPage {
  // the list is a child of the schedule page
  // @ViewChild('scheduleList') gets a reference to the list
  // with the variable #scheduleList, `read: List` tells it to return
  // the List and not a reference to the element
  @ViewChild('scheduleList', { read: List }) scheduleList: List;

  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = []
  confDate: string;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    public user: UserData,
    private hm: httpManager,
  ) {}

  ionViewDidLoad() {
    this.app.setTitle('Schedule');
    
    // console.log('group-list');
    // this.hm.getSelfGroupFriends('二狗子');
  }

  ionViewWillEnter(){
    this.updateSchedule();
    console.log('group-list will enter');
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    this.scheduleList && this.scheduleList.closeSlidingItems();


    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then( (data) =>{
      console.log('this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).then( (data:any) =>{ ',data);
      this.groups = data[0];
      this.shownSessions = data[0].show;
      this.user._favorites=[];
      for (var i = 0; i < data[1].length; i++) {
          this.user.addFavorite(data[1][i]);
      }
      console.log("this.user._favorites",this.user._favorites);
    });
  }

  presentFilter() {
    let modal = this.modalCtrl.create(ScheduleFilterPage, this.excludeTracks);
    modal.present();

    modal.onWillDismiss((data: any[]) => {
      if (data) {
        this.excludeTracks = data;
        this.updateSchedule();
      }
    });

  }

  goToSessionDetail(sessionData: any) {
    // go to the session detail page
    // and pass in the session data

    this.navCtrl.push(SessionDetailPage, { name: sessionData });
  }

  addFavorite(slidingItem: ItemSliding, sessionData: any) {

    if (this.user.hasFavorite(sessionData.groupName)) {
      // woops, they already favorited it! What shall we do!?
      // prompt them to remove it
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {

      // create an alert instance
      console.log(sessionData);
      let havePass = this.alertCtrl.create({
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
            handler: data => {
              console.log('Cancel clicked');
              slidingItem.close();
            }
          },
          {
            text: 'Save',
            handler: data => {
              console.log("这是输入的密码");
              console.log(data);
              if (sessionData.password == data.title) {
                noPass.present();
                // remember this session as a user favorite
                // this.user.addFavorite(sessionData.groupName);
              }
              else{
                enterFail.present();
              }
            }
          }
        ]
      });
      let noPass = this.alertCtrl.create({
        title: '成功加入群组',
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            this.hm.sendEnterGroupToServer(sessionData.groupName);
            this.user.addFavorite(sessionData.groupName);
            slidingItem.close();
          }
        }]
      });

      let enterFail = this.alertCtrl.create({
        title: '加入群组失败',
        message: "非常抱歉，这是一个密码群组，您输入的群组密码错误",
        buttons: [{
          text: 'OK',
          handler: () => {
            // close the sliding item
            slidingItem.close();
          }
        }]
      });

      if (sessionData.hasPass == '1') {
        havePass.present();
      }
      else {
        noPass.present();
      }

    }

  }

  removeFavorite(slidingItem: ItemSliding, sessionData: any, title: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.groupName);
            this.hm.sendExitGroupToServer(sessionData.groupName);
            this.updateSchedule();
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  openSocial(network: string, fab: FabContainer) {
    let loading = this.loadingCtrl.create({
      content: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    loading.onWillDismiss(() => {
      fab.close();
    });
    loading.present();
  }

  doRefresh(refresher: Refresher) {
    this.groups =this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment);
    this.shownSessions = this.groups["show"];

      // simulate a network request that would take longer
      // than just pulling from out local json file
      setTimeout(() => {
        refresher.complete();

        const toast = this.toastCtrl.create({
          message: 'Sessions have been updated.',
          duration: 3000
        });
        toast.present();
      }, 1000);

  }
  updateFriends(){
    // let popover = this.popoverCtrl.create(GroupCreatePage);
    //
    // popover.present();
    this.navCtrl.push(GroupCreatePage);
  }
}

