import { Repository, UpdateResult } from 'typeorm';
import { BaseRepository } from './base.repository';

export class MockBaseRepository<T> extends BaseRepository<T> {
  constructor(mockedEntity: Repository<T>) {
    super(mockedEntity);
  }
}
describe('BaseRepository', () => {
  let mockBaseRepository: MockBaseRepository<any>;
  let mockedEntityRepository: Repository<any>;

  beforeEach(() => {
    mockedEntityRepository = {
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as Repository<any>;
    mockBaseRepository = new MockBaseRepository(mockedEntityRepository);
  });

  describe('create', () => {
    it('should create and save the entity', async () => {
      const data = { name: 'Test Entity' };
      const createdEntity = { id: 1, ...data };

      jest.spyOn(mockedEntityRepository, 'create').mockReturnValue(createdEntity);
      jest.spyOn(mockedEntityRepository, 'save').mockResolvedValue(createdEntity);

      const result = await mockBaseRepository.create(data);
      expect(mockedEntityRepository.create).toHaveBeenCalledWith(data);
      expect(mockedEntityRepository.save).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(createdEntity);
    });
  });

  describe('count', () => {
    it('should return the count of entities', async () => {
      const count = 5;

      jest.spyOn(mockedEntityRepository, 'count').mockResolvedValue(count);

      const result = await mockBaseRepository.count();

      expect(mockedEntityRepository.count).toHaveBeenCalled();
      expect(result).toEqual(count);
    });
  });

  describe('find', () => {
    it('should return an array of entities', async () => {
      const foundEntities = [{ id: 1 }, { id: 2 }, { id: 3 }];

      jest.spyOn(mockedEntityRepository, 'find').mockResolvedValue(foundEntities);

      const result = await mockBaseRepository.find();

      expect(mockedEntityRepository.find).toHaveBeenCalled();
      expect(result).toEqual(foundEntities);
    });
  });

  describe('findBy', () => {
    it('should return an entity that matches the given criteria', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const entity = { id, name: 'Test Entity' };

      jest.spyOn(mockedEntityRepository, 'findOne').mockResolvedValue(entity);

      const result = await mockBaseRepository.findBy({ where: { id } });

      expect(mockedEntityRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(entity);
    });
  });

  describe('update', () => {
    it('should update and return the updated entity', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const partialEntity = { name: 'Updated name' };
      const updatedEntity = { id, ...partialEntity };

      jest.spyOn(mockedEntityRepository, 'create').mockReturnValue(updatedEntity);
      jest.spyOn(mockedEntityRepository, 'update');
      jest.spyOn(mockedEntityRepository, 'findOneBy').mockResolvedValue(updatedEntity);

      const result = await mockBaseRepository.update({ where: { id } }, partialEntity);

      expect(mockedEntityRepository.create).toHaveBeenCalledWith(partialEntity);
      expect(mockedEntityRepository.update).toHaveBeenCalledWith({ where: { id } }, updatedEntity as any);
      expect(mockedEntityRepository.findOneBy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedEntity);
    });
  });

  describe('softDelete', () => {
    it('should soft delete the entity', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const deletedResult: UpdateResult = {
        raw: { id, name: 'entity name test' },
        generatedMaps: [],
      };

      jest.spyOn(mockedEntityRepository, 'softDelete').mockResolvedValue(Promise.resolve<UpdateResult>(deletedResult));

      const result = await mockBaseRepository.softDelete(id);

      expect(mockedEntityRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedResult);
    });
  });
});
