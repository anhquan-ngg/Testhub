import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

const ExamTakingHeader = ({
  examTitle,
  subject,
  currentTimeLeft,
}) => {
  const formatTime = useMemo(() => {
    if (currentTimeLeft === undefined || currentTimeLeft < 0) return "00:00";
    const hours = Math.floor(currentTimeLeft / 3600);
    const minutes = Math.floor((currentTimeLeft % 3600) / 60);
    const seconds = currentTimeLeft % 60;

    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [currentTimeLeft]);

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
            {formatTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamTakingHeader;