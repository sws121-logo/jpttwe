import React, { useState } from 'react';
import { Settings, FileText, Image, BookOpen, DollarSign } from 'lucide-react';
import NewsManagement from './admin/NewsManagement';
import GalleryManagement from './admin/GalleryManagement';
import ProgramsManagement from './admin/ProgramsManagement';
import FeesManagement from './admin/FeesManagement';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('news');

  const tabs = [
    { id: 'news', label: 'News Management', icon: FileText },
    { id: 'gallery', label: 'Gallery Management', icon: Image },
    { id: 'programs', label: 'Programs Management', icon: BookOpen },
    { id: 'fees', label: 'Fees Management', icon: DollarSign },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return <NewsManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'programs':
        return <ProgramsManagement />;
      case 'fees':
        return <FeesManagement />;
      default:
        return <NewsManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage college content and settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;