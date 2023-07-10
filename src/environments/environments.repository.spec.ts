import { EnvironmentRepository } from './environments.repository';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';
import { MockBaseRepository } from 'src/base/base.repository.spec';

describe('EnvironmentRepository', () => {
  class MockEnvironmentRepository extends MockBaseRepository<Environment> {
    constructor() {
      const mockRepository = {} as Repository<Environment>;
      super(mockRepository);
    }
    count = jest.fn();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let environmentRepository: EnvironmentRepository;
  let mockEnvironmentRepository: MockEnvironmentRepository;

  beforeEach(() => {
    mockEnvironmentRepository = new MockEnvironmentRepository();
    environmentRepository = new EnvironmentRepository(mockEnvironmentRepository as unknown as Repository<Environment>);
  });

  describe('base repository tests', () => {
    it('should do base repository coverage', async () => {
      await mockEnvironmentRepository.count();
    });
  });
});
