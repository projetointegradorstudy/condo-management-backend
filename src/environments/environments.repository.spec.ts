import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentRepository } from './environments.repository';

describe('EnvironmentsRepository', () => {
  let environmentRepository: EnvironmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentRepository],
    }).compile();

    environmentRepository = module.get<EnvironmentRepository>(EnvironmentRepository);
  });

  it('should be defined', () => {
    expect(environmentRepository).toBeDefined();
  });
});
