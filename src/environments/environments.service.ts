import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { IEnvironmentRepository } from './interfaces/environments.repository';
import { Environment } from './entities/environment.entity';
import { IEnvironmentService } from './interfaces/environments.service';

@Injectable()
export class EnvironmentsService implements IEnvironmentService {
  
  constructor(@Inject(IEnvironmentRepository) private readonly environmentRepository: IEnvironmentRepository){}
  
  async create(createEnvironmentDto: CreateEnvironmentDto) {
   return await this.environmentRepository.createEnvironment(createEnvironmentDto)
  }

  async findAll(): Promise<Environment[]> {
    return await this.environmentRepository.find()
  }

  async findOne(id: string): Promise<Environment>  {
    const environment = await this.environmentRepository.findById(id)
    if (!environment) throw new NotFoundException();
    return environment;
  }

 async update(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    const environment = await this.environmentRepository.findById(id)
    if (!environment) throw new NotFoundException();
    const updatedEnvironment = await this.environmentRepository.updateEnvironment(id,updateEnvironmentDto)
    return updatedEnvironment;
  }

  async remove(id: string): Promise<any> {
    const environment = await this.environmentRepository.findById(id)
    await this.environmentRepository.delete(environment.id);
    return { message: 'Environment deleted successfully' };
  }
}


