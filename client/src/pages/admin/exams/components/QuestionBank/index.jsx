import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { GET_LIST_QUESTIONS_ROUTE } from '@/utils/constants';
import { toast } from 'react-hot-toast';

const questionTypeMap = {
  'single-choice': 'Một đáp án',
  'multiple-choice': 'Nhiều đáp án',
  'fill-in-blank': 'Tự luận'
};

const QuestionBank = ({ 
  open, 
  onOpenChange, 
  subject, 
  onAddQuestions,
  existingQuestions = [] // Danh sách câu hỏi đã có trong bài thi
}) => {
  const [loading, setLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  // Fetch câu hỏi từ ngân hàng đề thi
  const fetchQuestionBank = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(GET_LIST_QUESTIONS_ROUTE, {
        withCredentials: true,
        params: {
          subject,
          search: searchTerm
        }
      });
      if (response.status === 200) {
        // Lọc ra những câu hỏi chưa được thêm vào bài thi
        const existingQuestionIds = new Set(existingQuestions.map(q => q.id));
        const availableQuestions = (response.data?.questions || []).filter(
          question => !existingQuestionIds.has(question.id)
        );
        setQuestionBank(availableQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  // Load danh sách câu hỏi khi mở dialog
  useEffect(() => {
    if (open) {
      fetchQuestionBank();
    } else {
      // Reset state khi đóng dialog
      setSearchTerm('');
      setSelectedQuestions(new Set());
    }
  }, [open, subject]);

  // Load lại danh sách khi thay đổi từ khóa tìm kiếm
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (open) {
        fetchQuestionBank();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Xử lý chọn/bỏ chọn câu hỏi
  const toggleQuestionSelection = (question) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(question.id)) {
      newSelected.delete(question.id);
    } else {
      newSelected.add(question.id);
    }
    setSelectedQuestions(newSelected);
  };

  // Xử lý thêm câu hỏi đã chọn vào bài thi
  const handleAddQuestions = () => {
    const selectedQuestionsList = questionBank.filter(q => selectedQuestions.has(q.id));
    onAddQuestions(selectedQuestionsList);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader>
          <DialogTitle>Ngân hàng câu hỏi</DialogTitle>
          <DialogDescription>
            Chọn câu hỏi để thêm vào bài thi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search bar */}
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
          </div>

          {/* Question list */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="w-[150px]">Loại câu hỏi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : questionBank.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="3" className="text-center text-muted-foreground">
                      Không tìm thấy câu hỏi nào
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
                        <div className="line-clamp-2">{question.text}</div>
                      </TableCell>
                      <TableCell>
                        {questionTypeMap[question.type]}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
  );
};

export default QuestionBank; 