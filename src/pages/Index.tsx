
import React from 'react';
import { useElection } from '@/contexts/ElectionContext';
import LoginForm from '@/components/auth/LoginForm';
import VoterDashboard from '@/components/voter/VoterDashboard';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Index = () => {
  const { currentUser, currentUserType } = useElection();

  if (!currentUser || !currentUserType) {
    return <LoginForm />;
  }

  if (currentUserType === 'voter') {
    return <VoterDashboard />;
  }

  if (currentUserType === 'admin') {
    return <AdminDashboard />;
  }

  return <LoginForm />;
};

export default Index;
