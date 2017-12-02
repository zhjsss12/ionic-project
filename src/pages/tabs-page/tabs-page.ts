import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController, NavParams, AlertController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { SchedulePage } from '../schedule/schedule';
import { SpeakerListPage } from '../speaker-list/speaker-list';
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/user-data';
import { HTTP } from '@ionic-native/http';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = SchedulePage;
  tab2Root: any = SpeakerListPage;
  tab3Root: any = MapPage;
  tab4Root: any = AboutPage;
  mySelectedIndex: number;
  devices : any[] = [];
  statusMessage: string;
  peripheral: any = {};
  bleDatas: Uint8Array[] = [];
  data: any[] = [];
  id: any = {};

  constructor(navParams: NavParams, private ble: BLE, private toastCtrl: ToastController,
    private ngZone: NgZone, private alertCtrl: AlertController, public storage: Storage,
    public userdata: UserData, private http: HTTP) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidEnter() {
    //this.writeBleDateRequest();
    this.userdata.disconnectRing();
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
                  }
          );
          let id = this.userdata.getDeviceNumber();

          for(let i = 0; i < this.bleDatas.length; i++) {
            this.id = i;
            this.deviceSelected(id);
            //解析this.data
            /**
            *
            */
          }

        } else {
          this.connectToRing();
        }
      });
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
    this.ble.scan([], 5).subscribe(
      device => this.onDeviceDiscovered(device),
      error => this.scanError(error)
    );
    setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    alert(this.devices);
    this.showRadio(this.devices);
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

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
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
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    console.log('Connect success');
    this.userdata.connectRing(peripheral.id);
      this.peripheral = peripheral;
      this.ble.startNotification(peripheral.id, 'fff0' , 'fff7').subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          this.ngZone.run(() => {
            console.log(data);
            this.data.push(data);
            this.sendToServer(data);
            //alert('OK');
          });


        }
      );

      this.sendRequset(this.id, peripheral);
  }

  sendRequset(id: any, peripheral) {
    //let value = this.bleDatas[id];
    this.ble.write(peripheral.id, 'fff0' , 'fff6', this.stringToBytes()).then(
      responseData => {
        //console.log('Response:'+responseData);
        //alert('OK');
      }
    ).catch(
      error => {
        console.log('ERROR:'+error);
        alert('Error: '+error);
      }

    );
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  writeBleDateRequest() {
    var array = new Uint8Array(16);
    array[0] = 0x43;
    array[1] = 0x00;
    array[2] = 0x00;
    array[3] = 0x00;
    array[4] = 0x00;
    array[5] = 0x00;
    array[6] = 0x00;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    array[15] = 0x43;
    this.bleDatas.push(array);
  }
  stringToBytes() {
    //[0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]
    var array = new Uint8Array(16);
    array[0] = 0x43;
    array[1] = 0x00;
    array[2] = 0x00;
    array[3] = 0x00;
    array[4] = 0x00;
    array[5] = 0x00;
    array[6] = 0x00;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    array[15] = 0x43;

    return array.buffer;
  }

  sendToServer(data){
    this.http.post('http://120.26.131.179:80/test', {data}, {}).then(data => {
      alert(data.status);
      alert(data.data);
    }).catch(error => {

      alert(error.status);
      alert(error.error); // error message as string

    });
  }
}
