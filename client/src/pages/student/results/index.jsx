import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultCard } from '@/components/ui/result-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Award, Clock, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { GET_STUDENT_REGISTRATIONS_ROUTE } from '@/utils/constants';

const StudentResults = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    highestScore: 0,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${GET_STUDENT_REGISTRATIONS_ROUTE}/${userInfo.id}`, {withCredentials: true});
      setSubmissions(response.data.filter(sub => sub.status === 'completed'));
      console.log('Fetched submissions:', response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Không thể tải danh sách kết quả bài thi');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({ totalExams: 0, averageScore: 0, highestScore: 0 });
      return;
    }

    const completedSubmissions = data.filter(sub => sub.status === 'completed');
    const totalScore = completedSubmissions.reduce ((sum, sub) => sum + sub.total_score, 0);
    const length = completedSubmissions.length;
    const averagePercentage =  totalScore / length;  
    const highestPercentage = Math.max(...data.map(sub => sub.total_score));

    setStats({
      totalExams: completedSubmissions.length,
      averageScore: averagePercentage,
      highestScore: highestPercentage,
    });
  };

  const filterSubmissions = () => {
    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }

    const filtered = submissions.filter(submission =>
      submission.Exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.Exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-12">
      {/* Header */}
      <div className="pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Kết quả bài thi</h1>
        <Button
            className="bg-white border-none text-gray-700 hover:bg-gray-100" 
            variant="outline"
            onClick={fetchSubmissions}
            disabled={loading}
        >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="pb-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border-none">
          <CardContent className="flex items-center p-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng số bài thi đã làm</p>
              <p className="text-2xl font-bold">{stats.totalExams}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none">
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Điểm trung bình</p>
              <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none">
          <CardContent className="flex items-center p-6">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Điểm cao nhất</p>
              <p className="text-2xl font-bold">{stats.highestScore.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tìm kiếm */}
      <div className="pb-4 flex gap-4">
        <div className="flex-1 relative ">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên bài thi hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-none"
          />
        </div>
      </div>

      {/* Danh sách kết quả */}
      {filteredSubmissions.length === 0 ? (
        <Card className="bg-white border-none">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {submissions.length === 0 ? 'Chưa có bài thi nào' : 'Không tìm thấy kết quả'}
            </h3>
            <p className="text-gray-600 text-center">
              {submissions.length === 0 
                ? 'Bạn chưa hoàn thành bài thi nào. Hãy bắt đầu làm bài thi đầu tiên!'
                : 'Thử thay đổi từ khóa tìm kiếm để xem kết quả khác.'
              }
            </p>
            {submissions.length === 0 && (
              <Button 
                className="mt-4 bg-[#b8cae8] border-none"
                onClick={() => navigate('/student/exams')}
              >
                Xem danh sách bài thi
              </Button>
            )}
          </CardContent>
        </Card>
      ) : 
      (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((submission) => (
            <ResultCard
              key={submission.id}
              submission={submission}
            />
          ))}
        </div>
      )
      }
    </div>
  );
};

export default StudentResults;
