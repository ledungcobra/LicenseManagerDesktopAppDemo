export interface ILicenseStorage {
  getLicense(): Promise<License | null>;
  setLicense(license: License): Promise<void>;
  removeLicense(): Promise<void>;
}

export interface License {
  address: string;
  signature: string;
  plain: string;
}

export interface ILicenseManager {
  checkValidity(): Promise<boolean>;
}

export interface ILicenseContract {
  balance(): Promise<any>;
  hasValidLicense(address: string): Promise<boolean>;
}
