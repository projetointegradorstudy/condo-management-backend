import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { EnvironmentStatus } from './entities/status.enum';
import { IEnvironmentRepository } from './interfaces/environments-repository.interface';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { IS3Service } from 'src/utils/upload/s3.interface';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.enum';
import { FindOptionsWhere, Not } from 'typeorm';

@Injectable()
export class EnvironmentsService implements IEnvironmentService {
  constructor(
    @Inject(IEnvironmentRepository) private readonly environmentRepository: IEnvironmentRepository,
    @Inject(IS3Service) private readonly s3Service: IS3Service,
  ) {}

  async create(createEnvironmentDto: CreateEnvironmentDto, image?: Express.Multer.File): Promise<{ message: string }> {
    if (image) {
      const imageUploaded = await this.s3Service.uploadFile(image);
      createEnvironmentDto['image'] = imageUploaded.Location;
    }
    await this.environmentRepository.create(createEnvironmentDto);
    return { message: 'Environment created successfully' };
  }

  async count(status?: EnvironmentStatus): Promise<number> {
    return await this.environmentRepository.count({ where: { status: status as EnvironmentStatus } });
  }

  async findAll(user: Partial<User>, status?: EnvironmentStatus): Promise<Environment[]> {
    const findOptions: FindOptionsWhere<Environment> =
      user.role === Role.ADMIN ? { status: status as EnvironmentStatus } : { status: Not(EnvironmentStatus.DISABLED) };
    return await this.environmentRepository.find({ where: findOptions });
  }

  async findOne(id: string): Promise<Environment> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    return environment;
  }

  async findEnvReservationsById(id: string): Promise<EnvReservation[]> {
    const environment = await this.environmentRepository.findBy({ where: { id }, relations: ['env_reservations'] });
    if (!environment) throw new NotFoundException();
    return environment.env_reservations;
  }

  async update(
    id: string,
    updateEnvironmentDto: UpdateEnvironmentDto,
    image?: Express.Multer.File,
  ): Promise<Environment> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();

    if (image) {
      const imageUploaded = await this.s3Service.uploadFile(image, environment.image);
      updateEnvironmentDto['image'] = imageUploaded.Location;
    }

    return await this.environmentRepository.update({ id }, updateEnvironmentDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    await this.environmentRepository.softDelete(environment.id);
    return { message: 'Environment deleted successfully' };
  }

  private async checkEnvironmentStatus(id: string): Promise<void> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    if (!(environment.status === EnvironmentStatus.AVAILABLE))
      throw new BadRequestException('Environment not available');
  }

  private async checkUserRole(user: Partial<User>, envReservation: EnvReservation): Promise<void> {
    if (user.role === Role.USER && envReservation.user_id !== user.id) throw new ForbiddenException();
  }
}
