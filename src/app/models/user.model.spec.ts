import { User } from './user.model';

describe('Model: Person', () => {
  const userObject: any = {
    uuid: 'uuid',
    display: 'the user',
    roles: [
      {
        name: 'System Developer',
        uuid: 'role1 uuid'
      },
      {
        name: 'Tester',
        uuid: 'role2 uuid'
      },
      {
        name: 'Role 3',
        uuid: 'role3 uuid'
      }
    ]
  };
  it('should wrap openmrs person for display correctly', () => {
    const wrappedUser: User = new User(userObject);
    expect(wrappedUser.uuid).toEqual(userObject.uuid);
    expect(wrappedUser.roleDisplay).toEqual('System Developer, Tester');
  });
});
