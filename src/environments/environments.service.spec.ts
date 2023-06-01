import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EnvironmentsService } from './environments.service';
import { IEnvironmentRepository } from './interfaces/environments.repository';
import { Environment } from './entities/environment.entity';
import { Status } from './entities/status.enum';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

describe('EnvironmentsService', () => {
  let environmentsService: EnvironmentsService;
  let mockEnvironmentRepository: jest.Mocked<IEnvironmentRepository>;

  beforeEach(() => {
    mockEnvironmentRepository = {
      createEnvironment: jest.fn(),
      findEnvironments: jest.fn(),
      findById: jest.fn(),
      updateEnvironment: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IEnvironmentRepository>;

    environmentsService = new EnvironmentsService(mockEnvironmentRepository);
  });

  describe('create', () => {
    it('should create and return a new environment', async () => {
      const createEnvironmentDto: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      const createdEnvironment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.createEnvironment.mockResolvedValue(createdEnvironment);

      const result = await environmentsService.create(createEnvironmentDto);

      expect(mockEnvironmentRepository.createEnvironment).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toEqual(createdEnvironment);
    });
  });

  describe('findAll', () => {
    it('should call environmentRepository.findEnvironments with the provided status and return the environments', async () => {
      const status = Status.AVAILABLE;

      const environments: Environment[] = [
        {
          id: '1',
          name: 'Environment 1',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
        {
          id: '2',
          name: 'Environment 2',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvironmentRepository.findEnvironments.mockResolvedValue(environments);

      const result = await environmentsService.findAll(status);

      expect(mockEnvironmentRepository.findEnvironments).toHaveBeenCalledWith(status);
      expect(result).toEqual(environments);
    });

    it('should throw BadRequestException when an invalid status is provided', async () => {
      const invalidStatus = 'invalid';

      mockEnvironmentRepository.findEnvironments.mockResolvedValue([]);

      await expect(environmentsService.findAll(invalidStatus)).rejects.toThrowError(BadRequestException);
      expect(mockEnvironmentRepository.findEnvironments).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an existing environment', async () => {
      const id = '12345';
      const foundEnvironment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.findById.mockResolvedValue(foundEnvironment);

      const result = await environmentsService.findOne(id);

      expect(mockEnvironmentRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(foundEnvironment);
    });

    it('should throw NotFoundException when environment is not found', async () => {
      const id = 'not found';

      mockEnvironmentRepository.findById.mockResolvedValue(undefined);

      await expect(environmentsService.findOne(id)).rejects.toThrowError(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update an environment', async () => {
      const id = '123';
      const existingEnvironment: Environment = {
        id: '123',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'Env Test',
        status: Status.PENDING,
        capacity: 4,
      };

      const updatedEnvironment: Environment = {
        id: '123',
        name: 'Env Test',
        status: Status.PENDING,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.findById.mockResolvedValue(existingEnvironment);
      mockEnvironmentRepository.updateEnvironment.mockResolvedValue(updatedEnvironment);

      const result = await environmentsService.update(id, updateEnvironmentDto);

      expect(mockEnvironmentRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEnvironmentRepository.updateEnvironment).toHaveBeenCalledWith(id, updateEnvironmentDto);
      expect(result).toEqual(updatedEnvironment);
    });

    it('should throw NotFoundException if environment is not found', async () => {
      const id = '123';
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
      };

      mockEnvironmentRepository.findById.mockResolvedValue(null);

      await expect(environmentsService.update(id, updateEnvironmentDto)).rejects.toThrowError(NotFoundException);
      expect(mockEnvironmentRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEnvironmentRepository.updateEnvironment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for non-compliant status', async () => {
      const id = '123';
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'Env Test',
        status: Status.PENDING,
        capacity: 4,
      };
      const existingEnvironment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.LOCKED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.findById.mockResolvedValue(existingEnvironment);

      await expect(environmentsService.update(id, updateEnvironmentDto)).rejects.toThrowError(BadRequestException);
      expect(mockEnvironmentRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEnvironmentRepository.updateEnvironment).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an existing environment', async () => {
      const id = '12345';
      const environment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.findById.mockResolvedValue(environment);
      mockEnvironmentRepository.delete.mockResolvedValue(undefined);

      const result = await environmentsService.remove(id);

      expect(mockEnvironmentRepository.findById).toHaveBeenCalledWith(id);
      expect(mockEnvironmentRepository.delete).toHaveBeenCalledWith(environment.id);
      expect(result).toEqual({ message: 'Environment deleted successfully' });
    });

    it('should throw NotFoundException when environment is not found', async () => {
      const id = 'not found';

      mockEnvironmentRepository.findById.mockResolvedValue(undefined);

      await expect(environmentsService.remove(id)).rejects.toThrowError(NotFoundException);
    });
  });
});
