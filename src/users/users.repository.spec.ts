import { BaseRepository } from 'src/base-entity/base-entity.repository';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UsersRepository } from './users.repository';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { Role } from 'src/auth/roles/role.enum';

describe('UserRepository', () => {
  class MockUserRepository extends BaseRepository<User> {
    constructor() {
      const mockRepository = {} as Repository<User>;
      super(mockRepository);
    }
    count = jest.fn();
    create = jest.fn();
    save = jest.fn();
    find = jest.fn();
    findOne = jest.fn();
    findOneBy = jest.fn();
    findWtCredencial = jest.fn();
    update = jest.fn();
    softDelete = jest.fn();
  }

  let userRepository: UsersRepository;
  let mockUserRepository: MockUserRepository;

  beforeEach(() => {
    mockUserRepository = new MockUserRepository();
    userRepository = new UsersRepository(mockUserRepository as unknown as Repository<User>);
  });

  describe('When create user', () => {
    it('should create and save a new user', async () => {
      const createUserDto: AdminCreateUserDto = { email: 'teste@test.com' };
      const createdUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        email: 'teste@test.com',
        role: Role.USER,
        is_active: true,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await userRepository.create(createUserDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('When search one user by email', () => {
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

  // describe('When count users', () => {
  //   it('should count and bring the total', async () => {
  //     mockUserRepository.count.mockResolvedValue(5);

  //     const result = await userRepository.count();

  //     expect(mockUserRepository.count).toHaveBeenCalled();
  //     expect(result).toEqual(5);
  //   });
  // });

  // describe('When search for all users', () => {
  //   it('should find all users by specific status', async () => {
  //     const status = Status.AVAILABLE;
  //     const foundUsers: User[] = [
  //       {
  //         id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //         name: 'User 1',
  //         status: Status.AVAILABLE,
  //         capacity: 4,
  //         created_at: new Date(Date.now()),
  //         updated_at: new Date(Date.now()),
  //         env_requests: [],
  //       },
  //     ];

  //     mockUserRepository.find.mockResolvedValue(foundUsers);

  //     const result = await userRepository.find({ where: { status } });

  //     expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { status } });
  //     expect(result).toEqual(foundUsers);
  //   });

  //   it('should find all users', async () => {
  //     const foundUsers: User[] = [
  //       {
  //         id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //         name: 'User 1',
  //         status: Status.AVAILABLE,
  //         capacity: 4,
  //         created_at: new Date(Date.now()),
  //         updated_at: new Date(Date.now()),
  //         env_requests: [],
  //       },
  //       {
  //         id: '681cedb1-0ecd-4ga5-2414-bee5746hcffd',
  //         name: 'User 2',
  //         status: Status.LOCKED,
  //         capacity: 4,
  //         created_at: new Date(Date.now()),
  //         updated_at: new Date(Date.now()),
  //         env_requests: [],
  //       },
  //     ];

  //     mockUserRepository.find.mockResolvedValue(foundUsers);

  //     const result = await userRepository.find();

  //     expect(mockUserRepository.find).toHaveBeenCalled();
  //     expect(result).toEqual(foundUsers);
  //   });
  // });

  // describe('When search one user by ID', () => {
  //   it('should find an user', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const foundUser: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'name test',
  //       status: Status.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };
  //     mockUserRepository.findOne.mockResolvedValue(foundUser);

  //     const result = await userRepository.findBy({ where: { id } });

  //     expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  //     expect(result).toEqual(foundUser);
  //   });
  // });

  // describe('When update an user', () => {
  //   it('should apply changes and bring the updated user', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const updateUserDto: UpdateUserDto = {
  //       name: 'updated name',
  //       description: 'updated description',
  //     };
  //     const updatedUser: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'updated name',
  //       description: 'updated description',
  //       status: Status.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.create.mockReturnValue(updateUserDto);
  //     mockUserRepository.findOneBy.mockResolvedValue(updatedUser);

  //     const result = await userRepository.update({ id }, updateUserDto);

  //     expect(mockUserRepository.create).toHaveBeenCalledWith(updateUserDto);
  //     expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, updateUserDto);
  //     expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
  //     expect(result).toEqual(updatedUser);
  //   });
  // });

  // describe('When soft delete one user by ID', () => {
  //   it('should return soft deleted user', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const softDeletedUser: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'name test',
  //       status: Status.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       deleted_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.softDelete.mockResolvedValue(softDeletedUser);

  //     const result = await userRepository.softDelete(id);

  //     expect(mockUserRepository.softDelete).toHaveBeenCalledWith(id);
  //     expect(result).toEqual(softDeletedUser);
  //   });
  // });
});
