import { HTTP } from '@ionic-native/http';
import { Injectable } from '@angular/core';
import { UserData } from '../providers/user-data';
/**
* http操作管理
*/
@Injectable()
export class httpManager {
  constructor(private http: HTTP, public userData: UserData) {}

  //发送蓝牙读取的运动睡眠数据给服务器
  sendBleToServer(data){
    this.exchangeBleData(data).then((d)=>{
      this.http.post('http://120.26.131.179:80/upload', {d}, {}).then(data => {
        console.log('statu: '+data.status);
        console.log('send data: '+data.data);
      }).catch(error => {
        console.log('error statu: '+error.status);
        console.log('error: '+error.error);
      });
    }).catch((error)=>{
      console.log(error);
    });

  }

  exchangeBleData(data):Promise<any>{
    var user = "";
    return new Promise((resolve,reject)=>{
      this.userData.getUsername().then((username) => {
       user = username;
       var body : any = { body:{
         name:user,
         AA: data[2],
         BB: data[3],
         CC: data[4],
         DD: data[5],
         EE: data[6],
         FF: data[7],
         GG: data[8],
         HH: data[9],
         II: data[10],
         JJ: data[11],
         KK: data[12],
         LL: data[13],
         MM: data[14]
       }
       }
       resolve(body);
     }).catch((error)=>{
       reject(error);
     });

    });

  }


}
