import { User } from './user.model';

describe('Model: Person', () => {

  let userObject:any = {
    uuid:'uuid',
    display:'the user',
    roles: [
      {
        display: "System Developer",
        uuid: 'role uuid'
      }
    ]
  };

  it('should wrap openmrs person for display correctly',()=>{
    let wrappedUser:User = new User(userObject);
    expect(wrappedUser.uuid).toEqual(userObject.uuid);
    expect(wrappedUser.roleDisplay).toEqual('System Developer')
    expect(wrappedUser.roles).toEqual(userObject.roles);
  });
});
