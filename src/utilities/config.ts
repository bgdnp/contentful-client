import { CreateClientParams } from 'contentful';
import { CFClientConfig } from '../types';

class Config {
  private clientConfig: CFClientConfig;

  set(clientConfig: CFClientConfig): void {
    this.clientConfig = clientConfig;
  }

  cdn(): CreateClientParams {
    return {
      space: this.clientConfig.space,
      environment: this.clientConfig.environment,
      accessToken: this.clientConfig.accessToken,
      host: this.clientConfig.preview
        ? 'preview.contentful.com'
        : 'cdn.contentful.com',
    };
  }

  cma(): { accessToken: string } {
    return {
      accessToken: this.clientConfig.managementToken,
    };
  }

  space(): string {
    return this.clientConfig.space;
  }

  environment(): string {
    return this.clientConfig.environment;
  }

  locale(): string {
    return this.clientConfig.locale;
  }
}

export const config = new Config();
