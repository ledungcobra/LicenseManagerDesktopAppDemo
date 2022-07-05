import ethers, { BigNumber, Contract } from 'ethers';
import { getMac } from 'renderer/utils/Utils';
import LicenseToken from '../../contracts/LicenseToken.json';
import { ILicenseContract } from './types';
export class LicenseContract implements ILicenseContract {
  private contract: Contract;
  constructor(address: string, provider: ethers.providers.Provider) {
    this.contract = new Contract(address, LicenseToken['abi'], provider);
  }
  async balance(): Promise<any> {
    return await this.contract.balance();
  }

  async hasValidLicense(address: string): Promise<boolean> {
    const timeExpiredMillis = (
      (await this.contract.getExpiredTimestamp({ from: address })) as BigNumber
    ).toNumber();
    const macAddress = (await this.contract.addressToMacAddress(
      address
    )) as string;
    const myMac = await getMac();

    if (myMac.toLowerCase().trim() !== macAddress.toLowerCase().trim()) {
      return Promise.resolve(false);
    }
    const timeStampValid = timeExpiredMillis >= +new Date();
    if (!timeStampValid) {
      console.log('Time stamp not valid');
    }
    return timeStampValid;
  }
}
