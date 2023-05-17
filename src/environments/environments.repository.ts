import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from './entities/environment.entity';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { IEnvironmentRepository } from './interfaces/environments.repository';

export class EnvironmentRepository extends Repository<Environment> implements IEnvironmentRepository {
  constructor(
    @InjectRepository(Environment)
    private environmentRepository: Repository<Environment>,
  ) {
    super(environmentRepository.target, environmentRepository.manager, environmentRepository.queryRunner);
  }
  async createEnvironment(createEnvironmentDto: CreateEnvironmentDto): Promise<Environment> {
    const createdEnvironment = this.environmentRepository.create(createEnvironmentDto);
    return await this.environmentRepository.save(createdEnvironment);
  }

  async findById(id: string): Promise<Environment> {
    return await this.environmentRepository.findOne({ where: { id: id } });
  }

  async updateEnvironment(id: string, updateEnvironmentDto: UpdateEnvironmentDto): Promise<Environment> {
    const updateEnvironment = this.environmentRepository.create(updateEnvironmentDto);
    await this.environmentRepository.update({ id: id }, updateEnvironment);
    return await this.findById(id);
  }
}
