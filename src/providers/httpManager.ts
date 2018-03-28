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
      // ["This is Machine Learning group description",
      //  "Machine Learning",
      // "1",
      // "123"]
  //发送群组信息给服务器
  sendGroupToServer(data):Promise<any>{

    return new Promise((resolve,reject)=>{
      this.userData.getUsername().then((userName) => {
        var body : any = { body:{
          groupName : data[0],
          description : data[1],
          hasPass : data[2],
          password : data[3],
          userName : userName
        }};
        console.log(body);        
        this.http.post('http://120.26.131.179:80/createGroup', {body}, {}).then(data => {
          console.log('statu: '+data.status);
          console.log('send data: '+data.data);
          resolve(data.data);
        }).catch(error => {
          console.log('error statu: '+error.status);
          console.log('error: '+error.error);
          reject(error.error);
        });
      }).catch(error => {
          console.log('error statu: '+error.status);
          console.log('error: '+error.error);
          reject(error.error);
      });
    });
  }

  //发送用户加群信息给服务器
  sendEnterGroupToServer(groupName){
      this.userData.getUsername().then((userName) => {
        var body : any = { 
          userName : userName,
          groupName : groupName,
        };
        console.log('sendEnterGroupToServer');
        console.log(body);
        this.http.post('http://120.26.131.179:80/enterGroup', {body}, {}).then(data => {
          console.log('statu: '+data.status);
          console.log('send data: '+data.data);

        }).catch(error => {
          console.log('error statu: '+error.status);
          console.log('error: '+error.error);
        });
    });
  }

  //发送用户加群信息给服务器
  sendExitGroupToServer(groupName){
      this.userData.getUsername().then((userName) => {
        var body : any = { 
          userName : userName,
          groupName : groupName,
        };
        console.log('sendEnterGroupToServer');
        console.log(body);
        this.http.post('http://120.26.131.179:80/exitGroup', {body}, {}).then(data => {
          console.log('statu: '+data.status);
          console.log('send data: '+data.data);

        }).catch(error => {
          console.log('error statu: '+error.status);
          console.log('error: '+error.error);
        });
    });
  }

// 获取服务器中的群组信息
  getGroup():Promise<any>{
    return new Promise((resolve,reject)=>{
      this.userData.getUsername().then((userName) => {
        var body : any = { 
          userName : userName
        };
        this.http.post('http://120.26.131.179:80/getGroup', {body}, {})
          .then(data => {
            console.log(data.status);
            console.log(data.data); // data received by server
            console.log(data.headers);
            let obj = JSON.parse(data.data)
            resolve([obj.data,obj.groups]);

          })
          .catch(error => {
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
            reject(error)
          });
        });
      }
    );
  }

  getSelfGroupFriends(name): Promise<any> {
    console.log('getSelfGroupFriends');
    var data = {name: name};
    return new Promise((resolve,reject)=>{
      this.http.post('http://120.26.131.179:80/getSelfGroupFriends',{data},{}).then((data) => {
        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);
        let obj = JSON.parse(data.data);
        console.log(obj);
        console.log(obj.friends);
        console.log(typeof obj.friends);
        console.log(typeof obj);
        resolve(obj);
      }).catch((error) => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        reject(error);
      });
    });
  }

  sendRunToServer(userName,run){
    console.log('sendRunToServer');
    var data = {userName: userName,
                run : run,};

    this.http.post('http://120.26.131.179:80/updateRank',{data},{}).then((data) => {
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);

    }).catch((error) => {
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
    });
  }
  sendSleepToServer(userName,sleep){
    console.log('sendSleepToServer');
    var data = {userName: userName,
                sleep : sleep};

    this.http.post('http://120.26.131.179:80/updateRank',{data},{}).then((data) => {
      console.log(data.status);
      console.log(data.data); // data received by server
      console.log(data.headers);

    }).catch((error) => {
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
    });
  }

  sendMoodToServer(userName,sentence,pic): Promise<any>{
    console.log('sendMoodToServer');
    var data = {userName: userName,
                sentence : sentence,
                pic : pic};
    return new Promise((resolve,reject)=>{
      this.http.post('http://120.26.131.179:80/uploadSentence',{data},{}).then((data) => {
        console.log(data.status);
        console.log(data.data); // data received by server
        resolve(data.data);
        console.log(data.headers);

      }).catch((error) => {
        console.log(error.status);
        reject(error.error);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
    });
  }

  //发送意见给服务器
  sendSuggestionToServer(loc, text){
    this.userData.getUsername().then((name)=>{
      var body : any = {
        name : name,
        location : loc,
        suggestion : text,
      };
      console.log('sendSuggestionToServer');
      console.log(body);
      this.http.post('http://120.26.131.179:80/uploadAdvice', {body}, {}).then(data => {
        console.log('statu: '+data.status);
        console.log('send data: '+data.data);

      }).catch(error => {
        console.log('error statu: '+error.status);
        console.log('error: '+error.error);
      });
    });

  }
  getNewVersion(): Promise<any> {
    return new Promise((resolve,reject)=>{
      this.http.get('http://120.26.131.179:80/update',{},{}).then((data) => {
        console.log(data.status);
        console.log(data.data); // data received by server
        console.log(data.headers);
        resolve(data.data);
      }).catch((error) => {
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
        reject(error);
      });
    });
  }

}


