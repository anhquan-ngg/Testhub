import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Clock, Calendar, BookOpen, Award } from 'lucide-react';
import { ProgressBar } from './progress-bar';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lý',
  'chemistry': 'Hóa học',
  'english': 'Tiếng Anh',
}

const ResultCard = ({ 
  submission, 
  className 
}) => {
  const { Exam, updatedAt, total_score } = submission
  
  const formatDuration = (second) => {
    return '' + Math.floor(second / 60) + ' phút ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`bg-white border-none hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {Exam.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{subjectMap[Exam.subject]}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Điểm số và tiến độ */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Điểm số</span>
            <span className="text-lg font-bold text-gray-900">
              {Math.round(total_score * 10) / 10}
            </span>
          </div>
          <ProgressBar 
            value={total_score} 
            max={10} 
            showLabel={false}
            size="sm"
          />
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Đúng:</span>
            <span className="font-medium">
              {Exam.correctCount}/{Exam.submissionCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-medium">
              {formatDuration(Exam.Submissions[0].time_spent)}
            </span>
          </div>
        </div>

        {/* Ngày làm bài */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
          <Calendar className="w-4 h-4" />
          <span>Hoàn thành{' '}
            {formatDate(updatedAt)}
            </span>
        </div>

      </CardContent>
    </Card>
  );
};

export { ResultCard };
