/* tslint:disable:no-unused-variable */

// import { TestBed, async, inject, describe, it, expect } from '@angular/core/testing';

import {Person} from './person.model';


describe('Model: Person', () => {

  const existingPerson: any = {
    uuid: 'uuid',
    display: 'the person',
    gender: 'gender',
    age: 'age',
    preferredName: 'the person preferredName',
    birthdate: '2016-01-01 0:00z'

  };

  it('should wrap openmrs person for display correctly', () => {
    const wrappedPerson: Person = new Person(existingPerson);
    expect(wrappedPerson.uuid).toEqual(existingPerson.uuid);
    expect(wrappedPerson.display).toEqual(existingPerson.display);
    expect(wrappedPerson.gender).toEqual(existingPerson.gender);
    expect(wrappedPerson.age).toEqual(existingPerson.age);
    expect(wrappedPerson.birthdate).toEqual(new Date(existingPerson.birthdate));
    expect(wrappedPerson.preferredName).toEqual(existingPerson.preferredName);

  });

// TODO implement these tests
  /*it('should generate update existing payload correctly',()=>{

  });

  it('should generate a new Person new payload correctly', ()=>{


  });

  it('should generate an existing Person payload correctly', ()=>{

  });*/
});



