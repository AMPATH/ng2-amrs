declare var Reflect: any;

import { BaseModel } from './base-model.model';
import './date.extensions';

export const METADATA_KEY_SERIALIZABLE = "SERIALIZABLE";

export interface SerializableProperty {

  key: string;
  name: string;
  addToNewPayload: boolean;
  addToUpdatePayload: boolean;

}

export function serializable(addToNewPayload: boolean = true, addToUpdatePayload: boolean = true, name?: string) {

  return function (target: any, key: any) {

    Reflect.defineMetadata(METADATA_KEY_SERIALIZABLE,
      {
        key: key,
        name: name || key,
        addToNewPayload: addToNewPayload,
        addToUpdatePayload: addToUpdatePayload
      },
      target, key);
  };
}

export function getSerializables(target: any): Array<SerializableProperty> {

  let serializables: Array<any> = [];

  for (let key in target) {

    let metadata = Reflect.getMetadata(METADATA_KEY_SERIALIZABLE, target, key);

    if (metadata) {
      serializables.push(metadata);
    }
  }

  return serializables;
}


export function serialize(target: any, newPayload: boolean, prototype?: any): Object {

  return getSerializables(prototype || target).reduce((prev: any, prop: SerializableProperty) => {

    const isBaseModel = target[prop.key] instanceof BaseModel;
    const baseModelVersion = target[prop.key] as BaseModel;
    const isOpenmrsDate = target[prop.key] instanceof Date;
    const openmrsDate = target[prop.key] as Date;

    if (newPayload) {
      if (prop.addToNewPayload)
        prev[prop.name] = isBaseModel || isOpenmrsDate ? (isOpenmrsDate ? openmrsDate.toServerTimezoneString(): baseModelVersion.uuid) : target[prop.key];
    } else {
      if (prop.addToUpdatePayload)
        prev[prop.name] = isBaseModel || isOpenmrsDate ? (isOpenmrsDate ? openmrsDate.toServerTimezoneString(): baseModelVersion.uuid) : target[prop.key];
    }
    return prev;
  }, {});
}
