import { HttpException, NotFoundException } from '@nestjs/common';
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
import { IUserService } from './interfaces/users-service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('UsersService', () => {
  let usersService: IUserService;
  let userRepository: IUserRepository;
  let s3Service: IS3Service;
  let emailService: IEmailService;
  let authService: IAuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserService,
          useClass: UsersService,
        },
        {
          provide: IUserRepository,
          useValue: {
            count: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            findBy: jest.fn(),
            findWtCredencial: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: IS3Service,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
        {
          provide: IEmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: IAuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ access_token: 'g75sdg756sd4g68sd4g68' }),
          },
        },
      ],
    }).compile();
    usersService = moduleRef.get<IUserService>(IUserService);
    userRepository = moduleRef.get<IUserRepository>(IUserRepository);
    s3Service = moduleRef.get<IS3Service>(IS3Service);
    emailService = moduleRef.get<IEmailService>(IEmailService);
    authService = moduleRef.get<IAuthService>(IAuthService);
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

      jest.spyOn(userRepository, 'create').mockResolvedValueOnce(createdUser);

      const result = await usersService.create(createUserDto);

      expect(emailService.sendEmail).toHaveBeenCalledWith(createUserDto, template);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(success);
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      jest.spyOn(userRepository, 'count').mockResolvedValueOnce(5);

      const result = await usersService.count();

      expect(userRepository.count).toHaveBeenCalled();
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
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const result = await usersService.findAll();

      expect(userRepository.find).toHaveBeenCalledWith({ order: { created_at: 'ASC' } });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);

      const result = await usersService.findOne(id);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('findEnvReservationsById', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);

      const result = await usersService.findEnvReservationsById(id);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id }, relations: ['env_reservations'] });
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

      jest.spyOn(userRepository, 'findWtCredencial').mockResolvedValueOnce(foundUser);

      const result = await usersService.findToLogin(email);

      expect(userRepository.findWtCredencial).toHaveBeenCalledWith(email);
      expect(result).toEqual(foundUser);
    });
  });

  describe('findOneByToken', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const token = 'invalid token';

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

      await expect(usersService.findOneByToken(token)).rejects.toThrowError(NotFoundException);
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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);

      const result = await usersService.findOneByToken(token);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { partial_token: token } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('findOneByEmail', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const email = 'invalid email';

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);

      const result = await usersService.findOneByEmail(email);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(foundUser);
    });
  });

  describe('updateByAdmin', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
    const adminUpdateUserDto: AdminUpdateUserDto = {
      password: 'newPassword',
    };
    it('should throw NotFoundException when result is not found', async () => {
      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.updateByAdmin(id, adminUpdateUserDto);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(userRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
      expect(result).toEqual(foundUser);
    });
  });

  describe('update', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
    const updateUserDto: UpdateUserDto = {
      password: 'newPassword',
    };
    it('should throw NotFoundException when result is not found', async () => {
      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

      await expect(usersService.update(id, updateUserDto)).rejects.toThrowError(NotFoundException);
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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(s3Service, 'uploadFile').mockResolvedValueOnce(uploadedImage);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.update(id, adminUpdateUserDto, image);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(s3Service.uploadFile).toHaveBeenCalledWith(image, foundUser.avatar);
      expect(userRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.updateByAdmin(id, adminUpdateUserDto);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(userRepository.update).toHaveBeenCalledWith({ id }, adminUpdateUserDto);
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

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.createPassword(token, createUserPasswordDto);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { partial_token: token } });
      expect(userRepository.update).toHaveBeenCalledWith({ id }, createUserPasswordDto);
      expect(authService.login).toHaveBeenCalledWith(auth);
      expect(result).toEqual({ access_token: 'g75sdg756sd4g68sd4g68' });
    });
  });

  describe('sendResetPassEmail', () => {
    const email = 'test@test.com';

    it('should throw Http exception when result is not found', async () => {
      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

      await expect(usersService.sendResetPassEmail(email)).rejects.toThrowError(HttpException);
    });

    it('should update and return a success message', async () => {
      const template = 'Recover-password';
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        partial_token: 'dfdsfdsgdhihafs',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.sendResetPassEmail(email);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { email } });
      expect(emailService.sendEmail).toHaveBeenCalledWith(foundUser, template);
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: foundUser.id },
        { partial_token: foundUser.partial_token },
      );
      expect(result).toEqual({
        message: 'An email with recovery password instructions will be sent',
      });
    });
  });

  describe('resetPassword', () => {
    const token = 'gdfgfdg41df65g4d6fg46df';
    const resetPasswordDto: ResetPasswordDto = { password: 'newPassword', passwordConfirmation: 'newPassword' };

    it('should update and return an access token', async () => {
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        partial_token: 'dfdsfdsgdhihafs',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      const auth: AuthCredentialsDto = { email: 'test@test.com', password: 'newPassword' };

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);
      jest.spyOn(userRepository, 'update').mockResolvedValueOnce(foundUser);

      const result = await usersService.resetPassword(token, resetPasswordDto);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { partial_token: token } });
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: foundUser.id },
        { password: resetPasswordDto.password, partial_token: null },
      );
      expect(authService.login).toHaveBeenCalledWith(auth);
      expect(result).toEqual({ access_token: 'g75sdg756sd4g68sd4g68' });
    });
  });

  describe('remove', () => {
    const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

    it('should throw not found exception when result is not found', async () => {
      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(undefined);

      await expect(usersService.remove(id)).rejects.toThrowError(NotFoundException);
    });

    it('should soft delete and return a success message', async () => {
      const foundUser: User = new User({
        name: 'old name',
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        partial_token: 'dfdsfdsgdhihafs',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userRepository, 'findBy').mockResolvedValueOnce(foundUser);

      const result = await usersService.remove(id);

      expect(userRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(userRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});
