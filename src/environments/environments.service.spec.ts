import { NotFoundException } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { IEnvironmentRepository } from './interfaces/environments-repository.interface';
import { Environment } from './entities/environment.entity';
import { EnvironmentStatus } from './entities/status.enum';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { createMockImage } from 'src/utils/upload/mocks/image.mock';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { Not } from 'typeorm';

describe('EnvironmentsService', () => {
  let environmentsService: EnvironmentsService;
  let mockEnvironmentRepository: jest.Mocked<IEnvironmentRepository>;
  let mockS3Service: jest.Mocked<IS3Service>;

  beforeEach(() => {
    mockEnvironmentRepository = {
      count: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<IEnvironmentRepository>;

    mockS3Service = {
      uploadFile: jest.fn(),
    } as unknown as jest.Mocked<IS3Service>;

    environmentsService = new EnvironmentsService(mockEnvironmentRepository, mockS3Service);
  });

  describe('create', () => {
    it('should create an environment without image', async () => {
      const createEnvironmentDto: CreateEnvironmentDto = {
        name: 'name test',
        description: 'description test',
        capacity: 4,
      };
      const createdEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.create.mockResolvedValue(createdEnvironment);

      const result = await environmentsService.create(createEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toEqual({ message: 'Environment created successfully' });
    });

    it('should create an environment with image', async () => {
      const image: Express.Multer.File = createMockImage();
      const createEnvironmentDto: CreateEnvironmentDto = {
        name: 'name test',
        description: 'description test',
        capacity: 4,
      };
      const uploadedImage: AWS.S3.ManagedUpload.SendData = {
        Location: 'https://condo-tests.s3.amazonaws.com/attach-teste.png',
        Bucket: 'bucket-teste',
        Key: 'teste-image.png',
        ETag: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
      };
      const createdEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name testt',
        status: EnvironmentStatus.DISABLED,
        image: uploadedImage.Location,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.create.mockResolvedValue(createdEnvironment);
      mockS3Service.uploadFile.mockResolvedValue(uploadedImage);

      const result = await environmentsService.create(createEnvironmentDto, image);

      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(image);
      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toEqual({ message: 'Environment created successfully' });
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      mockEnvironmentRepository.count.mockResolvedValue(5);

      const result = await environmentsService.count();

      expect(mockEnvironmentRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should find all environments by specific status', async () => {
      const user = { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed' };
      const status = EnvironmentStatus.AVAILABLE;
      const environments: Environment[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          name: 'Environment 1',
          status: EnvironmentStatus.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          env_reservations: [],
        },
      ];

      mockEnvironmentRepository.find.mockResolvedValue(environments);

      const result = await environmentsService.findAll(user, status);

      expect(mockEnvironmentRepository.find).toHaveBeenCalledWith({
        where: { status: Not(EnvironmentStatus.DISABLED) },
      });
      expect(result).toEqual(environments);
    });
  });

  describe('findOne', () => {
    it('should return an environment', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(foundEnvironment);

      const result = await environmentsService.findOne(id);

      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(foundEnvironment);
    });

    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockEnvironmentRepository.findBy.mockResolvedValue(undefined);

      await expect(environmentsService.findOne(id)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findEnvReservationsById', () => {
    it("should return the environment's reservationenv_reservations", async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvironmentRequests: EnvReservation[] = [
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
      const existingEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'test name',
        description: 'test description',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: foundEnvironmentRequests,
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(existingEnvironment);

      const result = await environmentsService.findEnvReservationsById(id);

      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id }, relations: ['env_reservations'] });
      expect(result).toEqual(foundEnvironmentRequests);
    });

    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockEnvironmentRepository.findBy.mockResolvedValue(undefined);

      await expect(environmentsService.findEnvReservationsById(id)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'updated name',
        description: 'updated description',
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(null);

      await expect(environmentsService.update(id, updateEnvironmentDto)).rejects.toThrowError(NotFoundException);
      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockEnvironmentRepository.update).not.toHaveBeenCalled();
    });

    it('should update an environment without image and return it', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const existingEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'old name',
        description: 'old description',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'updated name',
        description: 'updated description',
      };

      const updatedEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'updated name',
        description: 'updated description',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(existingEnvironment);
      mockEnvironmentRepository.update.mockResolvedValue(updatedEnvironment);

      const result = await environmentsService.update(id, updateEnvironmentDto);

      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockEnvironmentRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
      expect(result).toEqual(updatedEnvironment);
    });

    it('should update an environment with image and return it', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const image: Express.Multer.File = createMockImage();
      const existingEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'old name',
        description: 'old description',
        image: 'any image location',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'updated name',
        description: 'updated description',
      };
      const uploadedImage: AWS.S3.ManagedUpload.SendData = {
        Location: 'https://condo-tests.s3.amazonaws.com/attach-teste.png',
        Bucket: 'bucket-teste',
        Key: 'teste-image.png',
        ETag: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
      };
      const updatedEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'updated name',
        description: 'updated description',
        status: EnvironmentStatus.DISABLED,
        image: uploadedImage.Location,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(existingEnvironment);
      mockS3Service.uploadFile.mockResolvedValue(uploadedImage);
      mockEnvironmentRepository.update.mockResolvedValue(updatedEnvironment);

      const result = await environmentsService.update(id, updateEnvironmentDto, image);

      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockS3Service.uploadFile).toHaveBeenCalledWith(image, existingEnvironment.image);
      expect(mockEnvironmentRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
      expect(result).toEqual(updatedEnvironment);
    });
  });

  describe('remove', () => {
    it('should return a success message', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const environment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: EnvironmentStatus.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_reservations: [],
      };

      mockEnvironmentRepository.findBy.mockResolvedValue(environment);
      mockEnvironmentRepository.softDelete.mockResolvedValue(undefined);

      const result = await environmentsService.remove(id);

      expect(mockEnvironmentRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockEnvironmentRepository.softDelete).toHaveBeenCalledWith(environment.id);
      expect(result).toEqual({ message: 'Environment deleted successfully' });
    });

    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockEnvironmentRepository.findBy.mockResolvedValue(undefined);

      await expect(environmentsService.remove(id)).rejects.toThrowError(NotFoundException);
    });
  });
});
