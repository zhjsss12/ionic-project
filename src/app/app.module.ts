import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { BLE } from '@ionic-native/ble';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';
import { AppVersion } from '@ionic-native/app-version';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { AboutPage } from '../pages/about/about';
import { PopoverPage } from '../pages/about-popover/about-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { RankPage } from '../pages/rank/rank';
import { SchedulePage } from '../pages/schedule/schedule';
import { ScheduleFilterPage } from '../pages/schedule-filter/schedule-filter';
import { SessionDetailPage } from '../pages/session-detail/session-detail';
import { SignupPage } from '../pages/signup/signup';
import { SpeakerDetailPage } from '../pages/speaker-detail/speaker-detail';
import { SpeakerListPage } from '../pages/speaker-list/speaker-list';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { PlanPage } from '../pages/plan/plan';
import { TargetPage } from '../pages/target/target';
import { SleepPage } from '../pages/sleep/sleep';
import { RunPage } from '../pages/run/run';
import { MoodPage } from '../pages/mood/mood';
import { NotificationPage } from '../pages/notification/notification';
import { GroupCreatePage } from '../pages/group-create/group-create';
import { GroupListPage } from '../pages/group-list/group-list';
import { SuggestionPage } from '../pages/suggestion/suggestion';
import { NativeService } from './../providers/NativeService';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';
import { databaseManager } from '../providers/databaseManager';
import { bleManager } from '../providers/bleManager';
import { httpManager } from '../providers/httpManager';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ImagePicker } from '@ionic-native/image-picker';
import {Keyboard} from '@ionic-native/keyboard';
@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    PlanPage,
    NotificationPage,
    SleepPage,
    MoodPage,
    RunPage,
    RankPage,
    TargetPage,
    GroupCreatePage,
    GroupListPage,
    SuggestionPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: SchedulePage, name: 'Schedule', segment: 'schedule' },
        { component: SessionDetailPage, name: 'SessionDetail', segment: 'sessionDetail/:sessionId' },
        { component: ScheduleFilterPage, name: 'ScheduleFilter', segment: 'scheduleFilter' },
        { component: SpeakerListPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: SpeakerDetailPage, name: 'SpeakerDetail', segment: 'speakerDetail/:speakerId' },
        { component: MapPage, name: 'Map', segment: 'map' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: HelloIonicPage, name: 'HelloIonicPage', segment: 'hello-ionic' },
        { component: PlanPage, name: 'PlanPage', segment: 'plan' },
        { component: NotificationPage, name: 'NotificationPage', segment: 'notification' },
        { component: SleepPage, name: 'SleepPage', segment: 'sleep' },
        { component: MoodPage, name: 'MoodPage', segment: 'mood' },
        { component: RunPage, name: 'RunPage', segment: 'run' },
        { component: RankPage, name: 'RankPage', segment: 'rank' },
        { component: TargetPage, name: 'TargetPage', segment: 'target'},
        { component: GroupListPage, name: 'GroupListPage', segment: 'group-list'},
        { component: SuggestionPage, name: 'SuggestionPage', segment: 'suggestion'}
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    AboutPage,
    AccountPage,
    LoginPage,
    MapPage,
    PopoverPage,
    SchedulePage,
    ScheduleFilterPage,
    SessionDetailPage,
    SignupPage,
    SpeakerDetailPage,
    SpeakerListPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    PlanPage,
    NotificationPage,
    SleepPage,
    MoodPage,
    RunPage,
    RankPage,
    TargetPage,
    GroupCreatePage,
    GroupListPage,
    SuggestionPage
  ],
  providers: [
    StatusBar,
    HTTP,
    SplashScreen,
    BluetoothSerial,
    ConferenceData,
    UserData,
    InAppBrowser,
    BLE,
    File,
    SQLite,
    NativeService,
    databaseManager,
    bleManager,
    httpManager,
    ImagePicker,
    AppVersion,
    FileTransfer, FileTransferObject,
    FileOpener,
    // ThemeableBrowser,
    // ThemeableBrowserObject,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Keyboard,
  ]
})
export class AppModule {}
