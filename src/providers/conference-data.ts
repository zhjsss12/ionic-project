import { Injectable } from '@angular/core';

import { Http } from '@angular/http';

import { UserData } from './user-data';
import { httpManager } from './httpManager';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';


@Injectable()
export class ConferenceData {
  data: any;

  constructor(public http: Http, 
              public user: UserData,
              private hm: httpManager
              ) { }

  load(): any {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this.http.get('assets/data/data.json')
        .map(this.processData, this);
    }
  }

  processData(data: any) {
    // just some good 'ol JS fun with objects and arrays
    // build up the data by linking speakers to sessions
    this.data = data.json();

    this.data.tracks = [];

    // loop through each day in the schedule
    this.data.schedule.forEach((day: any) => {
      // loop through each timeline group in the day
      day.groups.forEach((group: any) => {
        // loop through each session in the timeline group
        group.sessions.forEach((session: any) => {
          session.speakers = [];
          if (session.speakerNames) {
            session.speakerNames.forEach((speakerName: any) => {
              let speaker = this.data.speakers.find((s: any) => s.name === speakerName);
              if (speaker) {
                session.speakers.push(speaker);
                speaker.sessions = speaker.sessions || [];
                speaker.sessions.push(session);
              }
            });
          }

          if (session.tracks) {
            session.tracks.forEach((track: any) => {
              if (this.data.tracks.indexOf(track) < 0) {
                this.data.tracks.push(track);
              }
            });
          }
        });
      });
    });

    return this.data;
  }

  getTimeline(dayIndex: number, queryText = '', excludeTracks: any[] = [], segment = 'all') {
    // return this.load().map((data: any) => {
      return this.hm.getGroup().then(
        result => {
          console.log(result);
          let group = {
            "show" : result.length,
            "glist" : result
          };
          for (var i = 0; i < group.glist.length; i++) {
            group.glist[i]['hide'] = false;
            group.glist[i]['tracks'] = ["Ionic"];
            group.glist[i]['location'] = "Main hallway";
          }

          console.log("new group",group);
          // group= {
          //   "show" : 4,
          //   "glist" : [{
          //     "hide" : false,
          //     "name": "Breakfast",
          //     "timeStart": "8:00 am",
          //     "timeEnd": "9:00 am",
          //     "location": "Main hallway",
          //     "tracks": ["Food"],
          //     "id": "1",
          //     "havePass": true
          //   },
          //   {
          //     "hide" : false,
          //     "name": "Introduction to Appcamp.io",
          //     "location": "Room 2203",
          //     "description": "Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.",
          //     "speakerNames": ["Ellie Elephant"],
          //     "timeStart": "9:15 am",
          //     "timeEnd": "9:30 am",
          //     "tracks": ["Ionic"],
          //     "id": "2"
          //   }, {
          //     "hide" : false,
          //     "name": "Getting started with Ionic",
          //     "location": "Room 2202",
          //     "description": "Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.",
          //     "speakerNames": ["Ted Turtle"],
          //     "timeStart": "9:30 am",
          //     "timeEnd": "9:45 am",
          //     "tracks": ["Ionic"],
          //     "id": "3"
          //   }, {
          //     "hide" : false,
          //     "name": "Tooling for Ionic",
          //     "location": "Room 2201",
          //     "description": "Mobile devices and browsers are now advanced enough that developers can build native-quality mobile apps using open web technologies like HTML5, Javascript, and CSS. In this talk, we’ll provide background on why and how we created Ionic, the design decisions made as we integrated Ionic with Angular, and the performance considerations for mobile platforms that our team had to overcome. We’ll also review new and upcoming Ionic features, and talk about the hidden powers and benefits of combining mobile app development and Angular.",
          //     "speakerNames": ["Rachel Rabbit"],
          //     "timeStart": "9:45 am",
          //     "timeEnd": "10:00 am",
          //     "tracks": ["Tooling"],
          //     "id": "4"
          //   }
          // ]}
          console.log("old group",group);
          group.show = 0;
          queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
          let queryWords = queryText.split(' ').filter(w => !!w.trim().length);

          for (var x in group.glist) {
              // check if this session should show or not
            this.filterSession(group.glist[x], queryWords, excludeTracks, segment);
            if (!group.glist[x].hide) {
              // if this session is not hidden then this group should show
              group.show++;
            }
          }
          // console.log(group)
          return group;
        }
      );

      // console.log(group)
      // console.log("cf  getTimeline  "+ typeof data)
      // console.log(data)
      // let day = data.schedule[dayIndex];

    // });
  }

  filterSession(session: any, queryWords: string[], excludeTracks: any[], segment: string) {

    // console.log(typeof session);
    // console.log(session);
    // console.log(session.hide);
    // console.log(session);
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.groupName.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = true;
    // session.tracks.forEach((trackName: string) => {
    //   if (excludeTracks.indexOf(trackName) === -1) {
    //     matchesTracks = true;
    //   }
    // });

    // if the segement is 'favorites', but session is not a user favorite
    // then this session does not pass the segment test
    let matchesSegment = false;
    if (segment === 'favorites') {
      if (this.user.hasFavorite(session.groupName)) {
        matchesSegment = true;
      }
    } else {
      matchesSegment = true;
    }

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks && matchesSegment);
  }

  getSpeakers() {
    return this.load().map((data: any) => {
      return data.speakers.sort((a: any, b: any) => {
        let aName = a.name.split(' ').pop();
        let bName = b.name.split(' ').pop();
        return aName.localeCompare(bName);
      });
    });
  }

  getTracks() {
    return this.load().map((data: any) => {
      return data.tracks.sort();
    });
  }

  getMap() {
    return this.load().map((data: any) => {
      return data.map;
    });
  }

}
