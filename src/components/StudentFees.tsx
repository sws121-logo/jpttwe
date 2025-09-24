import React from 'react';
import StudentFeesManagement from '../pages/StudentFeesManagement';

const StudentFees: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StudentFeesManagement />
      </div>
    </div>
  );
};

export default StudentFees;
