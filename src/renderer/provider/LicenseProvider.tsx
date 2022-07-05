import { ethers } from 'ethers';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LicenseContract } from 'renderer/license/LicenseContract';
import { LicenseManager } from 'renderer/license/LicenseManager';
import { FileLicenseStorage } from 'renderer/license/LicenseStorage';
import {
  APP_ADDRESS,
  RPC_HOST,
  SECRET,
  TIME_OUT_CHECK_LICENSE,
} from 'renderer/utils/Constants';
import { useNotificationContext } from './NotificationProvider';

interface ContextType {
  licenseManager: LicenseManager;
  licenseContract: LicenseContract;
  licenseStorage: FileLicenseStorage;
  isValid: boolean;
  checkValidity: () => void;
}
export const LicenseContext = React.createContext<ContextType | null>(null);
export const useLicenseContext = () => React.useContext(LicenseContext);

type Props = {
  children: React.ReactNode;
};

const LicenseProvider = ({ children }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const notiCtx = useNotificationContext();

  const [licenseManager, setLicenseManager] =
    React.useState<LicenseManager | null>(null);
  const [licenseContract, setLicenseContract] =
    React.useState<LicenseContract | null>(null);
  const [fileLicenseStorage, setFileLicenseStorage] =
    React.useState<FileLicenseStorage | null>(null);
  const [isValid, setIsValid] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const checkTimeoutRef = React.useRef<any>();

  React.useEffect(() => {
    window.electron.ipcRenderer.sendMessage('get-user-dir', []);
    window.electron.ipcRenderer.once('get-user-dir-reply', (userFilePath) => {
      const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
      const contract = new LicenseContract(APP_ADDRESS, provider);
      const fileStorage = new FileLicenseStorage(userFilePath as string);
      const licenseManager = new LicenseManager(contract, fileStorage, SECRET);

      setLicenseManager(licenseManager);
      setFileLicenseStorage(fileStorage);
      setLicenseContract(contract);
    });

    checkTimeoutRef.current = setInterval(() => {
      checkValidity();
    }, TIME_OUT_CHECK_LICENSE);

    return () => {
      clearInterval(checkTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    if (licenseManager) {
      checkValidity();
    }
  }, [licenseManager]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (isValid) {
      if (location.pathname !== '/main') {
        navigate('/main');
      }
    } else {
      if (location.pathname === '/main') {
        navigate('/');
      }
    }
  }, [isReady, isValid, location]);

  const checkValidity = () => {
    licenseManager
      ?.checkValidity()
      .then((isValid) => {
        console.log('Is valid ' + isValid);
        setIsValid(isValid);
      })
      .catch((err) => {
        notiCtx.show(err.message, 'error', -1);
        setIsValid(false);
      })
      .finally(() => {
        if (!isReady) {
          setIsReady(true);
        }
      });
  };

  if (!licenseContract || !fileLicenseStorage || !licenseManager) {
    return <div>{children}</div>;
  }

  return (
    // @ts-nocheck
    <LicenseContext.Provider
      value={{
        licenseManager,
        isValid,
        licenseContract,
        licenseStorage: fileLicenseStorage,
        checkValidity,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export default LicenseProvider;
