import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  primary = true, 
  icon: Icon, 
  className = '',
  disabled = false,
  type = 'button'
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center space-x-2 px-4 py-2 font-medium rounded-lg transition duration-200 shadow-md ${className} 
      ${primary
        ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed'
      }`}
  >
    {Icon && <Icon className="w-5 h-5" />}
    <span>{children}</span>
  </button>
);

export default Button;