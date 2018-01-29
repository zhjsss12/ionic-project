import { Component } from '@angular/core';

import {
 NavController
} from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { RankUser } from '../../entity/rankUser';
import { dataClass } from '../../entity/dataClass';
import {databaseManager} from '../../providers/databaseManager';

@Component({
 selector: 'page-rank',
 templateUrl: 'rank.html'
})
export class RankPage {

 users: RankUser[] = [];
 rank: string = "step";
 constructor(
   public navCtrl: NavController,
   private sqlite: SQLite,
   public dm:databaseManager,

 ) {}

 ionViewDidLoad() {
   //向数据库请求该user的好友的步数等等信息，此处先模拟生成
   for(let i =0;i<10;i++){
     let user = new RankUser();
     user.id = i;
     user.name = 'Friend' + i;
     user.step = Math.ceil(Math.random()*10000);
     user.sleep = Math.random()*10;
     user.mood = Math.random()*10;
     this.users.push(user)
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
