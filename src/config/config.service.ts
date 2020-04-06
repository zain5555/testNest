import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from '@hapi/joi';
import { ConfigInterface } from './types/interfaces/config.interface';

@Injectable()
export class ConfigService {
  private readonly envConfig: ConfigInterface;

  constructor() {
    dotenv.config();
    const config: { [name: string]: string } = process.env;
    const parsedConfig = JSON.parse(JSON.stringify(config));
    this.envConfig = this.validateInput(parsedConfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput = (envConfig): ConfigInterface => {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision', 'inspection')
        .default('development'),
      SERVER_PORT: Joi.number().default(4000),
      MONGO_URI: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      FRONTEND_APP_URI: Joi.string().uri().required(),
      MAILGUN_API_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
      {
        abortEarly: false,
        allowUnknown: true,
      },
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get serverPort(): number {
    return this.envConfig.SERVER_PORT;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get mongoUri(): string {
    return this.envConfig.MONGO_URI;
  }
  
  get frontendAppUri(): string {
    return this.envConfig.FRONTEND_APP_URI;
  }
  
  get mailGunApiKey(): string {
    return this.envConfig.MAILGUN_API_KEY;
  }
}
