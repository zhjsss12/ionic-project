import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController, NavController } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { SignInUser } from '../../entity/signInUser';
import { Storage } from '@ionic/storage';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-hello',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(public storage: Storage,  public userdata: UserData) {

  }
  ionViewDidEnter() {
    this.userdata.disconnectRing();
  }
}
