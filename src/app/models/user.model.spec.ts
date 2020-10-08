import { User } from './user.model';

describe('Model: Person', () => {
  const userObject: any = {
    uuid: 'uuid',
    display: 'the user',
    roles: [
      {
        display: 'System Developer',
        uuid: 'role1 uuid'
      },
      {
        display: 'Tester',
        uuid: 'role2 uuid'
      },
      {
        display: 'Role 3',
        uuid: 'role3 uuid'
      }
    ]
  };
  it('should wrap openmrs person for display correctly', () => {
    const wrappedUser: User = new User(userObject);
    expect(wrappedUser.uuid).toEqual(userObject.uuid);
    expect(wrappedUser.roleDisplay).toEqual('System Developer, Tester');
    expect(wrappedUser.roles).toEqual(userObject.roles);
  });
});
