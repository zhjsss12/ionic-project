import { Component } from '@angular/core';

import {
 NavController
} from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { RankUser } from '../../entity/rankUser';

import { dataClass } from '../../entity/dataClass';
import {databaseManager} from '../../providers/databaseManager';
import {httpManager} from '../../providers/httpManager';
import { UserData } from '../../providers/user-data';
//
// import { ViewChild, ElementRef } from '@angular/core';
//
import { PopoverController, NavParams } from 'ionic-angular';

@Component({
 selector: 'page-rank',
 templateUrl: 'rank.html'
})
export class RankPage {

 users: RankUser[] = [];
 rank: string = "step";
 p: any;
 // @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
 // @ViewChild('popoverText', { read: ElementRef }) text: ElementRef;

 constructor(
   private popoverCtrl: PopoverController,
   public navCtrl: NavController,
   private sqlite: SQLite,
   public dm:databaseManager,
   private userData: UserData,
   private hm: httpManager
 ) {}

 ionViewDidLoad() {
   //向数据库请求该user的好友的步数等等信息
   this.userData.getUsername().then((value) => {
     this.hm.getSelfGroupFriends(value).then((data) => {
       data = data.friends;
       for(let i=0; i<data.length; i++){
         let user = new RankUser();
         user.id = i;
         if(data[i].name == value){
           user.color = "secondary";
         }else{
           user.color = "primary";
         }
         user.name = data[i].name;
         user.step = Number(data[i].step);
         user.sleep = Number(data[i].sleep);
         user.mood = Number(data[i].mood);
         this.users.push(user);
       }
       var compare = function (obj1, obj2) {
         var val1 = obj1.step;
         var val2 = obj2.step;
         if (val1 < val2) {
            return 1;
         } else if (val1 > val2) {
            return -1;
         } else {
            return 0;
         }
       }
       this.users.sort(compare);
       for(let i=0;i<this.users.length;i++){
         this.users[i].rank = i+1;
       }
     }).catch((error) => {

     });
   })

   // for(let i =1;i<10;i++){
   //   let user = new RankUser();
   //   user.id = i;
   //   user.name = 'Friend' + i;
   //   user.step = Math.ceil(Math.random()*10000);
   //   user.sleep = Math.random()*10;
   //   user.mood = Math.random()*10;
   //   this.users.push(user)
   // }

 }
 ionChange(){
   if(this.rank == 'step'){
     var compare = function (obj1, obj2) {
       var val1 = obj1.step;
       var val2 = obj2.step;
       if (val1 < val2) {
          return 1;
       } else if (val1 > val2) {
          return -1;
       } else {
          return 0;
       }
     }
     this.users.sort(compare);
     for(let i=0;i<this.users.length;i++){
       this.users[i].rank = i+1;
     }
   }else{
     if(this.rank == 'sleep'){
       var compare = function (obj1, obj2) {
         var val1 = obj1.sleep;
         var val2 = obj2.sleep;
         if (val1 < val2) {
            return 1;
         } else if (val1 > val2) {
            return -1;
         } else {
            return 0;
         }
       }
       this.users.sort(compare);
       for(let i=0;i<this.users.length;i++){
         this.users[i].rank = i+1;
       }
     }else{
       var compare = function (obj1, obj2) {
         var val1 = obj1.mood;
         var val2 = obj2.mood;
         if (val1 < val2) {
            return 1;
         } else if (val1 > val2) {
            return -1;
         } else {
            return 0;
         }
       }
       this.users.sort(compare);
       for(let i=0;i<this.users.length;i++){
         this.users[i].rank = i+1;
       }
     }
   }
 }


}
