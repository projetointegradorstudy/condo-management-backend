import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';
import { IEnvironmentService } from './interfaces/environments.service';
import { Status, isComplianceStatus, validateStatus } from './entities/status.enum';
import { IEnvironmentRepository } from './interfaces/environments.repository';
import { S3Service } from 'src/utils/upload/s3.service';
import { EnvRequest } from 'src/env-requests/entities/env-request.entity';

@Injectable()
export class EnvironmentsService implements IEnvironmentService {
  constructor(
    @Inject(IEnvironmentRepository) private readonly environmentRepository: IEnvironmentRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createEnvironmentDto: CreateEnvironmentDto, image?: Express.Multer.File): Promise<Environment> {
    if (image) {
      const imageUploaded = await this.s3Service.uploadFile(image);
      createEnvironmentDto['image'] = imageUploaded.Location;
    }
    return await this.environmentRepository.create(createEnvironmentDto);
  }

  async count(): Promise<number> {
    return await this.environmentRepository.count();
  }

  async findAll(status: string): Promise<Environment[]> {
    if (!validateStatus(status)) throw new BadRequestException({ message: 'invalid environments status' });

    return await this.environmentRepository.find({ where: { status: status as Status } });
  }

  async findOne(id: string): Promise<Environment> {
    const environment = await this.environmentRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    return environment;
  }

  async findEnvRequestsById(id: string): Promise<EnvRequest[]> {
    const environment = await this.environmentRepository.findBy({ where: { id }, relations: ['env_requests'] });
    if (!environment) throw new NotFoundException();
    return environment.env_requests;
  }

  async update(
    id: string,
    updateEnvironmentDto: UpdateEnvironmentDto,
    image?: Express.Multer.File,
  ): Promise<Environment> {
    const environment = await this.findOne(id);

    const errorMessage = isComplianceStatus(updateEnvironmentDto.status, environment.status);
    if (errorMessage) {
      throw new BadRequestException({ message: errorMessage });
    }

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
}
