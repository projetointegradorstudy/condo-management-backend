import { EnvironmentRepository } from './environments.repository';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';
import { Status } from './entities/status.enum';
import { BaseRepository } from 'src/base/base.repository';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';

describe('EnvironmentRepository', () => {
  class MockEnvironmentRepository extends BaseRepository<Environment> {
    constructor() {
      const mockRepository = {} as Repository<Environment>;
      super(mockRepository);
    }
    count = jest.fn();
    create = jest.fn();
    save = jest.fn();
    find = jest.fn();
    findOne = jest.fn();
    findOneBy = jest.fn();
    update = jest.fn();
    softDelete = jest.fn();
  }

  let environmentRepository: EnvironmentRepository;
  let mockEnvironmentRepository: MockEnvironmentRepository;

  beforeEach(() => {
    mockEnvironmentRepository = new MockEnvironmentRepository();
    environmentRepository = new EnvironmentRepository(mockEnvironmentRepository as unknown as Repository<Environment>);
  });

  describe('When create environment', () => {
    it('should create and save a new environment', async () => {
      const createEnvironmentDto: CreateEnvironmentDto = {
        name: 'name test',
        description: 'description test',
        capacity: 4,
      };
      const createdEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        description: 'description test',
        status: Status.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        env_requests: [],
      };

      mockEnvironmentRepository.create.mockReturnValue(createdEnvironment);
      mockEnvironmentRepository.save.mockResolvedValue(createdEnvironment);

      const result = await environmentRepository.create(createEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(createEnvironmentDto);
      expect(mockEnvironmentRepository.save).toHaveBeenCalledWith(createdEnvironment);
      expect(result).toEqual(createdEnvironment);
    });
  });

  describe('When count environments', () => {
    it('should count and bring the total', async () => {
      mockEnvironmentRepository.count.mockResolvedValue(5);

      const result = await environmentRepository.count();

      expect(mockEnvironmentRepository.count).toHaveBeenCalled();
      expect(result).toEqual(5);
    });
  });

  describe('When search for all environments', () => {
    it('should find all environments by specific status', async () => {
      const status = Status.AVAILABLE;
      const foundEnvironments: Environment[] = [
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

      mockEnvironmentRepository.find.mockResolvedValue(foundEnvironments);

      const result = await environmentRepository.find({ where: { status } });

      expect(mockEnvironmentRepository.find).toHaveBeenCalledWith({ where: { status } });
      expect(result).toEqual(foundEnvironments);
    });

    it('should find all environments', async () => {
      const foundEnvironments: Environment[] = [
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
          id: '681cedb1-0ecd-4ga5-2414-bee5746hcffd',
          name: 'Environment 2',
          status: Status.LOCKED,
          capacity: 4,
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
          env_requests: [],
        },
      ];

      mockEnvironmentRepository.find.mockResolvedValue(foundEnvironments);

      const result = await environmentRepository.find();

      expect(mockEnvironmentRepository.find).toHaveBeenCalled();
      expect(result).toEqual(foundEnvironments);
    });
  });

  describe('When search one environment by ID', () => {
    it('should find an environment', async () => {
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
      mockEnvironmentRepository.findOne.mockResolvedValue(foundEnvironment);

      const result = await environmentRepository.findBy({ where: { id } });

      expect(mockEnvironmentRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(foundEnvironment);
    });
  });

  describe('When update an environment', () => {
    it('should apply changes and bring the updated environment', async () => {
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

      mockEnvironmentRepository.create.mockReturnValue(updateEnvironmentDto);
      mockEnvironmentRepository.findOneBy.mockResolvedValue(updatedEnvironment);

      const result = await environmentRepository.update({ id }, updateEnvironmentDto);

      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith(updateEnvironmentDto);
      expect(mockEnvironmentRepository.update).toHaveBeenCalledWith({ id }, updateEnvironmentDto);
      expect(mockEnvironmentRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(updatedEnvironment);
    });
  });

  describe('When soft delete one environment by ID', () => {
    it('should return soft deleted environment', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const softDeletedEnvironment: Environment = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        name: 'name test',
        status: Status.DISABLED,
        capacity: 4,
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        deleted_at: new Date(Date.now()),
        env_requests: [],
      };

      mockEnvironmentRepository.softDelete.mockResolvedValue(softDeletedEnvironment);

      const result = await environmentRepository.softDelete(id);

      expect(mockEnvironmentRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(softDeletedEnvironment);
    });
  });
});
