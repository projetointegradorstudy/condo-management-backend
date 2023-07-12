import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { Role } from 'src/auth/roles/role.enum';
import { MockBaseRepository } from 'src/base/base.repository.spec';

describe('UserRepository', () => {
  class MockUserRepository extends MockBaseRepository<User> {
    constructor() {
      const mockRepository = {} as Repository<User>;
      super(mockRepository);
    }
    count = jest.fn();
    findOne = jest.fn();
  }

  let userRepository: UsersRepository;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    userRepository = new UsersRepository(mockUserRepository as unknown as Repository<User>);
  });

  describe('base repository tests', () => {
    it('should do base repository coverage', async () => {
      await mockUserRepository.count();
    });
  });

  describe('findWtCredencial', () => {
    it('should find an user', async () => {
      const email = 'test@test.com';
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        email: 'teste@test.com',
        role: Role.USER,
        is_active: true,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.findOne.mockResolvedValue(foundUser);

      const result = await userRepository.findWtCredencial(email);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email },
        select: [
          'id',
          'avatar',
          'name',
          'email',
          'password',
          'role',
          'is_active',
          'partial_token',
          'created_at',
          'updated_at',
          'deleted_at',
        ],
      });
      expect(result).toEqual(foundUser);
    });
  });
});
