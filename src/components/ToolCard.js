import React from 'react';

const ToolCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 ${color} transform hover:scale-[1.02]`}
  >
    <div className={`p-3 rounded-full inline-flex ${color.replace('border-', 'bg-')} bg-opacity-10 mb-4`}>
      <Icon className={`w-8 h-8 ${color.replace('border-t-4', 'text-')}`} />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <p className={`mt-4 text-sm font-semibold ${color.replace('border-t-4', 'text-')}`}>
      Explore Tool &rarr;
    </p>
  </div>
);

export default ToolCard;