import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MenuController, NavController, Nav } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';
import { SignupPage } from '../signup/signup';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-user',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: UserOptions = { op: '1', name: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData, private http: HTTP,  public menu: MenuController, public nav:Nav) { }

  onLogin(form: NgForm) {
    this.submitted = true;
    let body = this.login;
    if (form.valid) {
      this.http.post('http://120.26.131.179:80/login', {body}, {}).then(data => {

      // alert(data.status);
      // alert(data.data); // data received by server
      //alert(data.headers);
	  if(data.data == '2'){
		    this.userData.login(this.login.name);
		    // this.navCtrl.push(TabsPage);
        this.nav.setRoot(TabsPage);
	  }else{
        if(data.data == '0') {
            this.login.name = '';
            this.login.password = '';
		        alert("Name Error!");
        }else{
          this.login.password == '';
            alert("Password Error!");
        }
	  }
    })
    .catch(error => {

      // alert(error.status);
      // alert(error.error); // error message as string
      // alert(error.headers);

    });

    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  // ionViewDidLeave() {
  //   // enable the root left menu when leaving the tutorial page
  //   this.menu.enable(true);
  // }
}
