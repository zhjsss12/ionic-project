import { Component } from '@angular/core';

import { AlertController, NavController, Events } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { PopoverController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { HTTP } from '@ionic-native/http';
import { UserOptions } from '../../interfaces/user-options';
import { httpManager } from '../../providers/httpManager';
@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html'
})
export class SuggestionPage {
  location: string = '无';
  locations: string[] = ['不确定','首页','运动页','睡眠页','心情页','个人信息','个人计划','通知提醒','社区','登录页','注册页','目标页','排行页'];
  description: string = '';
  constructor(
    public alertCtrl: AlertController,
    public nav: NavController,
    public userData: UserData,
    private http: HTTP,
    private imagePicker: ImagePicker,
    public events: Events,
    public popoverCtrl: PopoverController,
    private hm: httpManager
  ) {
  }

  submit(){
    this.hm.sendSuggestionToServer(this.location, this.description);
  }
}
