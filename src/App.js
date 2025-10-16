import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { onAuthStateChange, signInAnonymouslyUser } from './firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PrimaryQBank from './components/PrimaryQBank';
import IntegratedKnowledgeQBank from './components/IntegratedKnowledgeQBank';
import ClinicalSimulator from './components/ClinicalSimulator';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('student');
  const [isLoading, setIsLoading] = useState(true);

  // Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoading(false);
      } else {
        try {
          await signInAnonymouslyUser();
        } catch (error) {
          console.error('Authentication failed:', error);
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'primary':
        return <PrimaryQBank />;
      case 'integrated':
        return <IntegratedKnowledgeQBank />;
      case 'ccs':
        return <ClinicalSimulator />;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            currentUserRole={currentUserRole} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MedPractice Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <Sidebar 
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUserRole={currentUserRole}
      />

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 p-2 bg-blue-600 text-white rounded-lg shadow-lg z-40" 
        onClick={handleMenuToggle}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* User Role Selector */}
      <div className="fixed top-4 right-4 z-40">
        <select 
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-md"
        >
          <option value="student">Medical Student</option>
          <option value="resident">Resident</option>
          <option value="attending">Attending</option>
          <option value="instructor">Clinical Instructor</option>
        </select>
      </div>

      {/* Main Content Area */}
      <main className={`
        flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-auto transition-all duration-200
        ${isMenuOpen ? 'opacity-50 md:opacity-100' : 'opacity-100'}
      `}>
        {renderContent()}
      </main>

      {/* Back to Top Button */}
      <button
        id="back-to-top"
        className="fixed bottom-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition hidden z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </div>
  );
};

export default App;