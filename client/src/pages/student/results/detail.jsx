import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProgressBar } from '@/components/ui/progress-bar';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  BookOpen, 
  Award, 
  CheckCircle, 
  XCircle,
  User,
  FileText
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { GET_SUBMISSION_RESULT_ROUTE } from '@/utils/constants';
import { toast } from 'sonner';

const ResultDetail = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResultDetail();
  }, [submissionId]);

  const fetchResultDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${GET_SUBMISSION_RESULT_ROUTE}/${submissionId}/result`, {
        withCredentials: true
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error fetching result detail:', error);
      toast.error('Không thể tải chi tiết kết quả bài thi');
      navigate('/student/results');
    } finally {
      setLoading(false);
    }
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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 80) return 'Xuất sắc';
    if (percentage >= 70) return 'Giỏi';
    if (percentage >= 60) return 'Khá';
    if (percentage >= 50) return 'Trung bình';
    return 'Yếu';
  };

  const renderUserAnswer = (question, userAnswer) => {
    if (!userAnswer) return <span className="text-gray-500 italic">Không trả lời</span>;

    if (question.type === 'fill-in-blank') {
      return <span className="font-medium">{userAnswer}</span>;
    }

    if (question.type === 'single-choice') {
      return <span className="font-medium">{userAnswer}</span>;
    }

    if (question.type === 'multiple-choice') {
      const answers = Array.isArray(userAnswer) ? userAnswer : [];
      return (
        <div className="space-y-1">
          {answers.map((answer, index) => (
            <div key={index} className="font-medium">{answer}</div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderCorrectAnswer = (question) => {
    if (question.type === 'fill-in-blank') {
      return <span className="font-medium text-green-600">{question.correct_answer}</span>;
    }

    const correctOptions = question.options.filter(opt => opt.is_correct);
    return (
      <div className="space-y-1">
        {correctOptions.map((option, index) => (
          <div key={index} className="font-medium text-green-600">{option.text}</div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy kết quả bài thi</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/results')}
          className="mt-4"
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const percentage = (result.score / result.totalScore) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/student/results')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Chi tiết kết quả bài thi</h1>
          <p className="text-gray-600">{result.exam.title}</p>
        </div>
      </div>

      {/* Thông tin tổng quan */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Thông tin bài thi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Thông tin bài thi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tên bài thi:</span>
              <span className="font-medium">{result.exam.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Môn học:</span>
              <span className="font-medium">{result.exam.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian cho phép:</span>
              <span className="font-medium">{formatDuration(result.exam.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian làm bài:</span>
              <span className="font-medium">{formatDuration(result.timeTaken)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày hoàn thành:</span>
              <span className="font-medium">{formatDate(result.submittedAt)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Kết quả */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Kết quả
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {result.score}/{result.totalScore}
              </div>
              <div className="text-lg text-gray-600 mt-1">
                {percentage.toFixed(1)}% - {getScoreLabel(percentage)}
              </div>
            </div>
            
            <ProgressBar 
              value={result.score} 
              max={result.totalScore} 
              showLabel={false}
            />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
                <div className="text-gray-600">Câu đúng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.totalQuestions - result.correctAnswers}
                </div>
                <div className="text-gray-600">Câu sai</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chi tiết từng câu hỏi */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết từng câu hỏi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.questionResults.map((questionResult, index) => (
              <div key={questionResult.question.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Câu {index + 1}:</span>
                    {questionResult.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <Badge variant={questionResult.isCorrect ? 'default' : 'destructive'}>
                    {questionResult.earnedScore}/{questionResult.question.score} điểm
                  </Badge>
                </div>

                <div className="mb-4">
                  <p className="text-gray-800 leading-relaxed">
                    {questionResult.question.text}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Câu trả lời của bạn:</h4>
                    <div className={`p-3 rounded-md ${
                      questionResult.isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {renderUserAnswer(questionResult.question, questionResult.userAnswer)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Đáp án đúng:</h4>
                    <div className="p-3 rounded-md bg-green-50">
                      {renderCorrectAnswer(questionResult.question)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultDetail;