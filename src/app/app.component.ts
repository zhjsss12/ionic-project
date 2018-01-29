import { Component, ViewChild, NgZone } from '@angular/core';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events, MenuController, Nav, Platform, ToastController,AlertController, NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { PlanPage } from '../pages/plan/plan';
import { NotificationPage } from '../pages/notification/notification';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SchedulePage } from '../pages/schedule/schedule';
import { RankPage } from '../pages/rank/rank';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { SupportPage } from '../pages/support/support';
import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { databaseManager } from '../providers/databaseManager';
import { bleManager } from '../providers/bleManager';
import { BLE } from '@ionic-native/ble';
import { Injectable } from '@angular/core';
export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  ringUnlock? :boolean;
}

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  devices : any[] = [];
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  appPages: PageInterface[] = [
    { title: '个人信息', name: 'AccountPage', component: AccountPage, icon: 'person' },
    { title: '个人计划', name: 'PlanPage', component: PlanPage, icon: 'contacts' },
    { title: '通知提醒', name: 'NotificationPage', component: NotificationPage, icon: 'map' }
    // { title: 'About', name: 'TabsPage', component: TabsPage, tabComponent: AboutPage, index: 3, icon: 'information-circle' },
    // { title: 'Hello', name: 'TabsPage', component: TabsPage, tabComponent: HelloIonicPage, index: 4, icon: 'hello' }
  ];
  ringPages: PageInterface[] = [
    { title: '绑定手环/解除绑定', name: 'TabsPage', component: TabsPage, icon: 'information-circle', ringUnlock: true }
  ];
  loggedInPages: PageInterface[] = [
    // { title: 'Account', name: 'AccountPage', component: AccountPage, icon: 'person' },
    // { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: '退出登录', name: 'TabsPage', component: TabsPage, icon: 'log-out', logsOut: true }
  ];
  loggedOutPages: PageInterface[] = [
    { title: '登录', name: 'LoginPage', component: LoginPage, icon: 'log-in' },
    // { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help' },
    { title: '注册', name: 'SignupPage', component: SignupPage, icon: 'person-add' }
  ];
  username:string ="";
  statusMessage: string;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public userData: UserData,
    public confData: ConferenceData,
    public storage: Storage,
    public db: databaseManager,
    public ble: BLE,
    public alertCtrl: AlertController,
    private ngZone: NgZone,
    public userdata: UserData,
    public toastCtrl: ToastController,
    private bm: bleManager
  ) {
    this.storage.get('hasLoggedIn')
      .then((hasLoggedIn) => {
        if (hasLoggedIn) {
          this.userData.getUsername().then((username) => {
            this.username = username;
          });
          this.rootPage = TabsPage;
        } else {
          setTimeout(() => {
            this.userData.setTimeTarget(2);
            this.userData.setcaloriesTarget(500);
            this.userData.setdistTarget(2);
            this.userData.setStepTarget(5000);
            this.userData.setStepShow(0);
            this.userData.setUpdateTime(new Date("1970-1-1 0:0:0"));
          }, 3000);
          console.log('alababa')
          this.rootPage = LoginPage;
        }
      });
    /*
    // Check if the user has already seen the tutorial
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = TutorialPage;
        }
        this.platformReady()
      });
      */

    // load the conference data
    confData.load();
    this.db.databaseInit();
    // decide which menu items should be hidden by current login status stored in local storage
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    console.log(this.userdata.getStepTarget());
    this.enableMenu(true);

    this.listenToLoginEvents();
    // this.listenToRingEvent();
    this.listenToNote();

  }

  initializeApp() {
    console.log("init...");
    this.userdata.getDeviceNumber().then(
      (value) => {
        this.ble.isConnected(value).then(
          (id) => {
            this.platform.ready().then(() => {
              // Okay, so the platform is ready and our plugins are available.
              // Here you can do any higher level native things you might need.
              this.statusBar.styleDefault();
              this.splashScreen.hide();
            });
          }
        ).catch(
          (id) => this.loopConnect(id)
        );
      }
    ).catch(

      );

    // this.platform.ready().then(() => {
    //   // Okay, so the platform is ready and our plugins are available.
    //   // Here you can do any higher level native things you might need.
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      this.nav.push(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }



    // if(this.navParams.get('type') == 'untab'){
    //   this.nav.pop();
    //   if(page.logsOut === true || page.ringUnlock === true){
    //     this.nav.setRoot(page.name, params).catch((err: any) => {
    //         console.log(`Didn't set nav root: ${err}`);
    //       });
    //   }else{
    //     this.nav.push(page, {type:'un-tab'});
    //   }
    //
    // }else{
      // if(page.logsOut === true || page.ringUnlock === true){
      //   this.nav.setRoot(page.name, params).catch((err: any) => {
      //       console.log(`Didn't set nav root: ${err}`);
      //     });
      // }else{
      //   this.nav.setRoot(TabsPage);
      //   this.nav.push(page);
      // }
    // }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
      this.nav.setRoot(LoginPage);
    }

    if(page.ringUnlock === true){
      this.storage.get('hasConnectRing')
        .then((hasConnectRing) => {
          if (hasConnectRing) {
            var number;
            this.userData.getDeviceNumber().then((data)=>{
              number = data;
            });
            this.ble.disconnect(number).then((value)=>{
              console.log(value);
            }).catch((error)=>{
              console.log(error);
            });
            this.userData.disconnectRing();
            alert("您已与手环解除绑定");
          }else{
            this.connectToRing();
          }
        });
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
      this.userData.getUsername().then((username) => {
        this.username = username;
      });
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
      this.userData.getUsername().then((username) => {
        this.username = username;
      });
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
      this.username = "";
    });
  }

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  platformReady(id) {
    console.log('plat pre now');
    this.ble.isConnected(id).then(
      (id) => {
        this.platform.ready().then(() => {
          this.splashScreen.hide();
        });
      }
    ).catch(
      (id) => this.loopConnect(id)
    );
    // Call any initial plugins when ready
    // this.platform.ready().then(() => {
    //   this.splashScreen.hide();
    // });
  }
  loopConnect(id){
    console.log("first loop now...");
    this.ble.isConnected(id).then(
      (id) => {
        this.platform.ready().then(() => {
          this.splashScreen.hide();
        });
      }
    ).catch(
      (id) => this.loopConnect(id)
    );
  }
  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'primary';
    }
    return;
  }
  connectToRing() {
    // the root left menu should be disabled on the tutorial page
    this.devices = [];
    this.ble.isEnabled().then(
    ).catch(
      () => {
              alert('Please open your bluetooth');
              this.ble.showBluetoothSettings().then().catch(
                () => console.log('error')
              );
            }
    );
    this.scanRing();
  }

  scanRing() {
    let i = 6;
    while(this.devices.length == 0 && i>0){
      i--;
      let strs : string[] = ['fff0'];
      this.ble.scan(strs, 5).subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );
      setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    }
    // this.devices = this.bm.firstScan(this.devices);
    if(this.devices.length>0){
      this.showRadio(this.devices);
    }else{
      let alert = this.alertCtrl.create({
        title: '无法找到任何设备！',
        message: '您可以选择尝试重新连接手环或者放弃此次绑定',
        buttons: [
          {
            text: '重试',
            handler: () => {
              console.log('re-scan');
              this.scanRing();
            }
          },
          {
            text: '放弃',
            handler: () => {
              console.log('refuse this connect');
            }
          }
        ]
      });
      alert.present();
    }
  }

  showRadio(device: any[]) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Choose your ring:');
    for(let i = 0; i < device.length; i++) {
      if(i == 0) {
        alert.addInput({
          type: 'radio',
          label: device[i].name+' '+device[i].id,
          value: device[i].id,
          checked: true
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: device[i].name+' '+device[i].id,
          value: device[i].id
        });
      }
    }

    //alert.addButton('Cancel');
    alert.addButton({
      text: 'Retry',
      handler: data => {
        this.scanRing();
      }
    });
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.userData.connectRing(data);
      }
    });

    alert.present();
  }

  onDeviceDiscovered(device) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.ngZone.run(() => {
      this.devices.push(device);
    });
  }

  scanError(error) {
    this.setStatus('Error ' + error);
    let toast = this.toastCtrl.create({
      message: 'Error scanning for Bluetooth low energy devices',
      position: 'middle',
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  listenToRingEvent(){

    this.userdata.getDeviceNumber().then(
      (value) => {
        // this.platformReady(value);
        let time = 5;
        let strs : string[] = ['fff0'];
        this.ble.scan(strs, time).subscribe(
          device => {
            if(device.id == value){
              this.deviceSelected(device.id);

            }else{
              time = 5;
            }
          },
          error => this.scanError(error)
        );
        setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');

      }
    ).catch(
      () => console.log('error')
    );

  }
  deviceSelected(id){
    console.log("Success get device");
    this.ble.connect(id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => console.log("disconnect")
    );
  }
  onConnected(id){
    console.log("Success connect");
    this.ble.startNotification(id, 'fff0' , 'fff7').subscribe(
      buffer => {
        var data = new Uint8Array(buffer);
        this.ngZone.run(() => {
          console.log(data);
          if(data[0]==0x07 && data[1]==0x00){
            var step_high, step_pre, step_aft;
            var temp = data[7];
            step_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
            temp = data[8];
            step_aft = temp;
            temp = data[6];
            step_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
            let step = step_pre + step_aft + step_high;
            console.log("Success:"+"step="+step)
            var kll_high, kll_pre, kll_aft;
            temp = data[13];
            kll_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
            temp = data[14];
            kll_aft = temp;
            temp = data[12];
            kll_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
            let buring = ((kll_pre + kll_aft + kll_high)/100).toFixed(2);
            console.log("Success:"+"buring="+buring)
          }
          if(data[0]==0x07 && data[1]==0x01){
            var path_high, path_pre, path_aft;
            var temp = data[7];
            path_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
            temp = data[8];
            path_aft = temp;
            temp = data[6];
            path_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
            let pathLength = path_pre + path_aft + path_high;
            console.log("Success:"+"length="+length)

          }
          var myDate = new Date();
          // this.data.push(data);
          var interval = myDate.getHours()*4+Math.floor((myDate.getMinutes()+1)/15)-1;

            if(data[0]==0x43 && data[1] == 0xF0){
              if(data[5]<=interval){
                console.log('Success: insert and send :'+data);

              }

          }
        });
      }
    );
  }

  listenToNote(){
    this.events.subscribe('notification:call', () => {
      this.userData.getNotiCall().then((open) => {
        this.userData.setNotiCall(!open);
        // this.userData.getDeviceNumber().then((value) => {
        //   this.bm.requestSetCall(value, !open).then((success)=>{
        //     console.log('request current ble data success');
        //     this.userData.setNotiCallBle(true);
        //   },(error)=>{
        //     console.log('request current ble data fail '+"-- "+error);
        //     this.userData.setNotiCallBle(false);
        //   });
        // });
      });


    });

    this.events.subscribe('notification:qq', () => {
      this.userData.getNotiQQ().then((open) => {
        this.userData.setNotiQQ(!open);
      //   this.userData.getDeviceNumber().then((value) => {
      //     this.bm.requestSetQQ(value, !open).then((success)=>{
      //       console.log('request current ble data success');
      //       this.userData.setNotiQQBle(true);
      //     },(error)=>{
      //       console.log('request current ble data fail '+"-- "+error);
      //       this.userData.setNotiQQBle(false);
      //     });
      //   });
      });
    });

    this.events.subscribe('notification:wechat', () => {
      this.userData.getNotiWeChat().then((open) => {
        this.userData.setNotiWeChat(!open);
      //   this.userData.getDeviceNumber().then((value) => {
      //     this.bm.requestSetWechat(value, !open).then((success)=>{
      //       console.log('request current ble data success');
      //       this.userData.setNotiWeChatBle(true);
      //     },(error)=>{
      //       console.log('request current ble data fail '+"-- "+error);
      //       this.userData.setNotiWeChatBle(false);
      //     });
      //   });
      });
    });
  }
}
