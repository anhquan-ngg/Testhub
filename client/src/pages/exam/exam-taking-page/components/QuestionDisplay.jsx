import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Flag } from 'lucide-react';
import { BlockMath } from 'react-katex';

const QuestionDisplay = ({
  question,
  userAnswer,
  onAnswerChange,
  onMarkQuestion,
  isMarked,
}) => {
  if (!question) return null;

  const handleSingleChoiceChange = (value) => {
    // Nếu giá trị mới giống với giá trị hiện tại, gán null để bỏ chọn
    const newValue = userAnswer?.toString() === value ? null : parseInt(value, 10);
    onAnswerChange(question.id, newValue);
  };

  const handleMultipleChoiceChange = (optionId, checked) => {
    // Ensure userAnswer is always an array
    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
    let newAnswer;
    
    if (checked) {
      newAnswer = [...currentAnswers, optionId].sort();
    } else {
      newAnswer = currentAnswers.filter(id => id !== optionId);
    }
    
    onAnswerChange(question.id, newAnswer);
  };

  const handleFillInBlankChange = (event) => {
    onAnswerChange(question.id, event.target.value);
  };

  const renderOptions = () => {
    switch (question.type) {
      case 'single-choice':
        return (
          <RadioGroup
            value={userAnswer?.toString() || ""} 
            onValueChange={handleSingleChoiceChange}
            className="space-y-2"
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50"
                onClick={() => handleSingleChoiceChange(index.toString())}
              >
                <RadioGroupItem 
                  value={index.toString()}
                  id={`${question.id}-${index}`}
                />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={Array.isArray(userAnswer) && userAnswer.includes(index)}
                  onCheckedChange={(checked) => handleMultipleChoiceChange(index, checked)}
                />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        );
      case 'fill-in-blank':
        return (
          <Input
            type="text"
            value={userAnswer || ""}
            onChange={handleFillInBlankChange}
            placeholder="Nhập câu trả lời của bạn..."
            className="mt-2"
          />
        );
      default:
        return <p className="text-red-500">Loại câu hỏi không được hỗ trợ.</p>;
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
            Câu hỏi:
          </h2>
        </div>
        <Button
          variant={isMarked ? "secondary" : "outline"}
          size="sm"
          onClick={() => onMarkQuestion(question.id)}
          className="flex items-center"
        >
          <Flag size={16} className={`mr-1.5 ${isMarked ? 'text-yellow-500 fill-yellow-400' : ''}`} />
          {isMarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        </Button>
      </div>

      <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
        {question.text}
      </div>

      {question.image && (
        <div className="mb-4 max-w-md mx-auto">
          <img src={question.image} alt={`Hình ảnh cho câu ${question.number}`} className="w-full h-auto rounded-md border" />
        </div>
      )}

      <div className="mt-4">
        {renderOptions()}
      </div>
    </div>
  );
};

export default QuestionDisplay;
