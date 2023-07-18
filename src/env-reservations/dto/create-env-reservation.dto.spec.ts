import { plainToClass } from 'class-transformer';
import { CreateEnvReservationDto } from './create-env-reservations.dto';

describe('CreateEnvReservationDto', () => {
  it('should transform the date_in property', () => {
    const inputData = { date_in: '2023-06-08 21:50:38' };
    const transformedDate = new Date(inputData.date_in);

    const dto = plainToClass(CreateEnvReservationDto, inputData);

    expect(dto.date_in).toEqual(transformedDate);
  });

  it('should transform the date_out property', () => {
    const inputData = { date_out: '2023-06-08 21:50:38' };
    const transformedDate = new Date(inputData.date_out);

    const dto = plainToClass(CreateEnvReservationDto, inputData);

    expect(dto.date_out).toEqual(transformedDate);
  });
});
