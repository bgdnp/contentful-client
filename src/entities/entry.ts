import { Entry, Metadata, Sys } from 'contentful';
import { CMAClient, parser } from '../utilities';
import { CMAEntry, PlainEntry } from '../types';

type ConstructorParams<TFields> = {
  cma: CMAClient;
  entry: PlainEntry<TFields>;
  cmaEntry?: CMAEntry<TFields>;
};

type UpdateCheckCallback<TFields> = (
  existingFields: TFields,
  newFields: Partial<TFields>
) => boolean;

export class CFEntry<TFields> {
  public sys: Sys;
  public fields: TFields;
  public metadata: Metadata;

  private cma: CMAClient;
  private entry?: CMAEntry<TFields>;

  private constructor({ cma, entry, cmaEntry }: ConstructorParams<TFields>) {
    this.sys = entry.sys;
    this.fields = entry.fields;
    this.metadata = entry.metadata;
    this.cma = cma;
    this.entry = cmaEntry;
  }

  async update(
    fields: Partial<TFields>,
    shouldUpdate?: UpdateCheckCallback<TFields>
  ): Promise<CFEntry<TFields>> {
    if (!shouldUpdate || shouldUpdate(this.fields, fields)) {
      await this.loadManager();

      this.entry.fields = {
        ...this.entry.fields,
        ...parser.addLocale<TFields>(fields),
      };

      const updated = await this.entry.update();

      this.sys = parser.parseSys(updated.sys, this.sys);
      this.fields = { ...this.fields, ...fields };
      this.metadata = updated.metadata;
    }

    return this;
  }

  async replace(fields: TFields): Promise<CFEntry<TFields>> {
    await this.loadManager();

    this.entry.fields = parser.addLocale<TFields>(fields);

    const updated = await this.entry.update();

    this.sys = parser.parseSys(updated.sys, this.sys);
    this.fields = { ...this.fields, ...fields };
    this.metadata = updated.metadata;

    return this;
  }

  async publish(): Promise<CFEntry<TFields>> {
    if (this.isDraft() || this.isUpdated()) {
      await this.loadManager();

      const published = await this.entry.publish();

      this.sys = parser.parseSys(published.sys, this.sys);
    }

    return this;
  }

  async unpublish(): Promise<CFEntry<TFields>> {
    if (this.isPublished()) {
      await this.loadManager();

      const unpublished = await this.entry.unpublish();

      this.sys = parser.parseSys(unpublished.sys, this.sys);
    }

    return this;
  }

  async archive(): Promise<CFEntry<TFields>> {
    if (!this.isArchived()) {
      await this.loadManager();

      const archived = await this.entry.archive();

      this.sys = parser.parseSys(archived.sys, this.sys);
    }

    return this;
  }

  async unarchive(): Promise<CFEntry<TFields>> {
    if (this.isArchived()) {
      await this.loadManager();

      const unarchived = await this.entry.unarchive();

      this.sys = parser.parseSys(unarchived.sys, this.sys);
    }

    return this;
  }

  async delete(): Promise<CFEntry<TFields>> {
    await this.loadManager();
    await this.entry.delete();

    return this;
  }

  isDraft(): boolean | undefined {
    return this.entry?.isDraft();
  }

  isUpdated(): boolean | undefined {
    return this.entry?.isUpdated();
  }

  isPublished(): boolean | undefined {
    return this.entry?.isPublished();
  }

  isArchived(): boolean | undefined {
    return this.entry?.isArchived();
  }

  private async loadManager(): Promise<void> {
    if (!this.entry) {
      this.entry = await this.cma.getEntry(this.sys.id);
    }
  }

  static createFromCDN<TFields>(
    cma: CMAClient,
    entry: Entry<TFields>
  ): CFEntry<TFields> {
    return new CFEntry<TFields>({ cma, entry });
  }

  static createFromCMA<TFields>(
    cma: CMAClient,
    cmaEntry: CMAEntry<TFields>
  ): CFEntry<TFields> {
    const entry = parser.parseEntry<TFields>(cmaEntry);

    return new CFEntry<TFields>({ cma, entry, cmaEntry });
  }
}
