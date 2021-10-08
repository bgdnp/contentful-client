import { Asset, Metadata, Sys } from 'contentful';
import { Asset as CMAAsset } from 'contentful-management/dist/typings/export-types';
import { CMAClient, parser } from '../utilities';
import { AssetFields } from '../types';

type ConstructorParams = {
  cma: CMAClient;
  asset: Omit<Asset, 'toPlainObject'>;
  cmaAsset?: CMAAsset;
};

export class CFAsset {
  public sys: Sys;
  public fields: AssetFields;
  public metadata: Metadata;

  private cma: CMAClient;
  private asset?: CMAAsset;

  private constructor({ cma, asset, cmaAsset }: ConstructorParams) {
    this.sys = asset.sys;
    this.fields = asset.fields;
    this.metadata = asset.metadata;
    this.cma = cma;
    this.asset = cmaAsset;
  }

  async update(fields: Partial<AssetFields>): Promise<CFAsset> {
    await this.loadManager();

    this.asset.fields = {
      ...this.asset.fields,
      ...parser.addLocale<AssetFields>(fields),
    };

    const updated = await this.asset.update();

    this.sys = parser.parseSys(updated.sys, this.sys);
    this.fields = { ...this.fields, ...fields };
    this.metadata = updated.metadata;

    return this;
  }

  async publish(): Promise<CFAsset> {
    if (this.isDraft() || this.isUpdated()) {
      await this.loadManager();

      const published = await this.asset.publish();

      this.sys = parser.parseSys(published.sys, this.sys);
    }

    return this;
  }

  async unpublish(): Promise<CFAsset> {
    if (this.isPublished()) {
      await this.loadManager();

      const unpublished = await this.asset.unpublish();

      this.sys = parser.parseSys(unpublished.sys, this.sys);
    }

    return this;
  }

  async archive(): Promise<CFAsset> {
    if (!this.isArchived()) {
      await this.loadManager();

      const archived = await this.asset.archive();

      this.sys = parser.parseSys(archived.sys, this.sys);
    }

    return this;
  }

  async unarchive(): Promise<CFAsset> {
    if (this.isArchived()) {
      await this.loadManager();

      const unarchived = await this.asset.unarchive();

      this.sys = parser.parseSys(unarchived.sys, this.sys);
    }

    return this;
  }

  async delete(): Promise<CFAsset> {
    await this.loadManager();
    await this.asset.delete();

    return this;
  }

  isDraft(): boolean | undefined {
    return this.asset?.isDraft();
  }

  isUpdated(): boolean | undefined {
    return this.asset?.isUpdated();
  }

  isPublished(): boolean | undefined {
    return this.asset?.isPublished();
  }

  isArchived(): boolean | undefined {
    return this.asset?.isArchived();
  }

  private async loadManager(): Promise<void> {
    if (!this.asset) {
      this.asset = await this.cma.getAsset(this.sys.id);
    }
  }

  static createFromCDN(cma: CMAClient, asset: Asset): CFAsset {
    return new CFAsset({ cma, asset });
  }

  static createFromCMA(cma: CMAClient, cmaAsset: CMAAsset): CFAsset {
    const asset = parser.parseAsset(cmaAsset);

    return new CFAsset({ cma, asset, cmaAsset });
  }
}
