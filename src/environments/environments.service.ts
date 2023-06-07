import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { IEnvironmentRepository } from './interfaces/environments.repository';
import { Environment } from './entities/environment.entity';
import { IEnvironmentService } from './interfaces/environments.service';
import { Status, isComplianceStatus, validateStatus } from './entities/status.enum';

@Injectable()
export class EnvironmentsService implements IEnvironmentService {
  constructor(@Inject(IEnvironmentRepository) private readonly environmentRepository: IEnvironmentRepository) {}

  async create(createEnvironmentDto: CreateEnvironmentDto) {
    return await this.environmentRepository.createEnvironment(createEnvironmentDto);
  }
  async findAll(status: string): Promise<Environment[]> {
    if (!validateStatus(status)) {
      throw new BadRequestException({ message: 'invalid environments status' });
    }

    return await this.environmentRepository.findEnvironments(status as Status);
  }

  async findOne(id: string): Promise<Environment> {
    const environment = await this.environmentRepository.findById(id);
    if (!environment) throw new NotFoundException();
    return environment;
  }

  async update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    const environment = await this.environmentRepository.findById(id);
    if (!environment) {
      throw new NotFoundException();
    }

    const errorMessage = isComplianceStatus(updateEnvironmentDto.status, environment.status);
    if (errorMessage) {
      throw new BadRequestException({ message: errorMessage });
    }

    const updatedEnvironment = await this.environmentRepository.updateEnvironment(id, updateEnvironmentDto);
    return updatedEnvironment;
  }

  async remove(id: string): Promise<any> {
    const environment = await this.environmentRepository.findById(id);
    if (!environment) throw new NotFoundException();
    await this.environmentRepository.delete(environment.id);
    return { message: 'Environment deleted successfully' };
  }
}
