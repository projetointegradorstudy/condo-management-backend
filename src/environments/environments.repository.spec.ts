import { EnvironmentRepository } from './environments.repository';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';
import { Status } from './entities/status.enum';

describe('EnvironmentRepository', () => {
  let environmentRepository: EnvironmentRepository;
  let mockEnvironmentRepository: jest.Mocked<Repository<Environment>>;

  beforeEach(() => {
    mockEnvironmentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<Environment>>;

    environmentRepository = new EnvironmentRepository(mockEnvironmentRepository);
  });

  describe('createEnvironment', () => {
    it('should create and save a new environment', async () => {
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

      mockEnvironmentRepository.create.mockReturnValue(createEnvironmentDto);
      mockEnvironmentRepository.save.mockResolvedValue(createdEnvironment);

      const result = await environmentRepository.createEnvironment(createEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(mockEnvironmentRepository.save).toHaveBeenCalledWith(createEnvironmentDto);
      expect(result).toEqual(createdEnvironment);
    });
  });

  describe('findById', () => {
    it('should find an environment by id', async () => {
      const id = '12345';
      const foundEnvironment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      mockEnvironmentRepository.findOne.mockResolvedValue(foundEnvironment);

      const result = await environmentRepository.findById(id);

      expect(mockEnvironmentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(foundEnvironment);
    });
  });

  describe('updateEnvironment', () => {
    it('should update and return an environment', async () => {
      const id = '12345';
      const updateEnvironmentDto: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      const updatedEnvironment: Environment = {
        id: '12345',
        name: 'Env Test',
        status: Status.AVAILABLE,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvironmentRepository.create.mockReturnValue(updateEnvironmentDto);
      mockEnvironmentRepository.update.mockResolvedValue(undefined);
      mockEnvironmentRepository.findOne.mockResolvedValue(updatedEnvironment);

      const result = await environmentRepository.updateEnvironment(id, updateEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(updateEnvironmentDto);
      expect(mockEnvironmentRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
      expect(mockEnvironmentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedEnvironment);
    });
  });
  describe('findEnvironments', () => {
    it('should find environments by status', async () => {
      const status = Status.AVAILABLE;

      const foundEnvironments: Environment[] = [
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

      mockEnvironmentRepository.find.mockResolvedValue(foundEnvironments);

      const result = await environmentRepository.findEnvironments(status);

      expect(mockEnvironmentRepository.find).toHaveBeenCalledWith({ where: { status } });
      expect(result).toEqual(foundEnvironments);
    });

    it('should find all environments when status is not provided', async () => {
      const foundEnvironments: Environment[] = [
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
          status: Status.LOCKED,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvironmentRepository.find.mockResolvedValue(foundEnvironments);

      const result = await environmentRepository.findEnvironments(undefined);

      expect(mockEnvironmentRepository.find).toHaveBeenCalledWith();
      expect(result).toEqual(foundEnvironments);
    });
  });
});
