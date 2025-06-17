import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { apiClient } from '../../../lib/api-client';
import { Input } from '../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { GET_EXAM_DETAILS_ROUTE } from '../../../utils/constants';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lý',
  'chemistry': 'Hóa học', 
  'english' : 'Tiếng Anh',
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;  
  return hours > 0 ? `${hours}h ${minutes}m ${secs}s` : `${minutes}m ${secs}s`;
}

const ExamDetail = () => {
  const { id } = useParams();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]); // Only fetch when id changes

  useEffect(() => {
    // Filter exams when searchTerm changes
    const filtered = exams.filter(exam => 
      exam.User.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.User.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExams(filtered);
  }, [searchTerm, exams]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`${GET_EXAM_DETAILS_ROUTE}/${id}`, {
        withCredentials: true
      });
      if (response.status === 200) {
        const completedExams = response.data.filter(exam => exam.status === 'completed');
        setTitle(completedExams[0].Exam.title);
        setSubject(completedExams[0].Exam.subject);
        setExams(completedExams);
        setFilteredExams(completedExams);
    
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Thống kê bài thi
          </h1>
          <div className="mt-2 space-y-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {title}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
              Môn: {subjectMap[subject]}
            </span>
            <div className="flex">
              <h2 className="text-base font-semibold text-gray-800">Số lượng thí sinh đã làm bài: </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                {exams.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên sinh viên..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-4 px-6 font-semibold text-gray-900">Sinh viên</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-gray-900 text-center">Kết quả</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-gray-900 text-center">Số câu đúng</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-gray-900 text-center">Thời gian</TableHead>
              <TableHead className="py-4 px-6 font-semibold text-gray-900 text-center">Ngày nộp bài</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-12">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                    <span className="text-gray-500">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredExams.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-12">
                  <div className="text-gray-500">
                    <p className="font-medium">Không tìm thấy kết quả phù hợp</p>
                    <p className="text-sm mt-1">Vui lòng thử tìm kiếm khác</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredExams.map((exam) => (
                <TableRow key={exam.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-4 px-6">
                    <div className="font-medium text-gray-900">{exam.User.full_name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{exam.User.email}</div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">
                      {Math.round(exam.total_score * 10) / 10} điểm
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <div className="text-gray-900">
                      {exam.User.correctCount}/{exam.User.submissionCount}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <div className="text-gray-900 font-medium">
                      {formatTime(exam.User.Submissions[0].time_spent)}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 text-center">
                    <div className="text-gray-900">
                      {new Date(exam.updatedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExamDetail;