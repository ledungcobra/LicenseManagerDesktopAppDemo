export const getMac = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('get-mac', []);
    // @ts-ignore
    window.electron.ipcRenderer.once('get-mac-reply', ({ error, data }) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

export const removeFileAsync = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('remove-file', [filePath]);
    // @ts-ignore
    window.electron.ipcRenderer.once(
      'remove-file-reply',
      // @ts-ignore
      ({ error, data }: { error: any; data: any }) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};
