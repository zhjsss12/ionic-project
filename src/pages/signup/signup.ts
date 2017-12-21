import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MenuController, NavController } from 'ionic-angular';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';

import { TabsPage } from '../tabs-page/tabs-page';

import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-user',
  templateUrl: 'signup.html'
})
export class SignupPage {
  signup: UserOptions = { op: '2', name: '', password: '' };
  submitted = false;

  constructor(public navCtrl: NavController, public userData: UserData, private http: HTTP, public menu: MenuController) {}

  onSignup(form: NgForm) {
    this.submitted = true;
    let body = this.signup;
    if (form.valid) {
      this.http.post('http://120.26.131.179:80/login', {body}, {}).then(data => {

      alert(data.status);
      alert(data.data); // data received by server
      //alert(data.headers);
	  if(data.data == '2'){
      this.userData.signup(this.signup.name);
      this.navCtrl.setRoot(TabsPage);
	  }else{
        this.signup.name = '';
        this.signup.password = '';
		    alert("Name Exist!");
	  }
    })
    .catch(error => {

      alert(error.status);
      alert(error.error); // error message as string
      alert(error.headers);

    });

    }
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
