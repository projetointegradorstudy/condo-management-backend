import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { IEnvironmentService } from './interfaces/environments-service.interface';
import { EnvironmentStatus } from './entities/status.enum';
import { IEnvironmentRepository } from './interfaces/environments-repository.interface';
import { EnvReservation } from 'src/env-reservations/entities/env-reservation.entity';
import { IS3Service } from 'src/utils/upload/s3.interface';

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

  async count(): Promise<number> {
    return await this.environmentRepository.count();
  }

  async findAll(status?: string): Promise<Environment[]> {
    return await this.environmentRepository.find({ where: { status: status as EnvironmentStatus } });
  }

  async findOne(id: string): Promise<Environment> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    return environment;
  }

  async findEnvReservationsById(id: string): Promise<EnvReservation[]> {
    const environment = await this.environmentRepository.findBy({ where: { id }, relations: ['env_requests'] });
    if (!environment) throw new NotFoundException();
    return environment.env_requests;
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
}
