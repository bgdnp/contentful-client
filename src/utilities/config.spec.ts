import { config } from './config';

const paramsMock = {
  space: 'mock-space',
  environment: 'mock-env',
  accessToken: 'mock-access-token',
  managementToken: 'mock-management-token',
  locale: 'en-US',
};

describe('config', () => {
  describe('set method', () => {
    it('should set config', () => {
      config.set(paramsMock);

      expect((config as any).clientConfig).toEqual(paramsMock);
    });
  });

  describe('cdn method', () => {
    it('should return cdn config', () => {
      config.set(paramsMock);

      expect(config.cdn()).toEqual({
        space: paramsMock.space,
        environment: paramsMock.environment,
        accessToken: paramsMock.accessToken,
        host: 'cdn.contentful.com',
      });
    });

    it('should return preview config', () => {
      config.set({
        ...paramsMock,
        preview: true,
      });

      expect(config.cdn()).toEqual({
        space: paramsMock.space,
        environment: paramsMock.environment,
        accessToken: paramsMock.accessToken,
        host: 'preview.contentful.com',
      });
    });
  });

  describe('cma method', () => {
    it('should return cma config', () => {
      config.set(paramsMock);

      expect(config.cma()).toEqual({
        accessToken: paramsMock.managementToken,
      });
    });
  });

  describe('space method', () => {
    it('should return space id', () => {
      config.set(paramsMock);

      expect(config.space()).toEqual(paramsMock.space);
    });
  });

  describe('environment method', () => {
    it('should return environment id', () => {
      config.set(paramsMock);

      expect(config.environment()).toEqual(paramsMock.environment);
    });
  });

  describe('locale method', () => {
    it('should return locale', () => {
      config.set(paramsMock);

      expect(config.locale()).toEqual(paramsMock.locale);
    });
  });
});
