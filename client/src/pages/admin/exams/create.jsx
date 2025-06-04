import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Search, Plus, Trash2 } from 'lucide-react';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lí',
  'english': 'Tiếng Anh', 
  'chemistry': 'Hóa học'
};

const difficultyMap = {
  'easy': 'Dễ',
  'medium': 'Trung bình',
  'hard': 'Khó'
};

const CreateEditExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'math',
    duration: 60,
    start_time: '',
    end_time: '',
    questions: []
  });

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [questionBank, setQuestionBank] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  useEffect(() => {
    if (isEditing) {
      fetchExamData();
    }
  }, [id]);

  const fetchExamData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/admin/exams/${id}`);
      if (response.status === 200) {
        setFormData(response.data);
        setSelectedQuestions(new Set(response.data.questions.map(q => q.id)));
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionBank = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/questions', {
        params: {
          subject: formData.subject,
          search: searchTerm,
          difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined
        }
      });
      if (response.status === 200) {
        setQuestionBank(response.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showQuestionBank) {
      fetchQuestionBank();
    }
  }, [showQuestionBank, searchTerm, difficultyFilter, formData.subject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleQuestionSelection = (question) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(question.id)) {
      newSelected.delete(question.id);
    } else {
      newSelected.add(question.id);
    }
    setSelectedQuestions(newSelected);
  };

  const handleAddQuestions = () => {
    const selectedQuestionsList = questionBank.filter(q => selectedQuestions.has(q.id));
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, ...selectedQuestionsList]
    }));
    setShowQuestionBank(false);
  };

  const removeQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    setSelectedQuestions(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(questionId);
      return newSelected;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài thi');
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      alert('Vui lòng chọn thời gian bắt đầu và kết thúc');
      return;
    }

    if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      alert('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Vui lòng chọn ít nhất một câu hỏi');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await apiClient.put(`/api/admin/exams/${id}`, formData);
      } else {
        await apiClient.post('/api/admin/exams', formData);
      }
      navigate('/admin/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Có lỗi xảy ra khi lưu bài thi');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Chỉnh sửa bài thi' : 'Tạo bài thi mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">Tiêu đề bài thi</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề bài thi..."
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Môn học</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
            >
              {Object.entries(subjectMap).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Time Settings */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">Thời gian làm bài (phút)</label>
            <Input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Thời gian bắt đầu</label>
            <Input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Thời gian kết thúc</label>
            <Input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Danh sách câu hỏi</h2>
            <Button
              type="button"
              onClick={() => setShowQuestionBank(true)}
              className="bg-black text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm câu hỏi
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Độ khó</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="line-clamp-2">{question.content}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {difficultyMap[question.difficulty]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {formData.questions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="4" className="text-center text-muted-foreground">
                      Chưa có câu hỏi nào được thêm
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/exams')}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="bg-black text-white"
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Tạo mới')}
          </Button>
        </div>
      </form>

      {/* Question Bank Dialog */}
      <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>Ngân hàng câu hỏi</DialogTitle>
            <DialogDescription>
              Chọn câu hỏi để thêm vào bài thi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm câu hỏi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 border rounded-md bg-background"
              >
                <option value="all">Tất cả độ khó</option>
                {Object.entries(difficultyMap).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            {/* Questions Table */}
            <div className="rounded-md border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Độ khó</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    questionBank.map((question) => (
                      <TableRow 
                        key={question.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleQuestionSelection(question)}
                      >
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question.id)}
                            onChange={() => {}}
                            className="w-4 h-4"
                          />
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="line-clamp-2">{question.content}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}`}>
                            {difficultyMap[question.difficulty]}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {!loading && questionBank.length === 0 && (
                    <TableRow>
                      <TableCell colSpan="3" className="text-center text-muted-foreground">
                        Không tìm thấy câu hỏi nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowQuestionBank(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-black text-white"
              onClick={handleAddQuestions}
              disabled={selectedQuestions.size === 0}
            >
              Thêm {selectedQuestions.size} câu hỏi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateEditExam; 