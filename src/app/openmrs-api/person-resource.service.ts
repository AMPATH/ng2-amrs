import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable } from "rxjs";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";

@Injectable()
export class PersonResourceService {
  public v = "full";
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + "person";
  }

  public getPersonByUuid(
    uuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    let url = this.getUrl();
    url += "/" + uuid;

    const params: HttpParams = new HttpParams().set(
      "v",
      v && v.length > 0 ? v : this.v
    );
    return this.http.get(url, {
      params: params,
    });
  }

  public saveUpdatePerson(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + "/" + uuid;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(url, JSON.stringify(payload), { headers }).pipe(
      map((response: any) => {
        return response.person;
      })
    );
  }

  public generatePersonAttributePayload(
    personAttributePayload,
    existingAttributes
  ) {
    const payLoad = [];
    const attributes = personAttributePayload.attributes;
    for (const a in attributes) {
      if (attributes.hasOwnProperty(a)) {
        let attr;
        if (attributes[a] !== undefined && attributes[a] !== "undefined") {
          attr = this.getPersonAttributeByAttributeTypeUuid(
            existingAttributes,
            attributes[a].attributeType
          );
          if (attr === undefined) {
            attr = _.filter(attr, (attribute) => {
              return attribute !== undefined && attribute !== null;
            });
          }

          if (
            (attr && attributes[a].value === null) ||
            attributes[a].value.toString() === ""
          ) {
            payLoad.push({ uuid: attr.uuid, voided: true });
          } else {
            payLoad.push({
              attributeType: attributes[a].attributeType,
              value: attributes[a].value,
            });
          }
        }
      }
    }
    return payLoad;
  }

  private getPersonAttributeByAttributeTypeUuid(attributes, attributeType) {
    // let attributes = this.patient.person.attributes;
    const attrs = _.filter(attributes, (attribute: any) => {
      if (attribute.attributeType.uuid === attributeType) {
        return true;
      } else {
        return false;
      }
    });
    return attrs[0];
  }
}
