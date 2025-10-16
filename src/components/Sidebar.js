import React from 'react';
import { Database, Brain, BookOpen, FlaskConical, Menu, X, User } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, currentPage, onNavigate, currentUserRole }) => {
  const navigationItems = [
    { name: 'Dashboard', page: 'dashboard', icon: Database, color: 'text-gray-600' },
    { name: 'Primary Q-Bank', page: 'primary', icon: Brain, color: 'text-blue-600' },
    { name: 'Integrated Knowledge Q-Bank', page: 'integrated', icon: BookOpen, color: 'text-green-600' },
    { name: 'Clinical Simulator (CCS)', page: 'ccs', icon: FlaskConical, color: 'text-purple-600' },
  ];

  const roleConfig = {
    student: { title: "Medical Student", color: "blue" },
    resident: { title: "Resident", color: "green" },
    attending: { title: "Attending", color: "purple" },
    instructor: { title: "Instructor", color: "orange" }
  };

  const config = roleConfig[currentUserRole] || roleConfig.student;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 transform transition duration-200 ease-in-out 
        bg-gray-800 text-white w-64 p-5 z-30 flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-blue-400">MedPractice Pro</h2>
          </div>
          <button 
            className="md:hidden p-1 rounded-full hover:bg-gray-700" 
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Role Display */}
        <div className="mb-6 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 bg-${config.color}-500 rounded-full flex items-center justify-center`}>
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{config.title}</div>
              <div className="text-xs text-gray-300">Active Session</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                onClose();
              }}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg transition duration-150 text-left
                ${currentPage === item.page
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <p>Version 1.0.0</p>
            <p>© 2024 MedPractice Pro</p>
            <p className="text-green-400">● Online</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;