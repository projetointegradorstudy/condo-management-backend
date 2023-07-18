import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';
import { EnvReservationsController } from 'src/env-reservations/env-reservations.controller';
import { IEnvReservationService } from 'src/env-reservations/interfaces/env-reservations-service.interface';
import { CreateEnvReservationDto } from 'src/env-reservations/dto/create-env-reservations.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.enum';
import { UpdateEnvReservationDto } from './dto/update-env-reservations.dto';

describe('EnvReservationController', () => {
  let envReservationsController: EnvReservationsController;
  let mockEnvReservationService: jest.Mocked<IEnvReservationService>;

  beforeEach(() => {
    mockEnvReservationService = {
      create: jest.fn(),
      count: jest.fn(),
      findAll: jest.fn(),
      findAllByUser: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<IEnvReservationService>;

    envReservationsController = new EnvReservationsController(mockEnvReservationService);
  });

  describe('create', () => {
    it('should create an env reservation', async () => {
      const req: any = {
        user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', role: Role.USER } as Partial<User> },
      };
      const CreateEnvReservationDto: CreateEnvReservationDto = {
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
      };

      mockEnvReservationService.create.mockResolvedValue({ message: 'Env reservation created successfully' });

      const result = await envReservationsController.create(CreateEnvReservationDto, req);

      expect(mockEnvReservationService.create).toHaveBeenCalledWith(CreateEnvReservationDto, req.user.user.id);
      expect(result).toEqual({ message: 'Env reservation created successfully' });
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      mockEnvReservationService.count.mockResolvedValue(5);

      const result = await envReservationsController.count();

      expect(mockEnvReservationService.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should find all env reservations', async () => {
      const envReservations: EnvReservation[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          status: EnvReservationStatus.PENDING,
          user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          date_in: new Date(),
          date_out: new Date(),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvReservationService.findAll.mockResolvedValue(envReservations);

      const result = await envReservationsController.findAll();

      expect(mockEnvReservationService.findAll).toHaveBeenCalled();
      expect(result).toBe(envReservations);
    });
  });

  describe('findAllByUser', () => {
    it('should find all env reservations by specified user', async () => {
      const req: any = {
        user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', role: Role.USER } as Partial<User> },
      };
      const foundEnvReservations: EnvReservation[] = [
        {
          id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          status: EnvReservationStatus.PENDING,
          user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
          date_in: new Date(),
          date_out: new Date(),
          created_at: new Date(Date.now()),
          updated_at: new Date(Date.now()),
        },
      ];

      mockEnvReservationService.findAllByUser.mockResolvedValue(foundEnvReservations);

      const result = await envReservationsController.findAllByUser(req);

      expect(mockEnvReservationService.findAllByUser).toHaveBeenCalledWith(req.user.user.id, undefined);
      expect(result).toBe(foundEnvReservations);
    });
  });

  describe('findOne', () => {
    it('should return the env reservation with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const foundEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.PENDING,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvReservationService.findOne.mockResolvedValue(foundEnvReservation);

      const result = await envReservationsController.findOne(id);

      expect(mockEnvReservationService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe(foundEnvReservation);
    });
  });

  describe('update', () => {
    it('should update the env reservation with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const updateEnvReservationDto: UpdateEnvReservationDto = {
        status: EnvReservationStatus.APPROVED,
      };
      const updatedEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.APPROVED,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      const req: any = {
        user: { user: { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', role: Role.USER } as Partial<User> },
      };

      mockEnvReservationService.update.mockResolvedValue(updatedEnvReservation);

      const result = await envReservationsController.update(id, updateEnvReservationDto, req);

      expect(mockEnvReservationService.update).toHaveBeenCalledWith(id, updateEnvReservationDto, req.user.user);
      expect(result).toBe(updatedEnvReservation);
    });
  });

  describe('remove', () => {
    it('should remove the env reservation with the specified ID', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';

      mockEnvReservationService.remove.mockResolvedValue({ message: 'EnvReservation deleted successfully' });

      const result = await envReservationsController.remove(id);

      expect(mockEnvReservationService.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'EnvReservation deleted successfully' });
    });
  });
});
