import { EnvironmentsController } from './environments.controller';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { EnvironmentStatus } from './entities/status.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';

describe('EnvironmentsController', () => {
  let environmentsController: EnvironmentsController;
  let mockEnvironmentService: jest.Mocked<IEnvironmentService>;

  beforeEach(() => {
    mockEnvironmentService = {
      count: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findEnvReservationsById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<IEnvironmentService>;

    environmentsController = new EnvironmentsController(mockEnvironmentService);
  });

  describe('create', () => {
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

  describe('count', () => {
    it('should return the total', async () => {
      mockEnvironmentService.count.mockResolvedValue(5);

      const result = await environmentsController.count();

      expect(mockEnvironmentService.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('find', () => {
    it('should find all environments', async () => {
      const environments: Environment[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          name: 'Environment 1',
          status: EnvironmentStatus.AVAILABLE,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          env_requests: [],
        },
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          name: 'Environment 1',
          status: EnvironmentStatus.AVAILABLE,
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

  describe('findOne', () => {
    it('should return the environment with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: EnvironmentStatus.DISABLED,
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

  describe('findEnvReservationsById', () => {
    it("should return the environment's requests", async () => {
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

      mockEnvironmentService.findEnvReservationsById.mockResolvedValue(foundEnvironmentRequests);

      const result = await environmentsController.findEnvReservationsById(id);

      expect(mockEnvironmentService.findEnvReservationsById).toHaveBeenCalledWith(id);
      expect(result).toBe(foundEnvironmentRequests);
    });
  });

  describe('update', () => {
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
        status: EnvironmentStatus.DISABLED,
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

  describe('remove', () => {
    it('should remove the environment with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

      mockEnvironmentService.remove.mockResolvedValue({ message: 'Environment deleted successfully' });

      const result = await environmentsController.remove(id);

      expect(mockEnvironmentService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Environment deleted successfully' });
    });
  });
});
