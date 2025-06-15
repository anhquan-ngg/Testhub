import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { GET_LIST_EXAMS_ROUTE, DELETE_EXAM_ROUTE } from '../../../utils/constants';
import { toast } from 'sonner';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lí',
  'english': 'Tiếng Anh', 
  'chemistry': 'Hóa học'
};

const ExamManagement = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(GET_LIST_EXAMS_ROUTE, {withCredentials: true});
      if (response.status === 200) {
        setExams(response.data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateExam = () => {
    navigate('/admin/exams/create');
  };

  const handleEditExam = (examId) => {
    navigate(`/admin/exams/${examId}/edit`);
  };

  const handleDeleteExam = async (examId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài thi này?')) {
      try {
        // await apiClient.delete(`/api/admin/exams/${examId}`);
        const response = await apiClient.delete(
          `${DELETE_EXAM_ROUTE}/${examId}`, 
          {withCredentials: true}
        );
        if (response.status === 200) {
          toast.success('Xóa bài thi thành công');
          setExams(exams.filter(exam => exam.id !== examId));
        }
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleViewDetails = (exam) => {
    navigate(`/admin/exams/${exam.id}/details`);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'active':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quản lý bài thi</h1>
        <Button 
          className="bg-black text-white"
          onClick={handleCreateExam}
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo bài thi mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài thi..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={handleStatusFilter}
          className="px-4 py-2 border rounded-md bg-background"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="upcoming">Sắp diễn ra</option>
          <option value="active">Đang diễn ra</option>
          <option value="completed">Đã kết thúc</option>
        </select>
      </div>

      {/* Exams Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bài thi</TableHead>
              <TableHead>Thông tin</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <div className="font-medium">{exam.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Môn: {subjectMap[exam.subject] || exam.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{exam.totalQuestions} câu hỏi</div>
                    <div className="text-sm text-muted-foreground">
                      {exam.duration} phút
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(exam.status)}`}>
                      {getStatusText(exam.status)}
                    </span>
                    <div className="text-sm text-muted-foreground mt-1">
                      {exam.participants} thí sinh
                    </div>
                  </TableCell>
                  <TableCell>
                    <div> Từ {new Date(exam.start_time).toLocaleString('vi-VN')}</div>
                    <div className="text-sm text-muted-foreground">
                      Đến {new Date(exam.end_time).toLocaleString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(exam)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExam(exam.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Trang {currentPage} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-white border-none shadow-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết bài thi</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về bài thi
            </DialogDescription>
          </DialogHeader>
          {selectedExam && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-foreground">Thông tin chung</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="text-muted-foreground">Tên bài thi:</span> {selectedExam.title}</p>
                  <p><span className="text-muted-foreground">Môn học:</span> {subjectMap[selectedExam.subject] || selectedExam.subject}</p>
                  <p><span className="text-muted-foreground">Thời gian làm bài:</span> {selectedExam.duration} phút</p>
                  <p><span className="text-muted-foreground">Số câu hỏi:</span> {selectedExam.totalQuestions}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Thời gian</h3>
                <div className="mt-2 space-y-2">
                  <p><span className="text-muted-foreground">Bắt đầu:</span> {new Date(selectedExam.start_time).toLocaleString('vi-VN')}</p>
                  <p><span className="text-muted-foreground">Kết thúc:</span> {new Date(selectedExam.end_time).toLocaleString('vi-VN')}</p>
                  <p><span className="text-muted-foreground">Số thí sinh:</span> {selectedExam.participants}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              className="bg-black text-white"
              variant="outline" 
              onClick={() => setShowDetailsDialog(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamManagement;