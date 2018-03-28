import { Component } from '@angular/core';

import { AlertController, NavController, Events } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { PopoverController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { HTTP } from '@ionic-native/http';
import { UserOptions } from '../../interfaces/user-options';
@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  username: string;
  picPath = "http://www.gravatar.com/avatar?d=mm&s=140";
  gender: string = 'f';
  school: string = '无';
  schools: string[] = ['清华大学','清华大学附属中学'];
  secSchool: string[] = ['清华大学附属中学'];
  univercity: string[] = ['清华大学'];
  grade: string = '无';
  grades: string[] = ['初一','初二','初三','初四','高一','高二','高三','大一','大二','大三','大四','研一','研二','研三','博一','博二','博三','博四','博五'];
  secGrades: string[] = ['初一','初二','初三','初四','高一','高二','高三'];
  uniGrades: string[] = ['大一','大二','大三','大四','研一','研二','研三','博一','博二','博三','博四','博五'];
  ages: number[] = [];
  age: number = 20;
  height: number = 160;
  heights: number[] = [];
  weight: number = 50;
  weights: number[] = [];
  constructor(
    public alertCtrl: AlertController,
    public nav: NavController,
    public userData: UserData,
    private http: HTTP,
    private imagePicker: ImagePicker,
    public events: Events,
    public popoverCtrl: PopoverController
  ) {
    for(let i=0;i<150;i++){
      this.ages.push(i);
    }
    for(let i=0;i<250;i++){
      this.heights.push(i);
    }
    for(let i=0;i<200;i++){
      this.weights.push(i);
    }

  }
  ionViewWillEnter(){
    this.userData.getSex().then((value) => {
      if(!(value==null)){
        this.gender = value;
        console.log('gender'+this.gender);
      }
    });
    this.userData.getAge().then((value) => {
      if(!(value==null)){
        this.age = value;
      }
    });
    this.userData.getSchool().then((value) => {
      if(!(value==null)){
        this.school = value;
      }
    });
    this.userData.getGrade().then((value) => {
      if(!(value==null)){
        this.grade = value;
      }
    });
  }
  ionViewDidLoad(){
    this.userData.getUserPic().then((value) => {
      this.picPath = value;
    });
  }

  ngAfterViewInit() {
    this.getUsername();
  }

  updatePicture() {
    console.log('Clicked to update picture');
    const options = {//options表示选取的图片参数
      maximumImagesCount: 1,//一次性最多只能选5张，ios系统无效，android上面有效
      width: 500,//图片的宽度
      height: 500,//图片的高度
      quality: 50,//图片的质量0-100之间选择
      outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
    }
    var arry = []
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // arry.push("data:image/jpeg;base64," + results[i]);//处理图片的格式，用于向服务器传输
        console.log(results[i])
        this.picPath = "data:image/jpeg;base64,"+results[i];
        this.userData.setUserPic(this.picPath);
        this.events.publish('picHasChanged');
      }
    }, (err) => {
      console.log("error"+err);
    });
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

  selectSchool(){
    if(this.contains(this.secSchool,this.school)){
      this.grades = ['初一','初二','初三','初四','高一','高二','高三'];
      let html: string = "";
      for(let i=0;i<this.grades.length;i++){
        html = html + "<ion-option value="+this.grades[i]+" >"+this.grades[i]+"</ion-option>";
      }
      document.getElementById('grade').innerHTML = html;
    }else{
      this.grades = ['大一','大二','大三','大四','研一','研二','研三','博一','博二','博三','博四','博五'];
      let html: string = "";
      for(let i=0;i<this.grades.length;i++){
        html = html + "<ion-option value="+this.grades[i]+" >"+this.grades[i]+"</ion-option>";
      }
      document.getElementById('grade').innerHTML = html;
    }
  }

  contains(array: string[], ele: string): boolean{
    for(let i = 0; i<array.length; i++){
      if(ele == array[i]){
        return true;
      }
    }
    return false;
  }

  ionViewWillLeave(){
    this.userData.setSchool(this.school);
    this.userData.setGrade(this.grade);
    this.userData.setSex(this.gender);
    this.userData.setAge(this.age);
    this.userData.setHeight(this.height);
    this.userData.setWeight(this.weight);
  }

}
