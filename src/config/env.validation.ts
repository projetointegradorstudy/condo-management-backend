import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  ENV: Environment;

  @IsNumber()
  @IsNotEmpty()
  API_PORT: number;

  @IsString()
  @IsNotEmpty()
  API_VERSION: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   SECRET_KEY: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   PGSQL_HOST: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   PGSQL_PORT: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   PGSQL_USER: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   PGSQL_PASSWORD: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   PGSQL_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false }).map((value) => {
    return `\n- ${value.constraints[Object.keys(value.constraints)[0]]}`;
  });
  if (errors.length > 0) {
    throw new Error(`Following environment variables ${errors.toString()}`);
  }
  return validatedConfig;
}
