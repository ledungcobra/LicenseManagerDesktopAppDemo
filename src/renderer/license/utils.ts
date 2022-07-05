import { ethers } from 'ethers';

export const readFileAsync = (filePath: string): Promise<any> => {
  return new Promise((res, rej) => {
    // @ts-ignore
    window.electron.ipcRenderer.sendMessage('read-file', filePath);
    // @ts-ignore
    window.electron.ipcRenderer.once('read-file-reply', ({ error, data }) => {
      if (error) {
        return rej(error);
      }
      res(data);
    });
  });
};

export const writeFileAsync = (
  filePath: string,
  content: string
): Promise<any> => {
  return new Promise((res, rej) => {
    window.electron.ipcRenderer.sendMessage('write-file', [filePath, content]);
    // @ts-ignore
    window.electron.ipcRenderer.once('write-file-reply', ({ error, data }) => {
      if (error) {
        return rej(error);
      }
      res(data);
    });
  });
};

export const removeFileAsync = (filePath: string): Promise<any> => {
  return new Promise((res, rej) => {
    // @ts-ignore
    window.electron.ipcRenderer.sendMessage('remove-file', filePath);
    // @ts-ignore
    window.electron.ipcRenderer.once('remove-file-reply', ({ error, data }) => {
      if (error) {
        rej(error);
      } else {
        res('Remove file success ' + data);
      }
    });
  });
};

export const getRandomData = (n: number) => {
  return 123456778;
};

export const getAddressFromSig = (signature: string, plain: string): string => {
  try {
    return ethers.utils.verifyMessage(plain, signature).toLowerCase();
  } catch (e) {
    console.log('Error in getAddressFromSig: ', e);
    return '';
  }
};
