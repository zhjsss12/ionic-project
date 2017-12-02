import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController, NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { SignInUser } from '../../entity/signInUser';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(private ble: BLE, public toastCtrl: ToastController, private ngZone: NgZone,
    private navController: NavController, private http: HTTP) {

  }
  devices : any[] = [];
  statusMessage: string;
  peripheral: any = {};
  user : SignInUser = {
    name : null ,
    password : null
  };
  

  connectToRing() {
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

  deviceSelected(device) {
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    console.log('Connect success');

      this.peripheral = peripheral;
      this.ble.startNotification(peripheral.id, 'fff0' , 'fff7').subscribe(
        buffer => {
          var data = new Uint8Array(buffer);
          this.ngZone.run(() => {
            console.log(data);
            alert(data);
          });


        }
      );

      //let value = this.stringToBytes();
      let value = new Uint8Array([0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]);
      this.ble.write(peripheral.id, 'fff0' , 'fff6', value.buffer).then(
        responseData => {
          console.log('Response:'+responseData);
          alert('Response:'+ responseData);
        }
      ).catch(
        error => {
          console.log('ERROR:'+error);
          alert('Error: '+error);
        }

      );

/*
        this.ble.read(peripheral.id, 'fff0' , 'fff6').then(
          buffer => {
            alert('Buffer: '+buffer);
            var data = new Uint8Array(buffer);
            this.ngZone.run(() => {
              console.log(data);
              alert(data);
            });
          }
        ).catch(
          error => {
            console.log('ERROR:'+error);
            alert('ERROR:'+error);
          }
        );
*/


  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  stringToBytes() {
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
}
