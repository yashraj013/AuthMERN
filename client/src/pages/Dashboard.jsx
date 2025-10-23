import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to your Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                You are successfully logged in!
              </p>
            </div>
            
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Account Status
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Your account is active and secure
                  </p>
                </div>
                
                <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Authentication
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    JWT token is valid and secure
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;