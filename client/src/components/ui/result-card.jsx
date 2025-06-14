import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Clock, Calendar, BookOpen, Award } from 'lucide-react';
import { ProgressBar } from './progress-bar';

const ResultCard = ({ 
  submission, 
  onViewDetail,
  className 
}) => {
  const { score, Exam, submitted_at, time_taken, total_questions, correct_answers } = submission;
  const percentage = (score / Exam.total_score) * 100;
  
  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 80) return 'default'; // green
    if (percentage >= 60) return 'secondary'; // yellow
    return 'destructive'; // red
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 80) return 'Xuất sắc';
    if (percentage >= 70) return 'Giỏi';
    if (percentage >= 60) return 'Khá';
    if (percentage >= 50) return 'Trung bình';
    return 'Yếu';
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {Exam.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{Exam.subject}</span>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(percentage)}>
            {getScoreLabel(percentage)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Điểm số và tiến độ */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Điểm số</span>
            <span className="text-lg font-bold text-gray-900">
              {score}/{Exam.total_score}
            </span>
          </div>
          <ProgressBar 
            value={score} 
            max={Exam.total_score} 
            showLabel={false}
            size="sm"
          />
        </div>

        {/* Thống kê */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">Đúng:</span>
            <span className="font-medium">{correct_answers}/{total_questions}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-medium">{formatDuration(time_taken)}</span>
          </div>
        </div>

        {/* Ngày làm bài */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
          <Calendar className="w-4 h-4" />
          <span>Hoàn thành lúc: {formatDate(submitted_at)}</span>
        </div>

        {/* Nút xem chi tiết */}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => onViewDetail(submission.id)}
        >
          Xem chi tiết kết quả
        </Button>
      </CardContent>
    </Card>
  );
};

export { ResultCard };
