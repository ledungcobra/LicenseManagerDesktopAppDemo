import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers } from 'ethers';
import { Response } from 'main/socket';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'renderer/components/Alert';
import { writeFileAsync } from 'renderer/license/utils';
import { useLicenseContext } from 'renderer/provider/LicenseProvider';
import { useNotificationContext } from 'renderer/provider/NotificationProvider';
import { APP_ADDRESS } from '../utils/Constants';

type Props = {};

const RestoreScreen = ({}: Props) => {
  const ctx = useLicenseContext();
  const navigate = useNavigate();
  const notCtx = useNotificationContext();

  const [address, setAddress] = React.useState('');
  const [waiting, setWaiting] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!ctx) {
      return;
    }

    if (ctx.isValid) {
      navigate('/main');
    }
  }, [ctx]);
  const onRestore = () => {
    if (address === '') {
      setError('You must supply your address you want to use');
      return;
    }

    if (!ethers.utils.isAddress(address)) {
      setError('Address invalid');
      return;
    }

    setWaiting(true);
    window.electron.ipcRenderer.sendMessage('open-browser', [
      'RESTORE',
      address,
      APP_ADDRESS,
    ]);

    window.electron.ipcRenderer.once(
      'open-browser-reply',
      // @ts-ignore
      (response: Response) => {
        switch (response.channel) {
          case 'OnDoneRestore':
            window.electron.ipcRenderer.sendMessage('get-user-dir', []);
            window.electron.ipcRenderer.once(
              'get-user-dir-reply',
              async (userFilePath) => {
                await writeFileAsync(
                  userFilePath as string,
                  JSON.stringify(response.data, null, '\t')
                );
                notCtx.show(response.message, 'success');
                ctx?.checkValidity();
              }
            );
        }
        setWaiting(false);
      }
    );
  };

  return (
    <div className="w-full h-screen  bg-gradient-to-br from-indigo-500 p-5 flex justify-center items-center flex-col">
      <div className="w-full">
        <FontAwesomeIcon
          icon={faArrowLeft}
          size="2x"
          color="blue"
          className="hover:text-blue-700 cursor-pointer"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="h-2/6" />
      <div className="flex w-full h-full items-center flex-col">
        {waiting && (
          <h2 className="mb-5 font-bold">
            Waiting for restore license using metamask
          </h2>
        )}
        <div className="p-3 bg-gray-100 rounded shadow-md border-4">
          <h3 className="font-bold">Restore</h3>
          <h4>
            Please enter your ethereum Address you want to use to restore your
            license
          </h4>

          <div className="h-4" />
          <input
            type="text"
            value={address}
            placeholder={'Enter ethereum address here'}
            className="w-full p-2 bg-white rounded outline-black"
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="h-4" />

          <button
            className="w-full  rounded border-4  hover:font-bold mb-4"
            onClick={onRestore}
          >
            Next
          </button>
          {error !== '' && (
            <Alert
              content={error}
              title={'Error'}
              onHandleClose={() => setError('')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RestoreScreen;
