import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EnvReservationsService } from './env-reservations.service';
import { UpdateEnvReservationDto } from './dto/update-env-reservations.dto';
import { CreateEnvReservationDto } from './dto/create-env-reservations.dto';
import { EnvReservationStatus } from 'src/env-reservations/entities/status.enum';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { IEnvReservationRepository } from './interfaces/env-reservations-repository.interface';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.enum';

describe('envReservationsService', () => {
  let envReservationsService: EnvReservationsService;
  let mockEnvReservationRepository: jest.Mocked<IEnvReservationRepository>;

  beforeEach(() => {
    mockEnvReservationRepository = {
      count: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      findBy: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      checkUserRole: jest.fn(),
    } as unknown as jest.Mocked<IEnvReservationRepository>;

    envReservationsService = new EnvReservationsService(mockEnvReservationRepository);
  });

  describe('create', () => {
    it('should create an env reservation', async () => {
      const user_id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const CreateEnvReservationDto: CreateEnvReservationDto = {
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
      };
      const createdEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.PENDING,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvReservationRepository.create.mockResolvedValue(createdEnvReservation);

      const result = await envReservationsService.create(CreateEnvReservationDto, user_id);

      expect(mockEnvReservationRepository.create).toHaveBeenCalledWith(CreateEnvReservationDto);
      expect(result).toEqual({ message: 'Env reservation created successfully' });
    });
  });

  describe('count', () => {
    it('should return the total', async () => {
      mockEnvReservationRepository.count.mockResolvedValue(5);

      const result = await envReservationsService.count();

      expect(mockEnvReservationRepository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('findAll', () => {
    it('should find all env reservations by specific status', async () => {
      const status = EnvReservationStatus.PENDING;
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

      mockEnvReservationRepository.find.mockResolvedValue(envReservations);

      const result = await envReservationsService.findAll(status);

      expect(mockEnvReservationRepository.find).toHaveBeenCalledWith({
        where: { status: status as EnvReservationStatus },
        relations: ['user', 'environment'],
      });
      expect(result).toEqual(envReservations);
    });
  });

  describe('findAllByUser', () => {
    it('should find all env reservations by specified user', async () => {
      const status = EnvReservationStatus.PENDING;
      const userId = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
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

      mockEnvReservationRepository.find.mockResolvedValue(envReservations);

      const result = await envReservationsService.findAllByUser(userId, status);

      expect(mockEnvReservationRepository.find).toHaveBeenCalledWith({
        where: { user_id: userId, status: status as EnvReservationStatus },
        relations: ['user', 'environment'],
      });
      expect(result).toEqual(envReservations);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockEnvReservationRepository.findBy.mockResolvedValue(undefined);

      await expect(envReservationsService.findOne(id)).rejects.toThrowError(NotFoundException);
    });

    it('should return an env reservation', async () => {
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

      mockEnvReservationRepository.findBy.mockResolvedValue(foundEnvReservation);

      const result = await envReservationsService.findOne(id);

      expect(mockEnvReservationRepository.findBy).toHaveBeenCalledWith({
        where: { id },
        relations: ['user', 'environment'],
      });
      expect(result).toEqual(foundEnvReservation);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';
      const updateEnvReservationDto: UpdateEnvReservationDto = {
        status: EnvReservationStatus.APPROVED,
      };
      const user: Partial<User> = { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', role: Role.USER };

      mockEnvReservationRepository.findBy.mockResolvedValue(null);

      await expect(envReservationsService.update(id, updateEnvReservationDto, user)).rejects.toThrowError(
        NotFoundException,
      );
      expect(mockEnvReservationRepository.findBy).toHaveBeenCalledWith({
        where: { id },
        relations: ['user', 'environment'],
      });
      expect(mockEnvReservationRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when result is forbidden', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const existingEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.PENDING,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
      const updateEnvReservationDto: UpdateEnvReservationDto = {
        status: EnvReservationStatus.APPROVED,
      };
      const user: Partial<User> = { id: '571cecb0-0dce-4g56-8410-aee5646fcfed', role: Role.USER };

      mockEnvReservationRepository.findBy.mockResolvedValue(existingEnvReservation);

      await expect(envReservationsService.update(id, updateEnvReservationDto, user)).rejects.toThrowError(
        ForbiddenException,
      );
      expect(mockEnvReservationRepository.update).not.toHaveBeenCalled();
    });

    it('should update an env Reservation', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const existingEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.PENDING,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };
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

      const user: Partial<User> = { id: '571cecb0-0dce-4fa0-8410-aee5646fcfed', role: Role.USER };

      mockEnvReservationRepository.findBy.mockResolvedValue(existingEnvReservation);
      mockEnvReservationRepository.update.mockResolvedValue(updatedEnvReservation);

      const result = await envReservationsService.update(id, updateEnvReservationDto, user);

      expect(mockEnvReservationRepository.findBy).toHaveBeenCalledWith({
        where: { id },
        relations: ['user', 'environment'],
      });
      expect(mockEnvReservationRepository.update).toHaveBeenCalledWith({ id }, updateEnvReservationDto);
      expect(result).toEqual(updatedEnvReservation);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when result is not found', async () => {
      const id = 'invalid uuid';

      mockEnvReservationRepository.findBy.mockResolvedValue(undefined);

      await expect(envReservationsService.remove(id)).rejects.toThrowError(NotFoundException);
    });

    it('should return a success message', async () => {
      const id = '571cecb0-0dce-4fa0-8410-aee5646fcfed';
      const existingEnvReservation: EnvReservation = {
        id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        environment_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        status: EnvReservationStatus.PENDING,
        user_id: '571cecb0-0dce-4fa0-8410-aee5646fcfed',
        date_in: new Date(),
        date_out: new Date(),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
      };

      mockEnvReservationRepository.findBy.mockResolvedValue(existingEnvReservation);
      mockEnvReservationRepository.softDelete.mockResolvedValue(undefined);

      const result = await envReservationsService.remove(id);

      expect(mockEnvReservationRepository.findBy).toHaveBeenCalledWith({ where: { id } });
      expect(mockEnvReservationRepository.softDelete).toHaveBeenCalledWith(existingEnvReservation.id);
      expect(result).toEqual({ message: 'EnvReservation deleted successfully' });
    });
  });
});
