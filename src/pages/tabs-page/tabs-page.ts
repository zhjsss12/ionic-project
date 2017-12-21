import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { ToastController, NavParams, AlertController } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { databaseManager } from '../../providers/databaseManager';
import { bleManager } from '../../providers/bleManager';
import { httpManager } from '../../providers/httpManager';
import { dataClass} from '../../entity/dataClass';
import { SleepPage } from '../sleep/sleep';
import { RunPage } from '../run/run';
import { MoodPage } from '../mood/mood';
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
  tab2Root: any = RunPage;
  tab3Root: any = SleepPage;
  tab4Root: any = MoodPage;
  mySelectedIndex: number;
  devices : any[] = [];
  statusMessage: string;
  peripheral: any = {};
  bleDatas: Uint8Array[] = [];
  data: any[] = [];
  id: string;
  scanCount: any;

  constructor(navParams: NavParams, private ble: BLE, private toastCtrl: ToastController,
    private ngZone: NgZone, private alertCtrl: AlertController, public storage: Storage,
    public userdata: UserData, private db: databaseManager,
    private bm: bleManager, private hm: httpManager) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  ionViewDidEnter() {

  }



}
