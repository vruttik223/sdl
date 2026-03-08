import AccountDashboard from '@/components/account/dashboard';
import ProtectedRoute from '@/components/common/ProtectedRoute';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <AccountDashboard />
    </ProtectedRoute>
  );
};

export default Dashboard;
