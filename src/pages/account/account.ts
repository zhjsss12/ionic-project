import { Component } from '@angular/core';

import { AlertController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';
import { HTTP } from '@ionic-native/http';
import { UserOptions } from '../../interfaces/user-options';
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;

  constructor(public alertCtrl: AlertController, public nav: NavController, public userData: UserData, private http: HTTP) {

  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
  }

  // Present an alert with the current username populated
  // clicking OK will update the username and display it
  // clicking Cancel will close the alert and do nothing
  changeUsername() {
    let alert = this.alertCtrl.create({
      title: 'Change Username',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      name: 'username',
      value: this.username,
      placeholder: 'username'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        this.userData.setUsername(data.username);
        this.getUsername();
      }
    });

    alert.present();
  }

  getUsername() {
    this.userData.getUsername().then((username) => {
      this.username = username;
    });
  }

  changePassword() {
    console.log('Clicked to change password');
    let alert = this.alertCtrl.create({
      title: 'Change Password',
      buttons: [
        'Cancel'
      ]
    });
    alert.addInput({
      label: '请输入原密码',
      name: 'oldPassword'
    });
    alert.addInput({
      label: '请输入新密码',
      name: 'newPassword'
    });
    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        var login: UserOptions = { op: '1', name: this.username, password: data.oldPassword };
        this.http.post('http://120.26.131.179:80/login', {login}, {}).then(data => {
  	       if(data.data != '2'){
  		         //不成功
  	       }
  	    }).catch(error => {
            console.log(error);
        });
      }
    });

    alert.present();
  }

  logout() {
    this.userData.logout();
    this.nav.setRoot('LoginPage');
  }

}
