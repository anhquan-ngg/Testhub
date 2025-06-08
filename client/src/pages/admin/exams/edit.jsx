import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';
import { GET_DETAIL_EXAM_ROUTE, PATCH_EXAM_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store/index';
import { toast } from 'sonner';

import ExamForm from './components/ExamForm';
import QuestionList from './components/QuestionList';
import QuestionBank from './components/QuestionBank';
import QuestionForm from './components/QuestionForm';

const EditExam = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    start_time: '',
    end_time: '',
  });

  // Load dữ liệu bài thi
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await apiClient.get(`${GET_DETAIL_EXAM_ROUTE}/${id}`, {
          withCredentials: true
        });
        if (response.status === 200) {
          const examData = response.data;
          console.log(examData);
          setFormData({
            title: examData.title,
            subject: examData.subject,
            duration: examData.duration,
            start_time: new Date(examData.start_time).toISOString().slice(0, 16),
            end_time: new Date(examData.end_time).toISOString().slice(0, 16),
          });

          // Cập nhật danh sách câu hỏi
          setQuestions(examData.questions?.map(q => ({
            id: q.id,
            content: q.text || q.content,
            type: q.type,
            score: q.score || 1,
            order: q.order,
            options: q.type === 'fill-in-blank' ? [] : (q.options || []).map(opt => ({
              content: opt.content,
              isCorrect: opt.is_correct
            })),
            answer: q.type === 'fill-in-blank' ? q.answer : null
          })));
        }
      } catch (error) {
        console.error('Error fetching exam:', error);
        toast.error('Không thể tải thông tin bài thi');
        navigate('/admin/exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Xử lý submit form bài thi
  const handleSubmit = async (data) => {
    try {
      // Kiểm tra thời gian
      const startTime = new Date(data.start_time);
      const endTime = new Date(data.end_time);
      
      if (endTime <= startTime) {
        toast.error("Thời gian kết thúc phải sau thời gian bắt đầu");
        return;
      }

      // Kiểm tra có câu hỏi nào chưa
      if (questions.length === 0) {
        toast.error("Vui lòng thêm ít nhất một câu hỏi");
        return;
      }

      // Cập nhật formData
      setFormData(data);

      // Chuẩn bị dữ liệu gửi lên
      const examData = {
        ...data,
        teacher_id: userInfo.id,
        questions: questions.map((q, index) => ({
          id: q.id,
          content: q.content || q.text,
          type: q.type,
          score: Number(q.score),
          order: index + 1,
          options: q.type === 'fill-in-blank' ? [] : (q.options || []).map(opt => ({
            content: opt.content,
            is_correct: opt.isCorrect || opt.is_correct
          })),
          answer: q.type === 'fill-in-blank' ? q.answer : null
        }))
      };

      const response = await apiClient.patch(
        `${PATCH_EXAM_ROUTE}/${id}`,
        examData,
        {withCredentials: true}
      );

      if (response.status === 200) {
        toast.success("Cập nhật bài thi thành công");
        navigate('/admin/exams');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật bài thi");
    }
  };

  // Xử lý thêm câu hỏi từ ngân hàng
  const handleAddQuestionsFromBank = (selectedQuestions) => {
    const newQuestions = selectedQuestions.map(q => ({
      ...q,
      order: questions.length + 1,
      score: 1,
      options: q.options ? q.options.map(opt => ({
        content: opt.content,
        isCorrect: opt.is_correct
      })) : []
    }));

    setQuestions(prev => [...prev, ...newQuestions]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Chỉnh sửa bài thi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form thông tin bài thi */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bài thi</CardTitle>
            <CardDescription>Chỉnh sửa thông tin cơ bản của bài thi</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamForm
              defaultValues={formData}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/admin/exams')}
            />
          </CardContent>
        </Card>

        {/* Quản lý câu hỏi */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách câu hỏi</CardTitle>
            <CardDescription>Quản lý các câu hỏi trong bài thi</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionList
              questions={questions}
              onQuestionsChange={setQuestions}
              onAddFromBank={() => setShowQuestionBank(true)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog ngân hàng câu hỏi */}
      <QuestionBank
        open={showQuestionBank}
        onOpenChange={setShowQuestionBank}
        subject={formData.subject}
        onAddQuestions={handleAddQuestionsFromBank}
        existingQuestions={questions}
      />
    </div>
  );
};

export default EditExam; 