import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateEnvRequestDto } from './dto/create-env-request.dto';
import { UpdateEnvRequestDto } from './dto/update-env-request.dto';
import { EnvRequest } from './entities/env-request.entity';
import { IEnvRequestService } from './interfaces/env-requests-service.interface';
import { EnvRequestStatus } from './entities/status.enum';
import { IEnvRequestRepository } from './interfaces/env-requests-repository.interface';

@Injectable()
export class EnvRequestsService implements IEnvRequestService {
  constructor(@Inject(IEnvRequestRepository) private readonly envRequestRepository: IEnvRequestRepository) {}

  async create(createEnvRequestDto: CreateEnvRequestDto, id: string) {
    createEnvRequestDto['user_id'] = id;
    return await this.envRequestRepository.create(createEnvRequestDto);
  }

  async count() {
    return await this.envRequestRepository.count();
  }

  async findAll(status: string): Promise<EnvRequest[]> {
    // if (!validateEnvRequestStatus(status)) throw new BadRequestException({ message: 'invalid environments status' });

    return await this.envRequestRepository.find({ where: { status: status as EnvRequestStatus } });
  }

  async findOne(id: string): Promise<EnvRequest> {
    const environment = await this.envRequestRepository.findBy({
      where: { id },
      relations: ['user', 'environment'],
    });
    if (!environment) throw new NotFoundException();
    return environment;
  }

  async update(id: string, updateEnvRequestDto: UpdateEnvRequestDto): Promise<EnvRequest> {
    const environment = await this.findOne(id);

    // const errorMessage = isComplianceEnvRequestStatus(updateEnvRequestDto.status, environment.status);
    // if (errorMessage) {
    //   throw new BadRequestException({ message: errorMessage });
    // }

    return await this.envRequestRepository.update({ id }, updateEnvRequestDto);
  }

  async remove(id: string): Promise<any> {
    const environment = await this.envRequestRepository.findBy({ where: { id } });
    if (!environment) throw new NotFoundException();
    await this.envRequestRepository.softDelete(environment.id);
    return { message: 'EnvRequest deleted successfully' };
  }
}
