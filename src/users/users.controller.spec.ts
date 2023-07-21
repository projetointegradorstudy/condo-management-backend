import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { IUserService } from './interfaces/users-service.interface';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/roles/role.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserPasswordDto } from './dto/create-user-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let userService: IUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: IUserService,
          useValue: {
            create: jest.fn(),
            count: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findEnvReservationsById: jest.fn(),
            updateByAdmin: jest.fn(),
            update: jest.fn(),
            createPassword: jest.fn(),
            sendResetPassEmail: jest.fn(),
            resetPassword: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<IUserService>(IUserService);
  });

  describe('create', () => {
    it('should return a success message', async () => {
      const adminCreateUserDto: AdminCreateUserDto = { email: 'john_doo@contoso.com' };

      jest.spyOn(userService, 'create').mockResolvedValueOnce({ message: 'User created successfully' });

      const result = await usersController.create(adminCreateUserDto);

      expect(userService.create).toHaveBeenCalledWith(adminCreateUserDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      jest.spyOn(userService, 'count').mockResolvedValueOnce(5);

      const result = await usersController.count();

      expect(userService.count).toHaveBeenCalledWith();
      expect(result).toEqual(5);
    });
  });

  describe('findAll', () => {
    it('should return a list', async () => {
      const users: User[] = [
        new User({
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          email: 'test@test.com',
          role: Role.USER,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        }),
      ];
      jest.spyOn(userService, 'findAll').mockResolvedValueOnce(users);

      const result = await usersController.findAll();

      expect(userService.findAll).toHaveBeenCalledWith();
      expect(result).toEqual(users);
    });
  });

  describe('findOneByAdmin', () => {
    it('should return an user', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const user: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      const result = await usersController.findOneByAdmin(id);

      expect(userService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const req = { user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed' } } };
      const user: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce(user);

      const result = await usersController.findOne(req);

      expect(userService.findOne).toHaveBeenCalledWith(req.user.user.id);
      expect(result).toEqual(user);
    });
  });

  describe('findUserRequests', () => {
    it("should return a list with user's reservations by ID", async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const envReservations: EnvReservation[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          status: EnvReservationStatus.PENDING,
          user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          date_in: new Date(),
          date_out: new Date(),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];
      jest.spyOn(userService, 'findEnvReservationsById').mockResolvedValueOnce(envReservations);

      const result = await usersController.findUserReservations(id, undefined);

      expect(userService.findEnvReservationsById).toHaveBeenCalledWith(id);
      expect(result).toEqual(envReservations);
    });

    it("should return a list with user's reservations by user from request", async () => {
      const req = { user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed' } } };
      const envReservations: EnvReservation[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          status: EnvReservationStatus.PENDING,
          user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          date_in: new Date(),
          date_out: new Date(),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];
      jest.spyOn(userService, 'findEnvReservationsById').mockResolvedValueOnce(envReservations);

      const result = await usersController.findUserReservations(undefined, req);

      expect(userService.findEnvReservationsById).toHaveBeenCalledWith(req.user.user.id);
      expect(result).toEqual(envReservations);
    });
  });

  describe('updateByAdmin', () => {
    it('should update and return an user', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const adminUpdateUserDto: AdminUpdateUserDto = { password: 'newPassword' };
      const user: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userService, 'updateByAdmin').mockResolvedValueOnce(user);

      const result = await usersController.updateByAdmin(id, adminUpdateUserDto);

      expect(userService.updateByAdmin).toHaveBeenCalledWith(id, adminUpdateUserDto);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update and return an user', async () => {
      const req = { user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed' } } };
      const updateUserDto: UpdateUserDto = { password: 'newPassword' };
      const user: User = new User({
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        email: 'test@test.com',
        role: Role.USER,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      });

      jest.spyOn(userService, 'update').mockResolvedValueOnce(user);

      const result = await usersController.update(req, updateUserDto);

      expect(userService.update).toHaveBeenCalledWith(req.user.user.id, updateUserDto, undefined);
      expect(result).toEqual(user);
    });
  });

  describe('createPassword', () => {
    it('should return an access token', async () => {
      const token = '1f65sdaf4165d1f65gsd5616';
      const createUserPasswordDto: CreateUserPasswordDto = {
        password: 'newPassword',
        passwordConfirmation: 'newPassword',
      };

      jest.spyOn(userService, 'createPassword').mockResolvedValueOnce({ access_token: 'd68bv4cx6b468cxf486' });

      const result = await usersController.createPassword(token, createUserPasswordDto);

      expect(userService.createPassword).toHaveBeenCalledWith(token, createUserPasswordDto);
      expect(result).toEqual({ access_token: 'd68bv4cx6b468cxf486' });
    });
  });

  describe('sendResetPassEmail', () => {
    it('should update and return success message', async () => {
      const email = 'test@tes.com';

      jest.spyOn(userService, 'sendResetPassEmail').mockResolvedValueOnce({
        message: 'An email with recovery password instructions will be sent',
      });

      const result = await usersController.sendResetPassEmail(email);

      expect(userService.sendResetPassEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        message: 'An email with recovery password instructions will be sent',
      });
    });
  });

  describe('resetPassword', () => {
    it('should update and return an access token', async () => {
      const token = '1f65sdaf4165d1f65gsd5616';
      const resetPasswordDto: ResetPasswordDto = { password: 'newPassword', passwordConfirmation: 'newPassword' };

      jest.spyOn(userService, 'resetPassword').mockResolvedValueOnce({ access_token: 'd68bv4cx6b468cxf486' });

      const result = await usersController.resetPassword(token, resetPasswordDto);

      expect(userService.resetPassword).toHaveBeenCalledWith(token, resetPasswordDto);
      expect(result).toEqual({ access_token: 'd68bv4cx6b468cxf486' });
    });
  });

  describe('remove', () => {
    it('should soft delete and return a success message', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

      jest.spyOn(userService, 'remove').mockResolvedValueOnce({ message: 'User deleted successfully' });

      const result = await usersController.remove(id);

      expect(userService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});
