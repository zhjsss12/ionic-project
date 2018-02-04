import { Component } from '@angular/core';
import { httpManager } from '../../providers/httpManager';
import { UserData } from '../../providers/user-data';
import { ImagePicker } from '@ionic-native/image-picker';
import { NavController} from 'ionic-angular';
// import { Nav } from 'ionic-angular';
// import { GroupListPage } from '../xxx/xxx';
@Component({
 selector: 'page-groupcreate',
 templateUrl: 'group-create.html'
})
export class GroupCreatePage {
  submitted = false;
  setPassword: boolean = false;
  hide: boolean = true;
  groupName: string = '我是个群哦';
  groupPassword: string = '';
  groupDes: string = '';
  groupNameHasExist: boolean = false;
  picPath: string = 'http://www.gravatar.com/avatar?d=mm&s=140';
 constructor(
   private hm: httpManager,
   private userData: UserData,
   private imagePicker: ImagePicker,
   public navCtrl: NavController
 ) {}

 ionViewDidLoad() {

 }
 notify(){
   if(this.setPassword){
     this.hide = false;
   }else{
     this.hide = true;
   }
 }
 uploadGroupPic(){
    const options = {//options表示选取的图片参数
      maximumImagesCount: 1,//一次性最多只能选5张，ios系统无效，android上面有效
      width: 500,//图片的宽度
      height: 500,//图片的高度
      quality: 50,//图片的质量0-100之间选择
      outputType: 0 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
    }
    var arry = []
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // arry.push("data:image/jpeg;base64," + results[i]);//处理图片的格式，用于向服务器传输
        this.picPath = results[i];
      }
    }, (err) => { });
 }

 createGroup(){
   this.submitted = true;
   var ifPsd = '0';
   if(this.setPassword){
     ifPsd = '1';
   }else{
     this.groupPassword = '';
   }
   var data = [this.groupName, this.groupDes, ifPsd, this.groupPassword];
   console.log(data);
   if(this.groupName != ''){
     this.hm.sendGroupToServer(data).then((value) => {
       if(value == '1'){
         this.groupName = '';
         this.groupNameHasExist = true;
         this.submitted = false;
       }else{
         this.navCtrl.pop();
       }
     });
   }

 }
}
