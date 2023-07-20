import { Injectable, Inject, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CreateEnvReservationDto } from './dto/create-env-reservations.dto';
import { UpdateEnvReservationDto } from './dto/update-env-reservations.dto';
import { EnvReservation } from './entities/env-reservation.entity';
import { IEnvReservationService } from './interfaces/env-reservations-service.interface';
import { EnvReservationStatus } from './entities/status.enum';
import { IEnvReservationRepository } from './interfaces/env-reservations-repository.interface';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.enum';
import { Between, In } from 'typeorm';

@Injectable()
export class EnvReservationsService implements IEnvReservationService {
  constructor(@Inject(IEnvReservationRepository) private readonly envRequestRepository: IEnvReservationRepository) {}

  async create(createEnvReservationDto: CreateEnvReservationDto, id: string): Promise<{ message: string }> {
    createEnvReservationDto['user_id'] = id;
    await this.checkEnvironmentAvailability(createEnvReservationDto);
    await this.envRequestRepository.create(createEnvReservationDto);
    return { message: 'Reservation created successfully' };
  }

  async count() {
    return await this.envRequestRepository.count();
  }

  async findAll(status?: string): Promise<EnvReservation[]> {
    return await this.envRequestRepository.find({
      where: { status: status as EnvReservationStatus },
      relations: ['user', 'environment'],
      order: { created_at: 'ASC' },
    });
  }

  async findAllByUser(userId: string, status?: string): Promise<EnvReservation[]> {
    return await this.envRequestRepository.find({
      where: { user_id: userId, status: status as EnvReservationStatus },
      relations: ['user', 'environment'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string): Promise<EnvReservation> {
    const envReservation = await this.envRequestRepository.findBy({
      where: { id },
      relations: ['user', 'environment'],
    });
    if (!envReservation) throw new NotFoundException();
    return envReservation;
  }

  async update(
    id: string,
    updateEnvReservationDto: UpdateEnvReservationDto,
    user: Partial<User>,
  ): Promise<EnvReservation> {
    const envReservation = await this.envRequestRepository.findBy({
      where: { id },
      relations: ['user', 'environment'],
    });
    if (!envReservation) throw new NotFoundException();
    await this.checkUserRole(user, envReservation);

    return await this.envRequestRepository.update({ id }, updateEnvReservationDto);
  }

  async remove(id: string): Promise<any> {
    const envReservation = await this.envRequestRepository.findBy({ where: { id } });
    if (!envReservation) throw new NotFoundException();
    await this.envRequestRepository.softDelete(envReservation.id);
    return { message: 'Reservation deleted successfully' };
  }

  private async checkUserRole(user: Partial<User>, envReservation: EnvReservation): Promise<void> {
    if (user.role === Role.USER && envReservation.user_id !== user.id) throw new ForbiddenException();
  }

  private async checkEnvironmentAvailability(createEnvReservationDto: CreateEnvReservationDto): Promise<void> {
    const startDate = new Date(`${createEnvReservationDto.date_in.toISOString().substring(0, 10)} 00:00:00`);
    const endDate = new Date(`${createEnvReservationDto.date_in.toISOString().substring(0, 10)} 23:59:59`);

    const envReserves = await this.envRequestRepository.findBy({
      where: {
        environment_id: createEnvReservationDto.environment_id,
        status: In([EnvReservationStatus.APPROVED, EnvReservationStatus.PENDING]),
        date_in: Between(startDate, endDate),
      },
    });
    if (envReserves) throw new ConflictException('Environment unavailable');
  }
}
