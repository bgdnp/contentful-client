import { ContentfulClient } from './contentful-client';
import { CFClientConfig } from './types';

let clients: { [key: string]: ContentfulClient } = {};

export function createClient(params?: CFClientConfig): ContentfulClient {
  const instanceId = params?.instanceId ?? 'main';

  if (!clients[instanceId]) {
    params = params ?? {
      space: process.env.CONTENTFUL_SPACE_ID,
      environment: process.env.CONTENTFUL_ENVIRONMENT_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      managementToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
      locale: process.env.CONTENTFUL_LOCALE,
      preview: process.env.CONTENTFUL_USE_PREVIEW ? true : false,
      instanceId,
    };

    clients[instanceId] = new ContentfulClient(params);
  }

  return clients[instanceId];
}
