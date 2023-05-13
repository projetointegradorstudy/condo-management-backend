import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { EnvironmentRepository } from './environments.repository';

@Injectable()
export class EnvironmentsService {
  
  constructor(private readonly environmentRepository:EnvironmentRepository){}
  
  async create(createEnvironmentDto: CreateEnvironmentDto) {
   return await this.environmentRepository.createEnvironment(createEnvironmentDto)
  }

  async findAll() {
    return await this.environmentRepository.find()
  }

  async findOne(id: string) {
    const environment = await this.environmentRepository.findById(id)
    if (!environment) throw new NotFoundException();
    return environment;
  }

 async update(id: string, updateEnvironmentDto: UpdateEnvironmentDto) {
    const environment = await this.environmentRepository.findById(id)
    if (!environment) throw new NotFoundException();
    const updatedEnvironment = await this.environmentRepository.updateEnvironment(id,updateEnvironmentDto)
    return updatedEnvironment;
  }

  async remove(id: string) {
    const environment = await this.environmentRepository.findById(id)
    await this.environmentRepository.delete(environment.id);
    return { message: 'Environment deleted successfully' };
  }
}


