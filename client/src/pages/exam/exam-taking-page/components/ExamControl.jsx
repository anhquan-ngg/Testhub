import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ExamControls = ({
  currentQuestionIndex,
  totalQuestions,
  onPreviousQuestion,
  onNextQuestion,
}) => {
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = currentQuestionIndex < totalQuestions - 1;

  return (
    <div className="flex justify-between items-center mt-6 mb-4 p-4 bg-white rounded-lg shadow-sm">
      <Button
        onClick={onPreviousQuestion}
        disabled={!canGoPrevious}
        variant="outline"
        className="flex items-center"
      >
        <ChevronLeft size={18} className="mr-1.5" />
        Câu trước
      </Button>
      <span className="text-sm text-gray-600">
        Câu {currentQuestionIndex + 1} / {totalQuestions}
      </span>
      <Button
        onClick={onNextQuestion}
        disabled={!canGoNext}
        variant="outline"
        className="flex items-center"
      >
        Câu sau
        <ChevronRight size={18} className="ml-1.5" />
      </Button>
    </div>
  );
};

export default ExamControls;
