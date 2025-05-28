import React from 'react';
import { CheckCircle, AlertCircle, Flag, Edit3 } from 'lucide-react'; // Icons

const QuestionNavigationPanel = ({
  questions,
  currentQuestionIndex,
  userAnswers,
  markedQuestions,
  onQuestionSelect,
}) => {
  const getQuestionStatus = (index) => {
    const questionId = questions[index].id;
    const isAnswered = userAnswers.hasOwnProperty(questionId) && userAnswers[questionId] !== null && userAnswers[questionId] !== '';
    const isMarked = markedQuestions.includes(questionId);

    if (index === currentQuestionIndex) return 'current';
    if (isMarked && isAnswered) return 'marked-answered';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const statusStyles = {
    current: 'bg-blue-500 text-white border-blue-700',
    answered: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
    unanswered: 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
    marked: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200',
    'marked-answered': 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200',
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).filter(qid => userAnswers[qid] !== null && userAnswers[qid] !== '').length;
  const markedCount = markedQuestions.length;

  return (
    <div className="bg-white shadow-sm p-3 mb-4 rounded-lg">
      <div className="mb-3 pb-3 border-b">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Điều hướng câu hỏi:</h3>
        <div className="grid grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-1.5">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => onQuestionSelect(index)}
              className={`
                w-full h-8 text-xs font-medium rounded border 
                flex items-center justify-center transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-blue-400
                ${statusStyles[getQuestionStatus(index)]}
              `}
              aria-label={`Câu ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-start items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        <span className="flex items-center"><Edit3 size={12} className="mr-1 text-blue-500" /> Câu hiện tại</span>
        <span className="flex items-center"><CheckCircle size={12} className="mr-1 text-green-500" /> Đã trả lời ({answeredCount})</span>
        <span className="flex items-center"><AlertCircle size={12} className="mr-1 text-gray-500" /> Chưa trả lời ({totalQuestions - answeredCount})</span>
        <span className="flex items-center"><Flag size={12} className="mr-1 text-yellow-500" /> Đã đánh dấu ({markedCount})</span>
      </div>
    </div>
  );
};

export default QuestionNavigationPanel;
