import { Component } from '@angular/core';
import { AlertController,IonicPage, NavController, NavParams, Refresher, Events } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { ImagePicker } from '@ionic-native/image-picker';
import { Note } from '../../entity/Note';
import { httpManager } from '../../providers/httpManager';
/**
 * Generated class for the MoodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mood',
  templateUrl: 'mood.html',
})
export class MoodPage {
  moodScore :string ="0.6";
  picPath = "http://www.gravatar.com/avatar?d=mm&s=140";
  sentence = '说点啥吧';
  notes: Note[] = [];
  isHistory: string = "new";
  pic :string = "0";//这个用来暂时记录图片的字符串
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public user: UserData,
              private imagePicker: ImagePicker,
              public navParams: NavParams,
              public events: Events,
              private hm: httpManager) {
  }

  ionViewDidLoad() {
    // this.user.getUsername().then(
    //   userName =>{
    //     this.hm.sendMoodToServer(userName,+this.moodScore);
    //   });
    // this.user.setMoodScore(+this.moodScore);
    console.log('ionViewDidLoad MoodPage');
    // this.events.publish('moodChanged');
    let number = 0;
    this.user.getPicNumber().then((value) => {
      if(!(value==null)){
        number = value;
        console.log('number: '+ number);
        for(let i=0;i<number;i++){
          let note = new Note();
          this.user.getMoodPic(i).then((value) => {
            note.pic = value;
            console.log('picUrl: '+value+'  ||  number: '+i);
            this.user.getMoodSentence(i).then((content) => {
              note.sent = content;
              this.notes.push(note);
              console.log('sent: '+content+'  ||  number: '+i);
            })
          });

        }
      }else{
        this.user.setPicNumber(0);
      }
    });

  }

  addPic() {
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
        this.pic = results[i];
        console.log(results[i]);
        this.picPath = "data:image/jpeg;base64,"+results[i];
      }
    }, (err) => {
      console.log("error"+err);
    });
  }

  OnClick(){
    this.user.getUsername().then((userName)=>{
      this.hm.sendMoodToServer(userName,this.sentence,this.pic).then((score)=>{
        this.moodScore=score.substr(0,3);
        this.user.setMoodScore(+this.moodScore);
        this.events.publish('moodChanged');
      });
    });

    this.user.getPicNumber().then((value) => {
      if(!(value==null)){
        let number: number = value + 1;
        this.user.setPicNumber(number);
        this.user.setMoodPic(this.picPath, number);
        this.user.setMoodSentence(this.sentence, number);
        console.log(this.sentence+"  ||  "+this.picPath+"  ||  "+number);
        // alert('提交成功');
        let ok = this.alertCtrl.create({
        title: '提交成功',
        buttons: [{
          text: '确定',
          }]
        });
        ok.present();
      }else{
        let number: number = 1;
        this.user.setPicNumber(number);
        this.user.setMoodPic(this.picPath, number);
        this.user.setMoodSentence(this.sentence, number);
        console.log(this.sentence+"  ||  "+this.picPath+"  ||  "+number);
        let ok = this.alertCtrl.create({
        title: '提交成功',
        buttons: [{
          text: '确定',
          }]
        });
        ok.present();
      }
    });

  }
  ionChange(){
    if(this.isHistory == 'history'){
      let number = 0;
      this.notes = [];
      this.user.getPicNumber().then((value) => {
        if(!(value==null)){
          number = value;
          for(let i=1;i<=number;i++){
            let note = new Note();
            note.id = i;
            this.user.getMoodPic(i).then((value) => {
              console.log(value)
              if(value!=null){
                console.log('!!!!')
                console.log(value)
                note.pic = value;
                this.user.getMoodSentence(i).then((content) => {
                  note.sent = content;
                  this.notes.push(note);
                  if(this.notes.length == number){
                    this.events.publish('refreshFinished');
                  }
                })
              }
              
            }).catch();

          }

        }
      });
    }
  }
  pressEvent(e, id){
    let alert = this.alertCtrl.create();
    alert.setTitle('请选择操作：');
    alert.addInput({
      type: 'radio',
      label: '删除全部历史心情',
      value: 'all',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: '删除本条心情',
      value: 'single'
    });
    alert.addButton({
      text: '取消',
      handler: data => {
      }
    });
    alert.addButton({
      text: '好的',
      handler: data => {
        if(data=='all'){
          this.user.removeAllMoodPic();
          this.notes = []
        }else{
          this.user.removeMoodPic(id);
          this.notes.splice(id-1,1)
          for(let i=1;i<=this.notes.length;i++){
            this.notes[i-1].id = i;
          }
          console.log(this.notes)
        }
      }
    });
    alert.present();
  }
  doRefresh(refresher: Refresher) {
    console.log('Begin refresh operation', refresher);
    this.events.subscribe('refreshFinished', () => {
      setTimeout(() => {
        refresher.complete();
      },200);
    });
    setTimeout(() => {
      let number = 0;
      this.notes = [];
      this.user.getPicNumber().then((value) => {
        if(!(value==null)){
          number = value;
          for(let i=1;i<=number;i++){
            let note = new Note();
            this.user.getMoodPic(i).then((value) => {
              note.pic = value;
              this.user.getMoodSentence(i).then((content) => {
                note.sent = content;
                this.notes.push(note);
                if(this.notes.length == number){
                  this.events.publish('refreshFinished');
                }
              })
            });

          }

        }
      });
      setTimeout(() => {
        refresher.complete();
      },3000);
    }, 2000);
  }
}
