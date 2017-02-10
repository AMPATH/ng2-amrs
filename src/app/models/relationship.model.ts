import { BaseModel } from './base-model.model';
import { serializable, serialize } from './serializable.decorator';
import './date.extensions';


export class Relationship extends BaseModel {

 constructor(openmrsModel?: any) {
   super(openmrsModel);
   let o = this._openmrsModel;
 }

 @serializable()
 public get relationshipTypeName(): string {
   return this._openmrsModel.relationshipTypeName;
 }

 public set relationshipTypeName(v: string) {
   this._openmrsModel.relationshipTypeName = v;
 }
 @serializable()
 public get relationshipTypeUuId(): string {
   return this._openmrsModel.relationshipTypeUuId;
 }

 public set relationshipTypeUuId(v: string) {
   this._openmrsModel.relationshipTypeUuId = v;
 }

 @serializable()
 public get relationshipType(): string {
   return this._openmrsModel.relationshipType;
 }

 public set relationshipType(v: string) {
   this._openmrsModel.relationshipType = v;
 }

 @serializable()
 public get relative(): string {
   return this._openmrsModel.relative;
 }

 public set relative(v: string) {
   this._openmrsModel.relative = v;
 }

 @serializable()
 public get relatedPersonUuid(): string {
   return this._openmrsModel.relatedPersonUuid;
 }

 public set relatedPersonUuid(v: string) {
   this._openmrsModel.relatedPersonUuid = v;
 }

}
