import { EnvironmentsController } from './environments.controller';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { Status } from './entities/status.enum';
import { EnvRequest } from 'src/env-requests/entities/env-request.entity';
import { EnvRequestStatus } from 'src/env-requests/entities/status.enum';

describe('EnvironmentsController', () => {
  let environmentsController: EnvironmentsController;
  let mockEnvironmentService: jest.Mocked<IEnvironmentService>;

  beforeEach(() => {
    mockEnvironmentService = {
      count: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findEnvRequestsById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<IEnvironmentService>;

    environmentsController = new EnvironmentsController(mockEnvironmentService);
  });

  describe('When create an environment', () => {
    it('should create an environment', async () => {
      const createEnvironmentDto: CreateEnvironmentDto = {
        name: 'name test',
        description: 'description test',
        capacity: 4,
      };

      mockEnvironmentService.create.mockResolvedValue({ message: 'Environment created successfully' });

      const result = await environmentsController.create(createEnvironmentDto);

      expect(mockEnvironmentService.create).toHaveBeenCalledWith(createEnvironmentDto, undefined);
      expect(result).toEqual({ message: 'Environment created successfully' });
    });
  });

  describe('When count environments', () => {
    it('should return the total', async () => {
      mockEnvironmentService.count.mockResolvedValue(5);

      const result = await environmentsController.count();

      expect(mockEnvironmentService.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('When search for all environments', () => {
    it('should find all environments', async () => {
      const environments: Environment[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          name: 'Environment 1',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          env_requests: [],
        },
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          name: 'Environment 1',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          env_requests: [],
        },
      ];

      mockEnvironmentService.findAll.mockResolvedValue(environments);

      const result = await environmentsController.findAll();

      expect(mockEnvironmentService.findAll).toHaveBeenCalled();
      expect(result).toBe(environments);
    });
  });

  describe('When search one environment by ID', () => {
    it('should return the environment with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: Status.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_requests: [],
      };

      mockEnvironmentService.findOne.mockResolvedValue(foundEnvironment);

      const result = await environmentsController.findOne(id);

      expect(mockEnvironmentService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(foundEnvironment);
    });
  });

  describe('When search env requests by environment ID', () => {
    it("should return the environment's requests", async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvironmentRequests: EnvRequest[] = [
        {
          id: '5e00de71-b48b-41fd-b26c-687b02f27ef8',
          status: EnvRequestStatus.PENDING,
          user_id: 'f3fcdfdd-b7d6-4fce-b5c8-baf893ab946b',
          environment_id: '2ed45c4d-d2cd-40eb-b213-587faf726287',
          date_in: new Date(Date.now()),
          date_out: new Date(Date.now()),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvironmentService.findEnvRequestsById.mockResolvedValue(foundEnvironmentRequests);

      const result = await environmentsController.findEnvRequestsById(id);

      expect(mockEnvironmentService.findEnvRequestsById).toHaveBeenCalledWith(id);
      expect(result).toBe(foundEnvironmentRequests);
    });
  });

  describe('When update an environment by ID', () => {
    it('should update the environment with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'updated name',
        description: 'updated description',
      };

      const updatedEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'updated name',
        description: 'updated description',
        status: Status.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_requests: [],
      };

      mockEnvironmentService.update.mockResolvedValue(updatedEnvironment);

      const result = await environmentsController.update(id, updateEnvironmentDto);

      expect(mockEnvironmentService.update).toHaveBeenCalledWith(id, updateEnvironmentDto, undefined);
      expect(result).toBe(updatedEnvironment);
    });
  });

  describe('When remove one environment by ID', () => {
    it('should remove the environment with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

      mockEnvironmentService.remove.mockResolvedValue({ message: 'Environment deleted successfully' });

      const result = await environmentsController.remove(id);

      expect(mockEnvironmentService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Environment deleted successfully' });
    });
  });
});
