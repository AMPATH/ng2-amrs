import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class MessagesHistoryService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService) {}

public getUrl() {
    return this.appSettingsService.getEtlServer() + '/poc-user-feedback/1000/1501770200.477992';
}

public getMessagesFeedbackList() {
    return this.http.get(this.getUrl())
    .map( (res: Response) =>  res.json() );
}

public formatMsg(msgs: any[]) {
    let arr: any[];
    arr = [];
    msgs.forEach((msg) => {

         // phone
          const m = msg.text.split('\n', 4);
          const p = m.slice(2, 3);
          const j = p.map((item: any)=> item.replace(' *Phone:* ', ''));

         // location
          const l = m.slice(1, 2);
          const k = l.map((item: any) => item.replace(' *Location:* ', ''));

          // from
          const f = m.slice(0, 1);
          const g = f.map((item: any) => item.replace('*From* ', ''));

          // messages
          const r = msg.text.split('\n');
          const z = r.slice(4);
          const b = z.map((item: any) => item.replace('```', ''));
          const c = b.map((item: any) => item.replace('```', ''));

          const arrInner = [g, k, j, c, msg.ts ];
          if (msg.username === 'bot') {
            arr.push(arrInner);
          }
        });
    return arr;
        }

}
