import { EnvironmentRepository } from './env-reservations.repository';
import { Repository } from 'typeorm';
import { Environment } from './entities/env-reservation.entity';
import { Status } from './entities/status.enum';
import { BaseRepository } from 'src/base-entity/base-entity.repository';

describe('EnvironmentRepository', () => {
  class MockEnvironmentRepository extends BaseRepository<Environment> {
    constructor() {
      const mockRepository = {} as Repository<Environment>;
      super(mockRepository);
    }

    create = jest.fn();
    save = jest.fn();
    findOneBy = jest.fn();
    find = jest.fn();
    update = jest.fn();
    softDelete = jest.fn();
  }

  let environmentRepository: EnvironmentRepository;
  let mockEnvironmentRepository: MockEnvironmentRepository;

  beforeEach(() => {
    mockEnvironmentRepository = new MockEnvironmentRepository();
    environmentRepository = new EnvironmentRepository(mockEnvironmentRepository as unknown as Repository<Environment>);
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

      const result = await environmentRepository.create(createEnvironmentDto);

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
      mockEnvironmentRepository.findOneBy.mockResolvedValue(foundEnvironment);

      const result = await environmentRepository.findBy({ id });

      expect(mockEnvironmentRepository.findOneBy).toHaveBeenCalledWith({ id });
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
      mockEnvironmentRepository.findOneBy.mockResolvedValue(updatedEnvironment);

      const result = await environmentRepository.update({ id }, updateEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(updateEnvironmentDto);
      expect(mockEnvironmentRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
      expect(mockEnvironmentRepository.findOneBy).toHaveBeenCalledWith({ id });
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

      const result = await environmentRepository.find({ where: { status } });

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

      const result = await environmentRepository.find();

      expect(mockEnvironmentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(foundEnvironments);
    });
  });
});
