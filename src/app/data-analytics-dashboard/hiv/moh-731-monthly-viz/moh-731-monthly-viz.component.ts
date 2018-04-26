import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { KibanaVizComponent } from '../../../shared/kibana-viz/kibana-viz.component';

@Component({
    selector: 'moh731-monthly-viz-analytics',
    templateUrl: 'moh731-monthly-viz.component.html'
})
export class Moh731MonthlyVizComponent extends KibanaVizComponent {

    constructor(
        route: ActivatedRoute,
        location: Location,
        router: Router
    ) {
        super(route, location, router);
        this.height = '1680';
        // tslint:disable-next-line:max-line-length
        this.kibanaVizUrl = "https://ngx.ampath.or.ke/app/kibana#/dashboard/8d203b00-164e-11e8-84c2-7d8bcda8ca46?embed=true&_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:'Mon+Jan+01+2018+03:00:00+GMT%2B0300',mode:absolute,to:'Thu+Feb+01+2018+03:00:00+GMT%2B0300'))&_a=(description:'',filters:!(('$state':(store:appState),meta:(alias:!n,controlledBy:'1519223407128',disabled:!f,index:'76cd6c40-3e50-11e8-afc7-a71ce40a3740',key:status.keyword,negate:!f,params:(query:active,type:phrase),type:phrase,value:active),query:(match:(status.keyword:(query:active,type:phrase))))),fullScreenMode:!f,options:(darkTheme:!f,hidePanelTitles:!f,useMargins:!t),panels:!((gridData:(h:3,i:'1',w:6,x:0,y:6),id:'15df53d0-1637-11e8-84c2-7d8bcda8ca46',panelIndex:'1',type:visualization,version:'6.1.0'),(gridData:(h:3,i:'2',w:6,x:6,y:0),id:'51b13bf0-164e-11e8-84c2-7d8bcda8ca46',panelIndex:'2',type:visualization,version:'6.1.0'),(embeddableConfig:(spy:!n,vis:(colors:(F:%23BA43A9,M:%230A437C))),gridData:(h:3,i:'3',w:6,x:0,y:3),id:'2408bce0-164f-11e8-84c2-7d8bcda8ca46',panelIndex:'3',type:visualization,version:'6.1.0'),(gridData:(h:3,i:'4',w:6,x:6,y:6),id:'22e5e690-1635-11e8-84c2-7d8bcda8ca46',panelIndex:'4',type:visualization,version:'6.1.0'),(embeddableConfig:(vis:(colors:(Female:%23BA43A9,Male:%230A437C))),gridData:(h:3,i:'5',w:6,x:0,y:9),id:ee4d44e0-156d-11e8-aa84-3d34a52974af,panelIndex:'5',type:visualization,version:'6.1.0'),(gridData:(h:3,i:'6',w:6,x:6,y:3),id:'12da6db0-1636-11e8-84c2-7d8bcda8ca46',panelIndex:'6',type:visualization,version:'6.1.0'),(embeddableConfig:(spy:!n,vis:(colors:(F:%23BA43A9,M:%230A437C))),gridData:(h:3,i:'7',w:6,x:0,y:12),id:'604444c0-125f-11e8-aa84-3d34a52974af',panelIndex:'7',type:visualization,version:'6.1.0'),(embeddableConfig:(spy:!n,vis:(colors:('Completed+IPT+past+12+months':%23D683CE,'Started+IPT+this+month':%233F2B5B),legendOpen:!t)),gridData:(h:3,i:'8',w:6,x:6,y:9),id:'226263f0-12ee-11e8-aa84-3d34a52974af',panelIndex:'8',type:visualization,version:'6.1.0'),(gridData:(h:3,i:'9',w:6,x:0,y:0),id:'689953e0-2033-11e8-82d3-3b8006057327',panelIndex:'9',type:visualization,version:'6.2.1'),(gridData:(h:3,i:'10',w:6,x:6,y:12),id:'4c1656b0-1713-11e8-84c2-7d8bcda8ca46',panelIndex:'10',type:search,version:'6.2.1')),query:(language:lucene,query:''),timeRestore:!t,title:'MOH+731+Monthly+Analysis',viewMode:view)";
    }
}
