import React, { useState, useEffect } from 'react';
import { Database, Brain, BookOpen, FlaskConical, User, TrendingUp, Clock, Award } from 'lucide-react';
import ToolCard from './ToolCard';

const Dashboard = ({ currentUserRole, onNavigate }) => {
  const [userProgress, setUserProgress] = useState({
    primaryQBank: { completed: 45, total: 150, accuracy: 87 },
    integratedQBank: { completed: 32, total: 200, accuracy: 92 },
    ccsSimulator: { completed: 8, total: 50, accuracy: 78 }
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, action: 'Completed Cardiology Module', time: '2 hours ago', type: 'primary' },
    { id: 2, action: 'Started CCS Case #3', time: '4 hours ago', type: 'ccs' },
    { id: 3, action: 'Reviewed Drug Interactions', time: '1 day ago', type: 'integrated' },
    { id: 4, action: 'Completed Neurology Quiz', time: '2 days ago', type: 'primary' }
  ]);

  const [performanceByCategory, setPerformanceByCategory] = useState([
    { category: 'Cardiology', score: 92, questions: 45 },
    { category: 'Neurology', score: 85, questions: 38 },
    { category: 'Endocrinology', score: 78, questions: 32 },
    { category: 'Nephrology', score: 88, questions: 28 }
  ]);

  const roleConfig = {
    student: { 
      title: "Medical Student Dashboard", 
      color: "blue",
      icon: User,
      description: "Track your foundational learning progress and build clinical knowledge"
    },
    resident: { 
      title: "Resident Dashboard", 
      color: "green",
      icon: User,
      description: "Develop clinical reasoning skills with complex cases and evidence-based management"
    },
    attending: { 
      title: "Attending Physician Dashboard", 
      color: "purple",
      icon: User,
      description: "Stay current with latest guidelines and complex case management strategies"
    },
    instructor: { 
      title: "Clinical Instructor Dashboard", 
      color: "orange",
      icon: User,
      description: "Create custom curricula and track student progress with comprehensive analytics"
    }
  };

  const config = roleConfig[currentUserRole] || roleConfig.student;
  const Icon = config.icon;

  const calculateOverallScore = () => {
    const totalScore = (userProgress.primaryQBank.accuracy + userProgress.integratedQBank.accuracy + userProgress.ccsSimulator.accuracy) / 3;
    return Math.round(totalScore);
  };

  const getProgressPercentage = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'primary': return Brain;
      case 'integrated': return BookOpen;
      case 'ccs': return FlaskConical;
      default: return Database;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'primary': return 'bg-blue-500';
      case 'integrated': return 'bg-green-500';
      case 'ccs': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{config.title}</h1>
          <p className="text-lg text-gray-700">{config.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Current Role</div>
            <div className="font-semibold text-gray-800 capitalize flex items-center">
              <Icon className="w-5 h-5 mr-2" />
              {currentUserRole.replace('_', ' ')}
            </div>
          </div>
          <div className={`w-16 h-16 bg-${config.color}-100 rounded-full flex items-center justify-center`}>
            <Icon className={`w-8 h-8 text-${config.color}-600`} />
          </div>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Primary Q-Bank</p>
              <p className="text-2xl font-bold text-blue-600">
                {userProgress.primaryQBank.completed}/{userProgress.primaryQBank.total}
              </p>
              <p className="text-sm text-gray-500">{getProgressPercentage(userProgress.primaryQBank.completed, userProgress.primaryQBank.total)}% Complete</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage(userProgress.primaryQBank.completed, userProgress.primaryQBank.total)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Integrated Q-Bank</p>
              <p className="text-2xl font-bold text-green-600">
                {userProgress.integratedQBank.completed}/{userProgress.integratedQBank.total}
              </p>
              <p className="text-sm text-gray-500">{getProgressPercentage(userProgress.integratedQBank.completed, userProgress.integratedQBank.total)}% Complete</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage(userProgress.integratedQBank.completed, userProgress.integratedQBank.total)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">CCS Simulator</p>
              <p className="text-2xl font-bold text-purple-600">
                {userProgress.ccsSimulator.completed}/{userProgress.ccsSimulator.total}
              </p>
              <p className="text-sm text-gray-500">{getProgressPercentage(userProgress.ccsSimulator.completed, userProgress.ccsSimulator.total)}% Complete</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage(userProgress.ccsSimulator.completed, userProgress.ccsSimulator.total)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(calculateOverallScore())}`}>
                {calculateOverallScore()}%
              </p>
              <p className="text-sm text-gray-500">+5% this week</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Access</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <ToolCard
            title="Primary Q-Bank"
            description="The Gold Standard Q-Bank for exam-style practice, question logic, and detailed, educational explanations."
            icon={Brain}
            color="border-t-blue-500 text-blue-500"
            onClick={() => onNavigate('primary')}
          />
          <ToolCard
            title="Integrated Knowledge Q-Bank"
            description="A comprehensive Q-Bank platform that integrates practice questions with a built-in medical knowledge library."
            icon={BookOpen}
            color="border-t-green-500 text-green-500"
            onClick={() => onNavigate('integrated')}
          />
          <ToolCard
            title="Clinical Management Simulator"
            description="A dedicated platform for practicing the Computer-Based Case Simulations (CCS) component of Step 3."
            icon={FlaskConical}
            color="border-t-purple-500 text-purple-500"
            onClick={() => onNavigate('ccs')}
          />
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {performanceByCategory.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">{item.category}</span>
                  <span className={`font-semibold ${getScoreColor(item.score)}`}>{item.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.score >= 90 ? 'bg-green-500' : 
                      item.score >= 80 ? 'bg-blue-500' : 
                      item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{item.questions} questions completed</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${getActivityColor(activity.type)}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                  <ActivityIcon className="w-4 h-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Role-specific Content */}
      {currentUserRole === 'instructor' && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Progress Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Primary Q-Bank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Integrated Q-Bank</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">CCS Simulator</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Overall Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">John Smith</td>
                  <td className="py-3 px-4">45/150 (30%)</td>
                  <td className="py-3 px-4">32/200 (16%)</td>
                  <td className="py-3 px-4">8/50 (16%)</td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">85%</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4">78/150 (52%)</td>
                  <td className="py-3 px-4">65/200 (32%)</td>
                  <td className="py-3 px-4">15/50 (30%)</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">92%</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Michael Chen</td>
                  <td className="py-3 px-4">120/150 (80%)</td>
                  <td className="py-3 px-4">150/200 (75%)</td>
                  <td className="py-3 px-4">35/50 (70%)</td>
                  <td className="py-3 px-4">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">88%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Study Recommendations */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-xl mt-8">
        <h3 className="text-2xl font-bold mb-4">Study Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Focus Areas</h4>
            <ul className="space-y-1 text-sm">
              <li>• Complete remaining Cardiology questions</li>
              <li>• Practice more CCS cases for time management</li>
              <li>• Review Endocrinology concepts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Upcoming Goals</h4>
            <ul className="space-y-1 text-sm">
              <li>• Complete 50 more Primary Q-Bank questions</li>
              <li>• Finish 3 CCS cases this week</li>
              <li>• Achieve 90% accuracy in Neurology</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;