import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { ToastProvider } from './hooks/useToast';

// Pages
import Dashboard from './pages/Dashboard';
import AudioVerification from './pages/AudioVerification';
import RadarVerification from './pages/RadarVerification';
import RunsPage from './pages/Runs';
import ReportsPage from './pages/Reports';
import CalibrationLab from './pages/Calibration';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <ToastProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/audio" element={<AudioVerification />} />
          <Route path="/radar" element={<RadarVerification />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/calibration" element={<CalibrationLab />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </ToastProvider>
  );
}
