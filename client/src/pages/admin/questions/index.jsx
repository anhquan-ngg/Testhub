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
import { GET_LIST_QUESTIONS_ROUTE, DELETE_QUESTION_ROUTE } from '../../../utils/constants';
import { toast } from 'sonner';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lí',
  'english': 'Tiếng Anh', 
  'chemistry': 'Hóa học'
};

const typeMap = {
  'single-choice': 'Trắc nghiệm một đáp án',
  'multiple-choice': 'Trắc nghiệm nhiều đáp án',
  'fill-in-blank': 'Tự luận'
};

const QuestionManagement = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, subjectFilter, typeFilter]);

// Add the filter function
  const filterQuestions = () => {
    let filtered = [...questions];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(question =>
        question.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subject
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(question => 
        question.subject === subjectFilter
      );
    }

    // Filter by question type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(question => 
        question.type === typeFilter
      );
    }

    setFilteredQuestions(filtered);
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        GET_LIST_QUESTIONS_ROUTE,
        {withCredentials: true}
      );
      if (response.status === 200) {
        const questionData = response.data?.questions || [];
        setQuestions(questionData);
        setFilteredQuestions(questionData);
        setTotalPages(response.data?.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
      setFilteredQuestions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSubjectFilter = (e) => {
    setSubjectFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateQuestion = () => {
    navigate('/admin/questions/create');
  };

  const handleEditQuestion = (questionId) => {
    navigate(`/admin/questions/${questionId}/edit`);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const response = await apiClient.delete(
          `${DELETE_QUESTION_ROUTE}/${questionId}`,
          {withCredentials: true}
        );
        if (response.status === 200) {
          toast.success('Xóa câu hỏi thành công');
          setQuestions(questions.filter(question => question.id !== questionId));
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleViewDetails = (question) => {
    setSelectedQuestion(question);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Ngân hàng câu hỏi</h1>
        <Button 
          className="bg-black text-white"
          onClick={handleCreateQuestion}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm câu hỏi mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm câu hỏi..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={handleSubjectFilter}
          className="px-4 py-2 border rounded-md bg-background"
        >
          <option value="all">Tất cả môn học</option>
          {Object.entries(subjectMap).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={handleTypeFilter}
          className="px-4 py-2 border rounded-md bg-background"
        >
          <option value="all">Tất cả loại câu hỏi</option>
          {Object.entries(typeMap).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
      </div>

      {/* Questions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Câu hỏi</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead>Loại câu hỏi</TableHead>
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
            ) : filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center text-muted-foreground">
                  Không có câu hỏi nào
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <div className="font-medium line-clamp-2">{question.text}</div>
                  </TableCell>
                  <TableCell>
                    {subjectMap[question.subject] || question.subject}
                  </TableCell>
                  <TableCell>
                    {typeMap[question.type] || question.type}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(question)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuestion(question.id)}
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-white border-none shadow-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết câu hỏi</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về câu hỏi
            </DialogDescription>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-foreground">Nội dung câu hỏi</h3>
                <p className="mt-2">{selectedQuestion.text}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-foreground">Thông tin chung</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="text-muted-foreground">Môn học:</span> {subjectMap[selectedQuestion.subject]}</p>
                    <p><span className="text-muted-foreground">Loại câu hỏi:</span> {typeMap[selectedQuestion.type]}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Đáp án</h3>
                  <div className="mt-2 space-y-2">
                    {selectedQuestion.type === 'fill-in-blank' ? (
                      <div className="p-2 rounded bg-green-100">
                        {selectedQuestion.correct_answer}
                      </div>
                    ) : (
                      selectedQuestion.options?.map((option, index) => (
                        <div key={index} className={`p-2 rounded ${option.is_correct ? 'bg-green-100' : ''}`}>
                          {option.text}
                        </div>
                      ))
                    )}
                  </div>
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

export default QuestionManagement; 