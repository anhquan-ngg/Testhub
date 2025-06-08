import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { ADD_EXAM_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store/index';
import { toast } from 'react-hot-toast';

import ExamForm from './components/ExamForm';
import QuestionList from './components/QuestionList';
import QuestionBank from './components/QuestionBank';

const CreateExam = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  const [questions, setQuestions] = useState([]);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    start_time: '',
    end_time: '',
  });

  // Xử lý submit form bài thi
  const handleSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
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

      const response = await apiClient.post(
        ADD_EXAM_ROUTE,
        examData,
        {withCredentials: true}
      );

      if (response.status === 201) {
        toast.success("Tạo bài thi thành công");
        navigate('/admin/exams');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo bài thi");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Tạo bài thi mới</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form thông tin bài thi */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bài thi</CardTitle>
            <CardDescription>Nhập thông tin cơ bản của bài thi</CardDescription>
          </CardHeader>
          <CardContent>
            <ExamForm
              onSubmit={handleSubmit}
              onCancel={() => navigate('/admin/exams')}
              isSubmitting={isSubmitting}
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
      />
    </div>
  );
};

export default CreateExam; 