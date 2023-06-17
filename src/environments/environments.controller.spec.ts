import { EnvironmentsController } from './environments.controller';
import { IEnvironmentService } from './interfaces/environments.service';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { Status } from './entities/status.enum';

describe('EnvironmentsController', () => {
  let environmentsController: EnvironmentsController;
  let mockEnvironmentService: jest.Mocked<IEnvironmentService>;

  beforeEach(() => {
    mockEnvironmentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<IEnvironmentService>;

    environmentsController = new EnvironmentsController(mockEnvironmentService);
  });

  describe('create', () => {
    it('should create an environment', async () => {
      const createEnvironmentDto: CreateEnvironmentDto = {
        name: 'Test Environment',
        description: 'Test environment description',
        status: Status.AVAILABLE,
        capacity: 4,
      };

      const createdEnvironment: Environment = {
        id: '12345',
        name: 'Test Environment',
        description: 'Test environment description',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentService.create.mockResolvedValue(createdEnvironment);

      const result = await environmentsController.create(createEnvironmentDto);

      expect(mockEnvironmentService.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toBe(createdEnvironment);
    });
  });

  describe('findAll', () => {
    it('should return all environments', async () => {
      const environments: Environment[] = [
        {
          id: '12345',
          name: 'Environment 1',
          description: 'Environment 1 description',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
        {
          id: '67890',
          name: 'Environment 2',
          description: 'Environment 2 description',
          status: Status.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvironmentService.findAll.mockResolvedValue(environments);

      const result = await environmentsController.findAll();

      expect(mockEnvironmentService.findAll).toHaveBeenCalled();
      expect(result).toBe(environments);
    });
  });

  describe('findOne', () => {
    it('should return the environment with the specified id', async () => {
      const id = '12345';

      const foundEnvironment: Environment = {
        id: '12345',
        name: 'Test Environment',
        description: 'Test environment description',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentService.findOne.mockResolvedValue(foundEnvironment);

      const result = await environmentsController.findOne(id);

      expect(mockEnvironmentService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(foundEnvironment);
    });
  });

  describe('update', () => {
    it('should update the environment with the specified id', async () => {
      const id = '12345';
      const updateEnvironmentDto: UpdateEnvironmentDto = {
        name: 'Updated Environment',
        description: 'Updated environment description',
      };

      const updatedEnvironment: Environment = {
        id: '12345',
        name: 'Updated Environment',
        description: 'Updated environment description',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentService.update.mockResolvedValue(updatedEnvironment);

      const result = await environmentsController.update(id, updateEnvironmentDto);

      expect(mockEnvironmentService.update).toHaveBeenCalledWith(id, updateEnvironmentDto);
      expect(result).toBe(updatedEnvironment);
    });
  });

  describe('remove', () => {
    it('should remove the environment with the specified id', async () => {
      const id = '12345';

      mockEnvironmentService.remove.mockResolvedValue({ message: 'Environment deleted successfully' });

      const result = await environmentsController.remove(id);

      expect(mockEnvironmentService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Environment deleted successfully' });
    });
  });
});
