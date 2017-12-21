import { Component, NgZone } from '@angular/core';
import { BLE } from '@ionic-native/ble';
import { Injectable } from '@angular/core';
/**
* 蓝牙操作管理
*/
@Injectable()
export class bleManager {

  constructor(private ble: BLE) {}

  //请求运动和睡眠数据
  requestSport(peripheral:any):Promise<any> {
    return new Promise((resolve,reject)=>{
      this.ble.write(peripheral, 'fff0' , 'fff6', this.sportReq()).then(
        responseData => {
          resolve('OK');
        }
      ).catch(
        error => {
          // console.log('ERROR:'+error);
          // alert('Error: '+error);
          reject('Error'+error);
        });
    });
  }
  sportReq() {
    //[0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]
    var array = new Uint8Array(16);
    array[0] = 0x43;
    array[1] = 0x00;
    array[2] = 0x00;
    array[3] = 0x00;
    array[4] = 0x00;
    array[5] = 0x00;
    array[6] = 0x00;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    array[15] = 0x43;

    return array.buffer;
  }

  //请求时间
  requestTime(peripheral:any):Promise<any> {
    return new Promise((resolve,reject) => {
      this.ble.write(peripheral, 'fff0' , 'fff6', this.timeReq()).then(
        responseData => {
          resolve('OK');
        }
      ).catch(
        error => {
          reject('Eoor'+error);
        }
      );
    });

  }
  timeReq() {
    //[0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]
    var array = new Uint8Array(16);
    array[0] = 0x41;
    array[1] = 0x00;
    array[2] = 0x00;
    array[3] = 0x00;
    array[4] = 0x00;
    array[5] = 0x00;
    array[6] = 0x00;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    array[15] = 0x41;

    return array.buffer;
  }

  //请求当前数据
  requestCurSport(peripheral:any):Promise<string> {
    return new Promise((success, failure) => {
      this.ble.write(peripheral, 'fff0' , 'fff6', this.currentReq()).then(
        responseData => {
          success('OK');
        }
      ).catch(
        error => {
          failure(error);
        }
      );
    });

  }
  currentReq() {
    //[0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]
    var array = new Uint8Array(16);
    array[0] = 0x07;
    array[1] = 0x00;
    array[2] = 0x00;
    array[3] = 0x00;
    array[4] = 0x00;
    array[5] = 0x00;
    array[6] = 0x00;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    array[15] = 0x07;

    return array.buffer;
  }

  //请求当前数据
  writeCurTime(peripheral:any):Promise<string> {
    return new Promise((success, failure) => {
      this.ble.write(peripheral, 'fff0' , 'fff6', this.timeWrite()).then(
        responseData => {
          success('OK');
        }
      ).catch(
        error => {
          failure(error);
        }
      );
    });

  }
  timeWrite() {
    //[0x41,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x41]
    var myDate = new Date();
    var year = myDate.getFullYear()%100;
    var month = myDate.getMonth()+1;
    var day = myDate.getDate();
    var hour = myDate.getHours();
    var minute = myDate.getMinutes();
    var second = myDate.getSeconds();
    console.log(year+"-"+month+"-"+day+" "+hour+"-"+minute+"-"+second);
    var array = new Uint8Array(16);
    array[0] = 0x01;
    array[1] = Math.floor(year/10)*16+year%10;
    array[2] = Math.floor(month/10)*16+month%10;
    array[3] = Math.floor(day/10)*16+day%10;
    array[4] = Math.floor(hour/10)*16+hour%10;
    array[5] = Math.floor(minute/10)*16+minute%10;
    array[6] = Math.floor(second/10)*16+second%10;
    array[7] = 0x00;
    array[8] = 0x00;
    array[9] = 0x00;
    array[10] = 0x00;
    array[11] = 0x00;
    array[12] = 0x00;
    array[13] = 0x00;
    array[14] = 0x00;
    for(let i = 0;i<15;i++){
      array[15] = array[15]+array[i];
    }

    return array.buffer;
  }
}
