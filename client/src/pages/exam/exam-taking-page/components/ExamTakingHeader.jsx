import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

const ExamTakingHeader = ({
  examTitle,
  timeLeft,
  subject,
}) => {
  return (
    <div className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{examTitle}</h1>
          <p className="text-sm text-gray-600">{subject}</p>
        </div>
        <div className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow">
          <Clock size={20} className="mr-2" />
          <span className="text-lg font-semibold" suppressHydrationWarning>
            {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamTakingHeader;