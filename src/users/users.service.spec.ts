import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRepository } from './interfaces/users-repository.interface';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { createMockImage } from 'src/utils/upload/mocks/image.mock';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { IEmailService } from 'src/utils/email/email.interface';
import { IAuthService } from 'src/auth/interfaces/auth-service.interface';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { User } from './entities/user.entity';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { Role } from 'src/auth/roles/role.enum';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockS3Service: jest.Mocked<IS3Service>;
  let mockEmailService: jest.Mocked<IEmailService>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockUserRepository = {
      count: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      findWtCredencial: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    mockS3Service = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<IS3Service>;

    mockEmailService = {
      sendEmail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<IEmailService>;

    mockAuthService = {
      login: jest.fn().mockResolvedValue({ access_token: 'g75sdg756sd4g68sd4g68' }),
    } as unknown as jest.Mocked<IAuthService>;

    usersService = new UsersService(mockUserRepository, mockS3Service, mockEmailService, mockAuthService);
  });

  describe('create', () => {
    it('should create an user', async () => {
      const createUserDto: AdminCreateUserDto = {
        email: 'test@test.com',
      };
      const template = 'Create-password';
      const createdUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const success = { message: 'User created successfully' };

      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await usersService.create(createUserDto);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith(createUserDto, template);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(success);
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      mockUserRepository.count.mockResolvedValue(5);

      const result = await usersService.count();

      expect(mockUserRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users: User[] = [
        new User({
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          email: 'test@test.com',
          role: Role.USER,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        }),
      ];

      mockUserRepository.find.mockResolvedValue(users);

      const result = await usersService.findAll();

      expect(mockUserRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.findOne(id)).rejects.toThrowError(NotFoundException);
    });

    it('should return an user', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.findBy.mockResolvedValue(foundUser);

      const result = await usersService.findOne(id);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('findEnvReservationsById', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.findEnvReservationsById(id)).rejects.toThrowError(NotFoundException);
    });

    it("should return the user's reservations", async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvReservations: EnvReservation[] = [
        {
          id: '5e00de71-b48b-41fd-b26c-687b02f27ef8',
          status: EnvReservationStatus.PENDING,
          user_id: 'f3fcdfdd-b7d6-4fce-b5c8-baf893ab946b',
          environment_id: '2ed45c4d-d2cd-40eb-b213-587faf726287',
          date_in: new Date(Date.now()),
          date_out: new Date(Date.now()),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: foundEnvReservations,
      });

      mockUserRepository.findBy.mockResolvedValue(foundUser);

      const result = await usersService.findEnvReservationsById(id);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id }, relations: ['env_reservations'] });
      expect(result).toEqual(foundEnvReservations);
    });
  });

  describe('findToLogin', () => {
    it('should return an user with password', async () => {
      const email = 'test@test.com';
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        password: 'Fg86as4GHs65dh&$36',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.findWtCredencial.mockResolvedValue(foundUser);

      const result = await usersService.findToLogin(email);

      expect(mockUserRepository.findWtCredencial).toHaveBeenCalledWith(email);
      expect(result).toEqual(foundUser);
    });
  });

  describe('findOneByToken', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const token = 'invalid token';

      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.findOne(token)).rejects.toThrowError(NotFoundException);
    });

    it('should return an user by token', async () => {
      const token = 'f56sda41fg6+ds1g65sd1g6sfd6';
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.findBy.mockResolvedValue(foundUser);

      const result = await usersService.findOneByToken(token);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { partial_token: token } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const email = 'invalid email';

      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.findOneByEmail(email)).rejects.toThrowError(NotFoundException);
    });

    it('should return an user by email without password', async () => {
      const email = 'test@test.com';
      const foundUser: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      mockUserRepository.findBy.mockResolvedValue(foundUser);

      const result = await usersService.findOneByEmail(email);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('updateByAdmin', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
    const adminUpdateUserDto: AdminUpdateUserDto = {
      password: 'newPassword',
    };
    it('should throw NotFoundException when result is not found', async () => {
      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.updateByAdmin(id, adminUpdateUserDto)).rejects.toThrowError(NotFoundException);
    });

    it('should update and return an user', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const adminUpdateUserDto: AdminUpdateUserDto = {
        password: 'newPassword',
      };

      mockUserRepository.findBy.mockResolvedValue(foundUser);
      mockUserRepository.update.mockResolvedValue(foundUser);

      const result = await usersService.updateByAdmin(id, adminUpdateUserDto);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
      expect(result).toEqual(foundUser);
    });
  });

  describe('update', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
    const adminUpdateUserDto: AdminUpdateUserDto = {
      password: 'newPassword',
    };
    it('should throw NotFoundException when result is not found', async () => {
      mockUserRepository.findBy.mockResolvedValue(undefined);

      await expect(usersService.updateByAdmin(id, adminUpdateUserDto)).rejects.toThrowError(NotFoundException);
    });

    it('should update and return an user with image', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const image: Express.Multer.File = createMockImage();
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const adminUpdateUserDto: AdminUpdateUserDto = {
        password: 'newPassword',
      };
      const uploadedImage: AWS.S3.ManagedUpload.SendData = {
        Location: 'https://condo-tests.s3.amazonaws.com/attach-teste.png',
        Bucket: 'bucket-teste',
        Key: 'teste-image.png',
        ETag: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
      };

      mockUserRepository.findBy.mockResolvedValue(foundUser);
      mockS3Service.uploadFile.mockResolvedValue(uploadedImage);
      mockUserRepository.update.mockResolvedValue(foundUser);

      const result = await usersService.update(id, adminUpdateUserDto, image);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(image, foundUser.avatar);
      expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
      expect(result).toEqual(foundUser);
    });

    it('should update and return an user without image', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const adminUpdateUserDto: AdminUpdateUserDto = {
        password: 'newPassword',
      };

      mockUserRepository.findBy.mockResolvedValue(foundUser);
      mockUserRepository.update.mockResolvedValue(foundUser);

      const result = await usersService.updateByAdmin(id, adminUpdateUserDto);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
      expect(result).toEqual(foundUser);
    });
  });

  describe('createPassword', () => {
    const token = '+856gvds41gv6+541ds65g1';
    const createUserPasswordDto: CreateUserPasswordDto = {
      password: 'newPassword',
      passwordConfirmation: 'newPassword',
    };

    it('should update and return an user without image', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const auth: AuthCredentialsDto = { email: 'test@test.com', password: 'newPassword' };

      mockUserRepository.findBy.mockResolvedValue(foundUser);
      mockUserRepository.update.mockResolvedValue(foundUser);

      const result = await usersService.createPassword(token, createUserPasswordDto);

      expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { partial_token: token } });
      expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, createUserPasswordDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(auth);
      expect(result).toEqual({ access_token: 'g75sdg756sd4g68sd4g68' });
    });
  });

  // describe('update', () => {
  //   it('should update an user without image and return it', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const existingEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'old name',
  //       description: 'old description',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };
  //     const updateEnvironmentDto: UpdateEnvironmentDto = {
  //       name: 'updated name',
  //       description: 'updated description',
  //     };

  //     const updatedEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'updated name',
  //       description: 'updated description',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(existingEnvironment);
  //     mockUserRepository.update.mockResolvedValue(updatedEnvironment);

  //     const result = await usersService.update(id, updateEnvironmentDto);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
  //     expect(result).toEqual(updatedEnvironment);
  //   });

  //   it('should update an user with image and return it', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const image: Express.Multer.File = createMockImage();
  //     const existingEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'old name',
  //       description: 'old description',
  //       image: 'any image location',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };
  //     const updateEnvironmentDto: UpdateEnvironmentDto = {
  //       name: 'updated name',
  //       description: 'updated description',
  //     };
  //     const uploadedImage: AWS.S3.ManagedUpload.SendData = {
  //       Location: 'https://condo-tests.s3.amazonaws.com/attach-teste.png',
  //       Bucket: 'bucket-teste',
  //       Key: 'teste-image.png',
  //       ETag: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //     };
  //     const updatedEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'updated name',
  //       description: 'updated description',
  //       status: EnvironmentStatus.DISABLED,
  //       image: uploadedImage.Location,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(existingEnvironment);
  //     mockS3Service.uploadFile.mockResolvedValue(uploadedImage);
  //     mockUserRepository.update.mockResolvedValue(updatedEnvironment);

  //     const result = await usersService.update(id, updateEnvironmentDto, image);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(mockS3Service.uploadFile).toHaveBeenCalledWith(image, existingEnvironment.image);
  //     expect(mockUserRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
  //     expect(result).toEqual(updatedEnvironment);
  //   });

  //   it('should throw NotFoundException when result is not found', async () => {
  //     const id = 'invalid uuid';
  //     const updateEnvironmentDto: UpdateEnvironmentDto = {
  //       name: 'updated name',
  //       description: 'updated description',
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(null);

  //     await expect(usersService.update(id, updateEnvironmentDto)).rejects.toThrowError(NotFoundException);
  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(mockUserRepository.update).not.toHaveBeenCalled();
  //   });
  // });

  // describe('remove', () => {
  //   it('should return a success message', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const user: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'name test',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(user);
  //     mockUserRepository.softDelete.mockResolvedValue(undefined);

  //     const result = await usersService.remove(id);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(mockUserRepository.softDelete).toHaveBeenCalledWith(user.id);
  //     expect(result).toEqual({ message: 'User deleted successfully' });
  //   });

  //   it('should throw NotFoundException when result is not found', async () => {
  //     const id = 'invalid uuid';

  //     mockUserRepository.findBy.mockResolvedValue(undefined);

  //     await expect(usersService.remove(id)).rejects.toThrowError(NotFoundException);
  //   });
  // });
});
