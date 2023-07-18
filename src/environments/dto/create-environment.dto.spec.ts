import { plainToClass } from 'class-transformer';
import { CreateEnvironmentDto } from './create-environment.dto';

describe('CreateEnvironmentDto', () => {
  it('should transform the capacity property', () => {
    const inputData = { capacity: '5' };
    const transformedDate = +inputData.capacity;

    const dto = plainToClass(CreateEnvironmentDto, inputData);

    expect(dto.capacity).toEqual(transformedDate);
  });
});
