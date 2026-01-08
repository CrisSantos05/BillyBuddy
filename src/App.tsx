
import React, { useState, useEffect } from 'react';
export type UserRole = 'tutor' | 'vet' | 'admin';
import Login from './pages/Login';
import VetValidation from './pages/VetValidation';
import VetSettings from './pages/VetSettings';
import { AuthProvider, useAuth } from './context/AuthContext';
import TutorDashboard from './pages/TutorDashboard';
import VetDashboard from './pages/VetDashboard';
import VaccinationCard from './pages/VaccinationCard';
import Scheduling from './pages/Scheduling';
import RegistrationForm from './pages/RegistrationForm';
import DoseRegistration from './pages/DoseRegistration';
import ConsultationDetails from './pages/ConsultationDetails';
import TutorProfile from './pages/TutorProfile';
import Exams from './pages/Exams';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import PatientRegistration from './pages/PatientRegistration';
import ForcePasswordChange from './pages/ForcePasswordChange';
import VetProfileView from './pages/VetProfileView';
import ChangePassword from './pages/ChangePassword';

const AppContent: React.FC = () => {
  const { session, loading: authLoading, profile, user } = useAuth();

  // Persist Page State
  const [currentPage, setCurrentPage] = useState<string>('login');

  const [userRole, setUserRole] = useState<UserRole>('tutor');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedVetId, setSelectedVetId] = useState<string | null>(null);

  // Removed localStorage persistence for currentPage to ensure fresh login on reload

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Session - Auto Redirect
  useEffect(() => {
    if (authLoading) return;

    if (session && profile) {
      /* 1. Global Guard: Force Password Change (Desativado conforme pedido)
      if (profile.must_change_password) {
        if (currentPage !== 'force-password-change') {
          setCurrentPage('force-password-change');
        }
        return;
      }
      */

      // Removed Initial Login Redirect to force manual login
    }
  }, [session, profile, currentPage, authLoading]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login
          onLogin={(role) => {
            setUserRole(role);
            if (role === 'admin') {
              setCurrentPage('admin');
            } else {
              setCurrentPage(role === 'tutor' ? 'tutor-dashboard' : 'vet-dashboard');
            }
          }}
          navigateTo={setCurrentPage}
        />;
      case 'tutor-dashboard':
        return <TutorDashboard navigateTo={setCurrentPage} onSelectVet={(id) => { setSelectedVetId(id); setCurrentPage('vet-profile-view'); }} />;
      case 'vet-dashboard':
        return <VetDashboard navigateTo={setCurrentPage} />;
      case 'vaccination':
        return <VaccinationCard navigateTo={setCurrentPage} />;
      case 'scheduling':
        return <Scheduling navigateTo={setCurrentPage} />;
      case 'registration':
        return <RegistrationForm navigateTo={setCurrentPage} />;
      case 'dose-registration':
        return <DoseRegistration navigateTo={setCurrentPage} />;
      case 'consultation-details':
        return <ConsultationDetails navigateTo={setCurrentPage} />;
      case 'tutor-profile':
        return <TutorProfile navigateTo={setCurrentPage} />;
      case 'exams':
        return <Exams navigateTo={setCurrentPage} />;
      case 'admin-login':
        return <AdminLogin navigateTo={setCurrentPage} />;
      case 'patient-registration':
        return <PatientRegistration navigateTo={setCurrentPage} />;
      case 'force-password-change':
        return <ForcePasswordChange navigateTo={setCurrentPage} />;
      case 'admin':
        return <Admin navigateTo={setCurrentPage} />;
      case 'vet-validation':
        return <VetValidation navigateTo={setCurrentPage} onEditVet={(id) => { setSelectedVetId(id); setCurrentPage('edit-vet'); }} />;
      case 'edit-vet':
        return <RegistrationForm navigateTo={setCurrentPage} vetId={selectedVetId} />;
      case 'edit-vet-self':
        return <RegistrationForm navigateTo={setCurrentPage} vetId={user?.id} />;
      case 'vet-profile-view':
        return <VetProfileView navigateTo={setCurrentPage} vetId={selectedVetId} />;
      case 'vet-settings':
        return <VetSettings navigateTo={setCurrentPage} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />;
      case 'change-password':
        return <ChangePassword navigateTo={setCurrentPage} />;
      default:
        return <Login
          onLogin={(role) => {
            setUserRole(role);
            if (role === 'admin') {
              setCurrentPage('admin');
            } else {
              setCurrentPage(role === 'tutor' ? 'tutor-dashboard' : 'vet-dashboard');
            }
          }}
          navigateTo={setCurrentPage}
        />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-bold animate-pulse">Carregando BillyBuddy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] dark:bg-background-dark font-sans transition-colors duration-300 flex items-center justify-center">
      <div className="w-full max-w-md relative h-[100dvh] overflow-hidden shadow-2xl bg-white dark:bg-background-dark flex flex-col">
        {renderPage()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
