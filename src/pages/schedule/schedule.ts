import { Component, ViewChild , NgZone} from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Events, AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { RankPage } from '../rank/rank';
import { TargetPage } from '../target/target';
import { SessionDetailPage } from '../session-detail/session-detail';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { databaseManager } from '../../providers/databaseManager';
import { bleManager } from '../../providers/bleManager';
import { Storage } from '@ionic/storage';
import { httpManager } from '../../providers/httpManager';
import { dataClass} from '../../entity/dataClass';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
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
  groups: any = [];
  confDate: string;
  step = 0;
  steps: any = [];
  targets: any = [];
  target: number;
  sleep = '0.4';
  mood = '0.55';
  pathLength = 0;
  buring :string = '0';
  devices : any[] = [];
  statusMessage: string;
  peripheral: any = {};
  bleDatas: Uint8Array[] = [];
  data: any[] = [];
  id: string;
  scanCount: any;
  finish : boolean = false;
  finish2 : boolean = false;
  keepUpdate: boolean = false;
  sendCount = 0;
  loopCount: number = 0;

  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public confData: ConferenceData,
    private ngZone: NgZone,
    public events: Events,
    public user: UserData,
    public storage: Storage,
    private db:databaseManager,
    private bm:bleManager,
    public userdata: UserData,
    private ble:BLE,
    private hm: httpManager,
    private iab: InAppBrowser
    // private themeableBrowser: ThemeableBrowser
  ) {

  }
  ionViewWillEnter(){
    this.db.databaseInit();
    console.log('进入了 首 页面');
    this.userdata.getSleepData().then((value) => {
      if(!(value==null)){
        this.sleep = ((+value)/60000).toFixed(2).toString();
      }
    });
    this.userdata.getMoodScore().then((value) => {
      if(!(value==null)){
        this.mood = value;
      }
    });
  }
  ionViewDidLoad() {
    for(let i=0; i<36; i++){
      this.targets.push(0);
    }
    this.target = 5000;
    this.userdata.getStepTarget().then((value) => {
      this.target = value;
    });
    var myDate = new Date();
    var lastdate : Date;

    this.userdata.getLastUpdateTime().then((value) => {
      console.log(value);
      lastdate = new Date(value);
      var lastDateDay = Math.floor(lastdate.getTime()/(1000*60*60*24));
      var myDateDay = Math.floor(myDate.getTime()/(1000*60*60*24));
      if( lastDateDay == myDateDay ){
        this.userdata.getLastStepShow().then((value) => {
          this.step = value;
        })
      }
      var interval = Math.floor((myDate.getTime() - lastdate.getTime())/(1000*60));
      if(interval > 0){
        this.userdata.setUpdateTime(myDate);
        this.dataUpdate();
      }
    })

    this.app.setTitle('首页');

  }

  dataUpdate(){
    this.storage.get('hasConnectRing')
      .then((hasConnectRing) => {
        if (hasConnectRing) {
          this.ble.isEnabled().then(
          ).catch(
            () => {
                    alert('Please open your bluetooth');
                    this.ble.showBluetoothSettings().then().catch(
                      () => console.log('error')
                    );
                    this.loopJudgeBleOpen();
                  }
          );
          // this.loop();
          let loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
          loader.present();
          setTimeout(() => {
            this.scanCount = 25;
            this.userdata.getDeviceNumber().then(
              (value) => {
                this.id = value;
                // alert(this.id);
                let time = 5;
                let strs : string[] = ['fff0'];
                this.ble.scan(strs, time).subscribe(
                  device => {
                    if(device.id == this.id){
                      this.deviceSelected(device.id);
                    }else{
                      time = 5;
                    }
                  },
                  error => this.scanError(error)
                );
                setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
                setTimeout(() => {
                  this.ble.isConnected(value).then((value) => {

                  }).catch((value) => {
                    this.events.publish('transfarOver');
                  //   let toast = this.toastCtrl.create({
                  //     message: '连接手环失败',
                  //     duration: 500
                  //   });
                  //   toast.present();
                  });
                  loader.dismiss();
                }, 5000);
                // this.loopConnect(value);
              }
            ).catch(
              () => console.log('error')
            );
          }, 10);

          this.events.subscribe('transfarOver', () => {
            setTimeout(() => {
              loader.dismiss();
              console.log('Finished');
            },200);
          });

        } else {
          this.connectToRing();
        }
      });
  }

  loopJudgeBleOpen(){
    console.log('looping...');
    setTimeout(() => {
      this.ble.isEnabled().then(()=>{
        let loader = this.loadingCtrl.create({
          content: "Please wait..."
        });
        loader.present();
        setTimeout(() => {
          this.scanCount = 25;
          this.userdata.getDeviceNumber().then(
            (value) => {
              this.id = value;
              // alert(this.id);
              let time = 5;
              let strs : string[] = ['fff0'];
              this.ble.scan(strs, time).subscribe(
                device => {
                  if(device.id == this.id){
                    this.deviceSelected(device.id);
                  }else{
                    time = 5;
                  }
                },
                error => this.scanError(error)
              );
              setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
              setTimeout(() => {
                this.ble.isConnected(value).then((value) => {

                }).catch((value) => {
                  this.events.publish('transfarOver');
                //   let toast = this.toastCtrl.create({
                //     message: '连接手环失败',
                //     duration: 500
                //   });
                //   toast.present();
                });
                loader.dismiss();
              }, 5000);
              // this.loopConnect(value);
            }
          ).catch(
            () => console.log('error')
          );
        }, 10);

        this.events.subscribe('transfarOver', () => {
          setTimeout(() => {
            loader.dismiss();
            console.log('Finished');
          },200);
        });
      }).catch(() => {
        this.loopCount++;
        if(this.loopCount<10){
          this.loopJudgeBleOpen();
        }else{
          alert("蓝牙连接操作超时，请打开蓝牙后再下拉刷新页面");
        }
      });
    }, 1000);

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
        this.userdata.connectRing(data);
        this.deviceSelected(data);
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

  deviceSelected(id) {
    this.ble.connect(id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral,id)
    );
  }

  onConnected(peripheral) {
    console.log('Connect success');
      this.peripheral = peripheral;
      let judge : boolean = false;
      this.ble.startNotification(peripheral.id, 'fff0' , 'fff7').subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          this.ngZone.run(() => {
            // console.log(data);
            if(data[0]==0x07 && data[1]==0x00){
              var step_high, step_pre, step_aft;
              var temp = data[7];
              step_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
              temp = data[8];
              step_aft = temp;
              temp = data[6];
              step_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
              this.step = step_pre + step_aft + step_high;
              this.userdata.setStepShow(this.step);
              this.finish2 = true;
              for(let i=0; i<this.step/this.target*37;i++){
                this.steps.push(1);
              }
              var kll_high, kll_pre, kll_aft;
              temp = data[13];
              kll_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
              temp = data[14];
              kll_aft = temp;
              temp = data[12];
              kll_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
              this.buring = ((kll_pre + kll_aft + kll_high)/100).toFixed(2);
              if(judge){
                let html:string ="<div id=\"step\">";
                html = html + this.step+"步</div><div class=\"ring\">";
                for(let i=0; i<this.steps.length;i++){
                  html = html + "<div class=\"piece\"></div>";
                }
                for(let i=0; i<this.targets.length;i++){
                  html = html + "<div class=\"background\></div>";
                }
                html = html + "</div><div id=\"sleep\"><p>睡眠指数</p><p>" + this.sleep + "</p></div><div id=\"mood\"><p>心情指数</p><p>"+this.mood+"</p></div><div id=\"info\"><p>"+(this.pathLength/100).toFixed(2)+"km</p><p>"+this.buring+"卡路里</p></div>" ;
                document.getElementById('top').innerHTML = html;
                this.finish = true;
                this.userdata.getUsername().then(
                  userName =>{
                    this.hm.sendRunToServer(userName,+this.step);
                });
                // document.getElementById('top').innerHTML = "<div id=\"step\">{{ step }}步</div><div class=\"ring\"><div class=\"piece\" *ngFor=\"let i of steps\"></div><div class=\"background\" *ngFor=\"let i of targets\"></div></div><div id=\"sleep\"><p>睡眠指数</p><p>{{ sleep }}</p></div><div id=\"mood\"><p>心情指数</p><p>{{ mood }}</p></div><div id=\"info\"><p>{{ pathLength }}km</p><p>{{ buring }}卡路里</p></div>";
              }
            }
            if(data[0]==0x07 && data[1]==0x01){
              var path_high, path_pre, path_aft;
              var temp = data[7];
              path_pre = Math.floor(temp/16)*16*16*16+temp%16*16*16;
              temp = data[8];
              path_aft = temp;
              temp = data[6];
              path_high = Math.floor(temp/16)*16*16*16*16*16+temp%16*16*16*16*16;
              this.pathLength = path_pre + path_aft + path_high;

              if(this.finish2){
                let html:string ="<div id=\"step\">";
                html = html + this.step+"步</div><div class=\"ring\">";
                for(let i=0; i<this.steps.length;i++){
                  html = html + "<div class=\"piece\"></div>";
                }
                for(let i=0; i<this.targets.length;i++){
                  html = html + "<div class=\"background\"></div>";
                }
                html = html + "</div><div id=\"sleep\"><p>睡眠指数</p><p>" + this.sleep + "</p></div><div id=\"mood\"><p>心情指数</p><p>"+this.mood+"</p></div><div id=\"info\"><p>"+(this.pathLength/100).toFixed(2)+"km</p><p>"+this.buring+"卡路里</p></div>" ;
                document.getElementById('top').innerHTML = html;
                this.finish = true;
                this.userdata.getUsername().then(
                  userName =>{
                    this.hm.sendRunToServer(userName,+this.step);
                });

              }else{
                judge = true;
              }
            }
            var myDate = new Date();
            // this.data.push(data);
            var interval = (myDate.getHours()+1)*4+Math.floor((myDate.getMinutes()+1)/15)-1;
            var dateYear = myDate.getFullYear()%10+Math.floor(myDate.getFullYear()%100/10)*16;
            var dateMonth = (myDate.getMonth()+1)%10+Math.floor((myDate.getMonth()+1)%100/10)*16;
            var dateDay = myDate.getDate()%10+Math.floor(myDate.getDate()%100/10)*16;
            // console.log(dateYear+'-'+dateMonth+'-'+dateDay);
            if(data[0]==0x43 && data[1] == 0xF0){
              if(data[10]>20){
                console.log(data);
              }
              this.sendCount += 1;
              if(data[2] == dateYear && data[3] == dateMonth && data[4] == dateDay){
                if(data[5]<=interval){
                  // console.log('insert and send today:'+data);
                  this.hm.sendBleToServer(data);
                  let dc = new dataClass();
                  let d : any[] = [];
                  for(let i=2;i<15;i++){
                    if(i == 2 || i == 3 || i == 4){
                      let temp = Math.floor(data[i]/16)*10 + data[i]%16;
                      d.push(temp);
                    }else{
                      if(i == 8 || i == 10 || i == 12 || i == 14){
                        if(data[i]>0x20 && data[6] == 0x00){
                          d.push(0);
                        }else{
                          d.push(data[i]);
                        }
                      }else{
                        d.push(data[i]);
                      }
                    }
                  }
                  dc.setId(d[3]+d[2]*100+d[1]*10000+d[0]*1000000);
                  dc.setData(d);
                  console.log(dc);
                  this.db.insert(dc).then(
                    (result)=>{
                      console.log(result);
                    },(err)=>{
                      console.log(err);
                  });
                }
              }else{
                // console.log('insert and send before:'+data);
                this.hm.sendBleToServer(data);
                let dc = new dataClass();
                let d : any[] = [];
                for(let i=2;i<15;i++){
                  if(i == 2 || i == 3 || i == 4){
                    let temp = Math.floor(data[i]/16)*10 + data[i]%16;
                    d.push(temp);
                  }else{
                    if(i == 8 || i == 10 || i == 12 || i == 14){
                      if(data[i]>0x20 && data[6] == 0x00){
                        d.push(0);
                      }else{
                        d.push(data[i]);
                      }
                    }else{
                      d.push(data[i]);
                    }
                  }
                }
                dc.setId(d[3]+d[2]*100+d[1]*10000+d[0]*1000000);
                dc.setData(d);
                this.db.insert(dc).then(
                  (result)=>{
                    console.log(result);
                  },(err)=>{
                    console.log(err);
                });
              }
              if(this.sendCount == 96){
                var month = String(Math.floor(data[3]/16)*10 + data[3]%16);
                // if(data[3]<10){
                //   month = month.substring(1, 2);
                // }
                // console.log('finish'+month+'-'+String(Math.floor(data[4]/16)*10 + data[4]%16));
                this.sendCount = 0;
                this.events.publish('finish'+month+'-'+String(Math.floor(data[4]/16)*10 + data[4]%16));
              }

            }
          });
        }
      );

      this.bm.requestCurSport(this.peripheral.id).then((success)=>{
        console.log('request current ble data success');
      },(error)=>{
        console.log('request current ble data fail '+"-- "+error);
      });
      this.bm.writeCurTime(this.peripheral.id).then((success)=>{
        console.log('write ble time success');
      },(error)=>{
        console.log('write ble time fail '+"-- "+error);
      });
      this.userdata.getNoti().then((value) => {
        if(!value){
          this.userdata.getNotiCall().then((call) => {
            this.userdata.getNotiWeChat().then((wechat) => {
              this.userdata.getNotiQQ().then((qq) => {
                this.bm.requestSetNoti(this.peripheral.id, call, wechat, qq).then((success)=>{
                  console.log('set noti success');
                  this.userdata.setNoti(true);
                },(error)=>{
                  console.log('set noti fail '+"-- "+error);
                  this.userdata.setNoti(false);
                });
              });
            });
          });

        }
      });
      var process = 0;
      this.db.queryDataFull(0).then((value) => {
        if(value == 0){
          process = 1;
          console.log('request today');
          this.bm.requestSport(this.peripheral.id, Math.abs(0)).then((success)=>{
            console.log('request ble data success'+'  '+0);
          },(error)=>{
            console.log('request ble data fail '+"-- "+error);
          });
        }else{
          this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*0)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*0)).getDate());
        }
      });
      console.log('listen to :'+'finish'+((new Date(new Date().getTime() - 86400000*0)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*0)).getDate());
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*0)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*0)).getDate()), () => {
        this.db.queryDataFull(-1).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(1)).then((success)=>{
              console.log('request ble data success'+'  '+1);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*1)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*1)).getDate());
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 14000);
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*1)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*1)).getDate()), () => {
        this.db.queryDataFull(-2).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(2)).then((success)=>{
              console.log('request ble data success'+'  '+2);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*2)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*2)).getDate());
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 17000);
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*2)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*2)).getDate()), () => {
        this.db.queryDataFull(-3).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(3)).then((success)=>{
              console.log('request ble data success'+'  '+3);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*3)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*3)).getDate());
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 20000);
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*3)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*3)).getDate()), () => {
        this.db.queryDataFull(-4).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(4)).then((success)=>{
              console.log('request ble data success'+'  '+4);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*4)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*4)).getDate());
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 23000);
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*4)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*4)).getDate()), () => {
        this.db.queryDataFull(-5).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(5)).then((success)=>{
              console.log('request ble data success'+'  '+5);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('finish'+((new Date(new Date().getTime() - 86400000*5)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*5)).getDate());
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 26000);
      this.events.subscribe(('finish'+((new Date(new Date().getTime() - 86400000*5)).getMonth()+1)+'-'+(new Date(new Date().getTime() - 86400000*5)).getDate()), () => {
        this.db.queryDataFull(-6).then((value) => {
          if(value == 0){
            this.bm.requestSport(this.peripheral.id, Math.abs(6)).then((success)=>{
              console.log('request ble data success'+'  '+6);
            },(error)=>{
              console.log('request ble data fail '+"-- "+error);
            });
          }else{
            this.events.publish('transfarOver');
          }
        });
      });
      // setTimeout(() => {
      //
      // }, 29000);
      // for(let i = -6;i<1;i++){
        // this.db.queryDataFull(i).then((value) => {
        //   if(value == 0){
        //     setTimeout(() => {
        //       this.bm.requestSport(this.peripheral.id, Math.abs(i)).then((success)=>{
        //         console.log('request ble data success'+'  '+i);
        //       },(error)=>{
        //         console.log('request ble data fail '+"-- "+error);
        //       });
        //     }, 5000);
        //   }
        // });
      // }

  }



  onDeviceDisconnected(peripheral,id) {
    if(this.scanCount>=0){
      this.scanCount--;
      this.ble.connect(id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral,id)
      );
    }else{
      let alert = this.alertCtrl.create({
        title: '无法找到手环！',
        message: '您可以选择尝试重新连接手环或者放弃本次连接',
        buttons: [
          {
            text: '重试',
            handler: () => {
              console.log('re-connect');
              this.scanCount = 5;
              this.ble.connect(id).subscribe(
                peripheral => this.onConnected(peripheral),
                peripheral => this.onDeviceDisconnected(peripheral,id)
              );
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

  wowowo(){
    this.db.query();
  }

  jumpToRank(){
    this.navCtrl.push(RankPage)
  }
  jumpToTarget(){
    this.navCtrl.push(TargetPage)
  }
  xyx(){
    var browser = this.iab.create('https://ionicframework.com/');
    browser.show();
  }
  hxh(){
    var browser = this.iab.create('https://ionicframework.com/');
    browser.show();
  }
  cmh(){
    var browser = this.iab.create('https://ionicframework.com/');
    browser.show();
  }

  doRefresh(refresher: Refresher) {
    console.log('Begin refresh operation', refresher);

    setTimeout(() => {
      let judge: boolean = false;
      this.events.subscribe('transfarOver', () => {
        setTimeout(() => {
          refresher.complete();
          judge = true;
          console.log('Finished');
        },200);
      });
      this.dataUpdate();
      setTimeout(() => {
        if(!judge){
          alert('刷新失败');
        }
        refresher.complete();
      }, 5000);
    }, 2000);
  }
}
