import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileLicenseStorage } from 'renderer/license/LicenseStorage';

type Props = {};

const ActiveScreen = ({}: Props) => {

  const [fileLicenseStorage, setFileLicenseStorage] =
    useState<FileLicenseStorage | null>(null);

  // Window events
  const closeWindow = () => {
    window.electron.ipcRenderer.sendMessage('close', []);
  };


  return (
    <div className='w-full h-screen flex justify-center items-center p-2 bg-gradient-to-br from-indigo-500'>
      <div className='bg-blue-500 w-full p-3 rounded text-white'>
        <div
          className='w-full flex justify-end hover:text-blue-700 cursor-pointer'
          onClick={closeWindow}
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </div>
        <h3>Go to premium?</h3>
        <span>
          You can either{' '}
          <Link
            to='purchase'
            className='text-green-200 scale-100 hover:text-green-600'
          >
            Purchase
          </Link>{' '}
          a new license or
          <Link
            to={'restore'}
            className='text-green-200 scale-100 hover:text-green-600'
          >
            {' '}
            Restore
          </Link>
        </span>
      </div>
    </div>
  );
};

export default ActiveScreen;
