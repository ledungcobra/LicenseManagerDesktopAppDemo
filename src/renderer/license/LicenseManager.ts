import { AES, enc } from 'crypto-js';
import keccak256 from 'keccak256';
import { getMac } from 'renderer/utils/Utils';
import { ILicenseContract, ILicenseManager, ILicenseStorage } from './types';
import { getAddressFromSig } from './utils';
export class LicenseManager implements ILicenseManager {
  private contract: ILicenseContract;
  private storage: ILicenseStorage;
  private _computedSecret: string | null = '';

  constructor(
    contract: ILicenseContract,
    storage: ILicenseStorage,
    private _appSecret: string
  ) {
    this.contract = contract;
    this.storage = storage;
  }

  async checkValidity(): Promise<boolean> {
    const license = await this.storage.getLicense();

    if (!license) {
      return Promise.resolve(false);
    }
    const address = license.address;

    if (await this.isOnline()) {
      console.log('Is online check');
      return await this.contract.hasValidLicense(address);
    } else {
      console.log('Local check');
      const signature = AES.decrypt(
        license.signature,
        this.secret(address)
      ).toString(enc.Utf8);
      const plain = AES.decrypt(license.plain, this.secret(address)).toString(
        enc.Utf8
      );

      const isValidAddress = getAddressFromSig(signature, plain) === address;
      if (isValidAddress) {
        const tokens = plain.split('|');
        if (tokens.length !== 3) {
          return Promise.resolve(false);
        }
        const buyTime = +tokens[0];
        const expiredTime = +tokens[1];
        const macAddress = tokens[2];
        const myMac = await getMac();
        if (myMac.toLowerCase() !== macAddress.toLowerCase()) {
          return Promise.resolve(false);
        }
        const now = +new Date();
        return Promise.resolve(now < expiredTime && now > buyTime);
      }
      return Promise.resolve(false);
    }
  }
  async isOnline(): Promise<boolean> {
    try {
      await this.contract.balance();
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  secret(address: string): string {
    if (this._computedSecret) {
      return this._computedSecret!!;
    }
    this._computedSecret =
      '0x' + keccak256(this._appSecret + address.toLowerCase()).toString('hex');
    return this._computedSecret;
  }
}
