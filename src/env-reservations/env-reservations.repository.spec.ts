import { Repository } from 'typeorm';
import { MockBaseRepository } from 'src/base/base.repository.spec';
import { EnvReservation } from './entities/env-reservation.entity';
import { EnvReservationRepository } from './env-reservations.repository';

describe('EnvReservationRepository', () => {
  class MockEnvReservationRepository extends MockBaseRepository<EnvReservation> {
    constructor() {
      const mockRepository = {} as Repository<EnvReservation>;
      super(mockRepository);
    }
    count = jest.fn();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let envReservationRepository: EnvReservationRepository;
  let mockEnvReservationRepository: MockEnvReservationRepository;

  beforeEach(() => {
    mockEnvReservationRepository = new MockEnvReservationRepository();
    envReservationRepository = new EnvReservationRepository(
      mockEnvReservationRepository as unknown as Repository<EnvReservation>,
    );
  });

  describe('base repository tests', () => {
    it('should do base repository coverage', async () => {
      await mockEnvReservationRepository.count();
    });
  });
});
