import React from 'react';

const QuickQuestionJumper = ({
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

  // Tương tự như trong QuestionNavigationPanel, nhưng có thể tùy chỉnh style nếu muốn
  const statusStyles = {
    current: 'bg-blue-500 text-white ring-2 ring-blue-300',
    answered: 'bg-green-200 text-green-800 hover:bg-green-300',
    unanswered: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    marked: 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300',
    'marked-answered': 'bg-purple-200 text-purple-800 hover:bg-purple-300',
  };

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">Chuyển nhanh đến câu:</h4>
      <div className="flex flex-wrap justify-center gap-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`
              w-8 h-8 text-xs font-medium rounded-full 
              flex items-center justify-center transition-colors duration-150
              focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-400
              ${statusStyles[getQuestionStatus(index)]}
            `}
            aria-label={`Câu ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestionJumper;
