import React from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const ExamTakingFooter = ({
  onSubmitExam,
  timeLeftFormatted, // Thời gian còn lại đã được format
  answeredCount,
  totalQuestions
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top p-3 z-40">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-xs text-gray-600 mb-2 sm:mb-0 text-center sm:text-left">
          <span>Thời gian còn lại: <strong className="text-blue-600">{timeLeftFormatted}</strong></span>
          <span className="mx-2 hidden sm:inline">|</span>
          <span className="block sm:inline mt-1 sm:mt-0">Đã làm: <strong className="text-green-600">{answeredCount}/{totalQuestions}</strong> câu</span>
        </div>
        <Button
          onClick={onSubmitExam}
          size="lg"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        >
          <Send size={18} className="mr-2" />
          NỘP BÀI VÀ KẾT THÚC
        </Button>
      </div>
    </div>
  );
};

export default ExamTakingFooter;
