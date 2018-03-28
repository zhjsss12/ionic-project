import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { dataClass} from '../entity/dataClass';
import { UserData } from '../providers/user-data';
import { Injectable } from '@angular/core';
// 这是数据库控制类

@Injectable()
export class databaseManager {
  myAppDatabase: SQLiteObject;
  ans:any;
  constructor(
    private sqlite: SQLite,
    public userData: UserData,
  ) {}

//数据库初始化类，如果没有创建过这个表格，就重新创建一次。
  databaseInit(){
    this.userData.getUsername().then((userName) => {
      console.log('用户名');
      console.log(userName+'.db');
      this.sqlite.create({
        name: userName+'.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('create table if not exists sports(id INT PRIMARY KEY , AA INT, BB INT, CC INT, datee DATE, DD INT, EE INT, FF INT, GG INT, HH INT, II INT, JJ INT, KK INT, LL INT, MM INT);', {})
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
        this.myAppDatabase=db;
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

//将一个dataClass类插入数据库
  insert(dc:dataClass) : Promise<string>{
    return new Promise((resolve,reject)=>{
      var list:number[] = [];
      list.push(+dc.id);
      for (var i = 0; i < dc.data.length; i ++) {
        list.push(+dc.data[i]);
      }
      console.log(list);
      var date='20'+list[1]+'-';
      if (list[2]<10) {
        date=date+'0'+list[2];
      }
      else {
        date=date+list[2];
      }
      date+='-'
      if (list[3]<10) {
        date=date+'0'+list[3];
      }
      else {
        date=date+list[3];
      }
      this.myAppDatabase.executeSql('select * from sports where id = ' + dc.id + "; " ,[]).then(
        (resultSet)=>{
          if( resultSet.rows.length ==0 ){
            this.myAppDatabase.executeSql('insert into sports VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);',
              [list[0],list[1],list[2],list[3],date,list[4],list[5],list[6],
              list[7],list[8],list[9],list[10],list[11],list[12],list[13]])
              .then(() => {
                resolve('Executed insert SQL');
              })
              .catch(e =>{
                reject(e);
              });
          }
        }).catch(
           e=> {reject(e);}
         );
    });
  }
//返回一个resultSet：obj
//遍历时这么写就好
//for (var i=0 ; i<resultSet.rows.length;i++) {
//     var x= resultSet.rows.item(i);
//     for (var j in x) {
//       console.log(j);
//     }
//     console.log(x['id'],x['AA'],x['BB']);
// }
//。
  query(): Promise<any>{
  return new Promise((resolve,reject)=>{
    this.myAppDatabase.executeSql('select * from sports ',[])
      .then(
          (resultSet) => {
            console.log(typeof resultSet);
            for ( var i=0 ; i<resultSet.rows.length;i++) {
                console.log(' for loop i = ', i);
                var x= resultSet.rows.item(i);
                var listAtr=[];
                var listData=[];
                for (var j in x) {
                  listAtr.push(j);
                  listData.push(x[j]);
                }
                console.log(listAtr);
                console.log(listData);
            }
            console.log(resultSet);
            resolve(resultSet);
          })
      .catch(e =>{
        console.log(e);
        reject(e);
      });
  });
}
//查询某一天的数据是否完整
//返回1表示完整，0表示不完整
//输入一个-6~0的number，0表示今天，-6表示6天前
  queryDataFull(num: number) :Promise<number>{
    return new Promise((resolve,reject)=>{
      var sql= "select count(*) from sports where datee = date('now', '"+num+" day') ;";
      console.log("databaseManager.ts queryDataFull sql : "+sql);
      this.myAppDatabase.executeSql(sql,{})
      .then(
          (resultSet) => {
            // console.log('length ' + resultSet.rows.length);
            // for ( var i=0 ; i<resultSet.rows.length;i++) {
            //     console.log(' for loop i = ', i);
            //     var x= resultSet.rows.item(i);
            //     var listAtr=[];
            //     var listData=[];
            //     for (var j in x) {
            //       listAtr.push(j);
            //       listData.push(x[j]);
            //     }
            //     console.log(listAtr);
            //     console.log(listData);
            // }
            var count=resultSet.rows.item(0)['count(*)']
            if (count == 96) {
              resolve(1);
            }
            else {
              resolve(0);
            }
          })
        .catch(e => {
          reject(e);
        });
    });
  }
//返回某个属性最近几天的数值
//返回一个resultSet：obj
//例如[datee,sum(DD)] = ["2017-12-16",4567]
//遍历直接仿照函数里面写的就好
  queryLastAse(num: number , aspect:string[], type :string) : Promise<any>{
    var q:string="";
    for (var i in aspect) {
      console.log(aspect[i])
      q=q+" , sum(" +aspect[i]+ ")"
    }
    return new Promise((resolve,reject)=>{
      var sql;
      if (type == '0') {
        sql= "select datee " +q+" from ( select * from sports where EE = 0 and datee between date('now','-"+num+" day') and date('now') ) group by datee order by datee asc;";
      }
      else {
        sql= "select datee " +q+" from ( select * from sports where EE != 0 and datee between date('now','-"+num+" day') and date('now') ) group by datee order by datee asc;";
      }
      console.log("databaseManager.ts queryLastAse sql "+sql);
      this.myAppDatabase.executeSql(sql,[])
        .then(
          (resultSet) => {
            console.log('sql resultSet.length : '+resultSet.rows.length);

            console.log(resultSet);
            resolve(resultSet);
          })
        .catch(e =>{
          console.log(e);
          reject(e);
        }
      );
    });
  }
//查询睡眠信息
  querySleep(strYesterday: string, strToday : string): Promise <any>{
    return new Promise((resolve,reject)=>{
      var sql = "select id ,FF,GG,HH,II,JJ,KK,LL,MM from sports where EE != 0 and (id < "+ strToday + "48 and id> " + strYesterday + "47);";
      console.log("databaseManager.ts sql " + sql);
      this.myAppDatabase.executeSql(sql,[])
        .then(
          (resultSet) => {
          console.log('length ' + resultSet.rows.length);
          for ( var i=0 ; i<resultSet.rows.length;i++) {
              console.log(' for loop i = ', i);
              var x= resultSet.rows.item(i);
              var listAtr=[];
              var listData=[];
              for (var j in x) {
                listAtr.push(j);
                listData.push(x[j]);
              }
              console.log(listAtr);
              console.log(listData);
          }
            console.log('sql resultSet.length : '+resultSet.rows.length);
            resolve(resultSet);
          })
        .catch(e =>{
          console.log(e);
          reject(e);
        }
      );
    });
  }
}
