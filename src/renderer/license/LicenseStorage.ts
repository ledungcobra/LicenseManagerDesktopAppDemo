import { ILicenseStorage, License } from './types';
import { readFileAsync, removeFileAsync, writeFileAsync } from './utils';

export class FileLicenseStorage implements ILicenseStorage {
  // MARK: - Public Properties
  path: string;
  constructor(path: string) {
    this.path = path;
  }
  async getLicense(): Promise<License | null> {
    let license = null;
    try {
      console.log(this.path);
      const data = (await readFileAsync(this.path)).toString();
      license = JSON.parse(data) as License;
    } catch (e) {
      console.error(e);
      return null;
    }
    return license;
  }

  async setLicense(license: License): Promise<void> {
    await writeFileAsync(this.path, JSON.stringify(license));
  }

  removeLicense(): Promise<void> {
    return removeFileAsync(this.path);
  }
}
