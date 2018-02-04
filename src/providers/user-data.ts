import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_CONNECT_RING = 'hasConnectRing';

  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:login');
  };

  signup(username: string): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.setUsername(username);
    this.events.publish('user:signup');
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  connectRing(device: string): void {
    this.storage.set(this.HAS_CONNECT_RING, true);
    this.setDeviceNumber(device);
    this.events.publish('device:connect');
  }

  disconnectRing(): void {
    this.storage.remove(this.HAS_CONNECT_RING);
    this.storage.remove('device');
    this.events.publish('device:disconnect');
  }

  setDeviceNumber(device : string): void {
    this.storage.set('device', device);
  }

  getDeviceNumber(): Promise<string> {
    return this.storage.get('device').then((value) => {
      return value;
    });
  }

  setUsername(username: string): void {
    this.storage.set('username', username);
  }

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  }

  setUserPic(picUrl: string): void {
    this.storage.set('userPic', picUrl);
  }

  getUserPic(): Promise<string> {
    return this.storage.get('userPic').then((value) => {
      return value;
    }).catch((error) => {
      return error;
    });
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  }

  setStepTarget(step: number): void {
    this.storage.set('stepTarget', step);
  }

  setTimeTarget(time: number): void {
    this.storage.set('timeTarget', time);
  }

  setcaloriesTarget(calo: number): void {
    this.storage.set('caloTarget', calo);
  }

  setdistTarget(dist: number): void {
    this.storage.set('distTarget', dist);
  }

  getStepTarget(): Promise<number> {
    return this.storage.get('stepTarget').then((value) => {
      return value;
    });
  }

  getTimeTarget(): Promise<number> {
    return this.storage.get('timeTarget').then((value) => {
      return value;
    });
  }

  getcaloriesTarget(): Promise<number> {
    return this.storage.get('caloTarget').then((value) => {
      return value;
    });
  }

  getdistTarget(): Promise<number> {
    return this.storage.get('distTarget').then((value) => {
      return value;
    });
  }

  // checkHasSetStepTarget(): Promise<string> {
  //   return this.storage.get(this.HAS_SET_STEP_TARGET).then((value) => {
  //     return value;
  //   });
  // };

  setUpdateTime(date: Date): void {
    this.storage.set('UpdateTime', date);
  }

  getLastUpdateTime(): Promise<Date> {
    return this.storage.get('UpdateTime').then((value) => {
      return value;
    });
  }

  setStepShow(step: number): void {
    this.storage.set('StepShow', step);
  }

  getLastStepShow(): Promise<number> {
    return this.storage.get('StepShow').then((value) => {
      return value;
    });
  }

  setSleepShow(step: number): void {
    this.storage.set('SleepShow', step);
  }

  getLastSleepShow(): Promise<number> {
    return this.storage.get('SleepShow').then((value) => {
      return value;
    });
  }

  setMoodShow(step: number): void {
    this.storage.set('MoodShow', step);
  }

  getLastMoodShow(): Promise<number> {
    return this.storage.get('MoodShow').then((value) => {
      return value;
    });
  }

  // getCurStatus(): Promise<string> {
  //   return this.storage.get('username').then((name) => {
  //
  //   });
  // }

  setNotiCall(open: boolean): void {
    this.storage.set('NotiCall', open);
  }

  getNotiCall(): Promise<boolean> {
    return this.storage.get('NotiCall').then((value) => {
      return value;
    });
  }

  setNotiWeChat(open: boolean): void {
    this.storage.set('NotiWeChat', open);
  }

  getNotiWeChat(): Promise<boolean> {
    return this.storage.get('NotiWeChat').then((value) => {
      return value;
    });
  }

  setNotiQQ(open: boolean): void {
    this.storage.set('NotiQQ', open);
  }

  getNotiQQ(): Promise<boolean> {
    return this.storage.get('NotiQQ').then((value) => {
      return value;
    });
  }

  setNoti(open: boolean): void {
    this.storage.set('Noti', open);
  }

  getNoti(): Promise<boolean> {
    return this.storage.get('Noti').then((value) => {
      return value;
    });
  }


}
