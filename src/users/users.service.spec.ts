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
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    mockS3Service = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<IS3Service>;

    mockEmailService = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<IEmailService>;

    mockAuthService = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    usersService = new UsersService(mockUserRepository, mockS3Service, mockEmailService, mockAuthService);
  });

  describe('create', () => {
    it('should create an environment without image', async () => {
      const createEnvironmentDto: CreateUserPasswordDto = {
        name: 'name test',
        description: 'description test',
        capacity: 4,
      };
      const createdEnvironment: User = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name testt',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_requests: [],
      };

      mockUserRepository.create.mockResolvedValue(createdEnvironment);

      const result = await usersService.create(createEnvironmentDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toEqual({ message: 'User created successfully' });
    });
  });

  // describe('count', () => {
  //   it('should return the total', async () => {
  //     mockUserRepository.count.mockResolvedValue(5);

  //     const result = await usersService.count();

  //     expect(mockUserRepository.count).toHaveBeenCalled();
  //     expect(result).toBe(5);
  //   });
  // });

  // describe('findAll', () => {
  //   it('should find all users by specific status', async () => {
  //     const status = EnvironmentStatus.AVAILABLE;
  //     const users: User[] = [
  //       {
  //         id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //         name: 'User 1',
  //         status: EnvironmentStatus.AVAILABLE,
  //         capacity: 4,
  //         created_at: new Date(Date.now()),
  //         updated_at: new Date(Date.now()),
  //         env_requests: [],
  //       },
  //     ];

  //     mockUserRepository.find.mockResolvedValue(users);

  //     const result = await usersService.findAll(status);

  //     expect(mockUserRepository.find).toHaveBeenCalledWith({ where: { status } });
  //     expect(result).toEqual(users);
  //   });
  // });

  // describe('findOne', () => {
  //   it('should return an environment', async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const foundEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'name test',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(foundEnvironment);

  //     const result = await usersService.findOne(id);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(result).toEqual(foundEnvironment);
  //   });

  //   it('should throw NotFoundException when result is not found', async () => {
  //     const id = 'invalid uuid';

  //     mockUserRepository.findBy.mockResolvedValue(undefined);

  //     await expect(usersService.findOne(id)).rejects.toThrowError(NotFoundException);
  //   });
  // });

  // describe('findEnvReservationsById', () => {
  //   it("should return the environment's requests", async () => {
  //     const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
  //     const foundEnvironmentRequests: EnvReservation[] = [
  //       {
  //         id: '5e00de71-b48b-41fd-b26c-687b02f27ef8',
  //         status: EnvReservationStatus.PENDING,
  //         user_id: 'f3fcdfdd-b7d6-4fce-b5c8-baf893ab946b',
  //         environment_id: '2ed45c4d-d2cd-40eb-b213-587faf726287',
  //         date_in: new Date(Date.now()),
  //         date_out: new Date(Date.now()),
  //         created_at: new Date(Date.now()),
  //         updated_at: new Date(Date.now()),
  //       },
  //     ];
  //     const existingEnvironment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'test name',
  //       description: 'test description',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: foundEnvironmentRequests,
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(existingEnvironment);

  //     const result = await usersService.findEnvReservationsById(id);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id }, relations: ['env_requests'] });
  //     expect(result).toEqual(foundEnvironmentRequests);
  //   });

  //   it('should throw NotFoundException when result is not found', async () => {
  //     const id = 'invalid uuid';

  //     mockUserRepository.findBy.mockResolvedValue(undefined);

  //     await expect(usersService.findEnvReservationsById(id)).rejects.toThrowError(NotFoundException);
  //   });
  // });

  // describe('update', () => {
  //   it('should update an environment without image and return it', async () => {
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

  //   it('should update an environment with image and return it', async () => {
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
  //     const environment: User = {
  //       id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
  //       name: 'name test',
  //       status: EnvironmentStatus.DISABLED,
  //       capacity: 4,
  //       created_at: new Date(Date.now()),
  //       updated_at: new Date(Date.now()),
  //       env_requests: [],
  //     };

  //     mockUserRepository.findBy.mockResolvedValue(environment);
  //     mockUserRepository.softDelete.mockResolvedValue(undefined);

  //     const result = await usersService.remove(id);

  //     expect(mockUserRepository.findBy).toHaveBeenCalledWith({ where: { id } });
  //     expect(mockUserRepository.softDelete).toHaveBeenCalledWith(environment.id);
  //     expect(result).toEqual({ message: 'User deleted successfully' });
  //   });

  //   it('should throw NotFoundException when result is not found', async () => {
  //     const id = 'invalid uuid';

  //     mockUserRepository.findBy.mockResolvedValue(undefined);

  //     await expect(usersService.remove(id)).rejects.toThrowError(NotFoundException);
  //   });
  // });
});
