import React from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { LicenseManager } from './license/LicenseManager';
import LicenseProvider from './provider/LicenseProvider';
import NotificationProvider from './provider/NotificationProvider';
import ActiveScreen from './screens/ActiveScreen';
import MainScreen from './screens/MainScreen';
import PurchaseScreen from './screens/PurchaseScreen';
import RestoreScreen from './screens/RestoreScreen';

export default function App() {
  const [licenseManager, setLicenseManager] =
    React.useState<LicenseManager | null>(null);

  const routes = (
    <Routes>
      <Route path="/" element={<ActiveScreen />} />
      <Route path="/main" element={<MainScreen />} />
      <Route path="/purchase" element={<PurchaseScreen />} />
      <Route path="/restore" element={<RestoreScreen />} />
    </Routes>
  );
  
  return (
    <NotificationProvider>
      <Router>
        <LicenseProvider>{routes}</LicenseProvider>
      </Router>
    </NotificationProvider>
  );
}
