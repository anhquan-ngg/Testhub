import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { apiClient } from '@/lib/api-client';
import { GET_DETAIL_EXAM_ROUTE, PATCH_EXAM_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store/index';
import { toast } from 'react-hot-toast';

// Map môn học
const subjectMap = {
  'Toán': 'Toán',
  'Vật lý': 'Vật lý',
  'Hóa học': 'Hóa học',
  'Tiếng Anh': 'Tiếng Anh'
};

// Validation schema cho form chỉnh sửa bài thi
const examSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề bài thi'),
  subject: z.enum(['Toán', 'Vật lý', 'Hóa học', 'Tiếng Anh'], {
    required_error: 'Vui lòng chọn môn học'
  }),
  duration: z.number().min(1, 'Thời gian thi phải lớn hơn 0'),
  start_time: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  end_time: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
});

// Validation schema cho form câu hỏi
const questionSchema = z.object({
  content: z.string().min(1, 'Vui lòng nhập nội dung câu hỏi'),
  type: z.enum(['single-choice', 'multiple-choice', 'fill-in-blank']),
  options: z.array(z.object({
    content: z.string().min(1, 'Vui lòng nhập nội dung đáp án'),
    isCorrect: z.boolean(),
  })).min(2, 'Phải có ít nhất 2 đáp án'),
  score: z.number().min(0, 'Điểm số không được âm'),
});

const questionTypeMap = {
  'single-choice': 'Một đáp án',
  'multiple-choice': 'Nhiều đáp án',
  'fill-in-blank': 'Tự luận'
};

const EditExam = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID bài thi từ URL
  const { userInfo } = useAppStore();
  const [questions, setQuestions] = useState([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 60,
    start_time: '',
    end_time: '',
    questions: []
  });

  // Form cho bài thi
  const examForm = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      subject: '',
      duration: 60,
      start_time: '',
      end_time: '',
    },
  });

  // Form cho câu hỏi
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
      type: 'single-choice',
      options: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ],
      score: 1,
    },
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
          examForm.reset({
            title: examData.title,
            subject: examData.subject,
            duration: examData.duration,
            start_time: new Date(examData.start_time).toISOString().slice(0, 16),
            end_time: new Date(examData.end_time).toISOString().slice(0, 16),
          });

        // Cập nhật danh sách câu hỏi
          // setQuestions(examData.questions.map(q => ({
          //   ...q,
          //   id: q.id || Date.now(),
          //   options: q.type !== 'fill-in-blank' ? q.options.map(opt => ({
          //     content: opt.content,
          //     isCorrect: opt.is_correct
          //   })) : []
          // })));
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

  // Theo dõi thay đổi của form và cập nhật formData
  useEffect(() => {
    const subscription = examForm.watch((value) => {
      setFormData(prev => ({
        ...prev,
        ...value,
        questions: questions
      }));
    });
    return () => subscription.unsubscribe();
  }, [examForm, questions]);

  // Xử lý submit form bài thi
  const onSubmitExam = async (data) => {
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

      // Chuẩn bị dữ liệu gửi lên
      const examData = {
        title: data.title,
        subject: data.subject,
        duration: Number(data.duration),
        start_time: data.start_time,
        end_time: data.end_time,
        teacher_id: userInfo.id,
        questions: questions.map((q, index) => ({
          id: q.id,
          content: q.content,
          type: q.type,
          score: Number(q.score),
          order: index + 1,
          options: q.type === 'fill-in-blank' ? [] : q.options.map(opt => ({
            content: opt.content,
            is_correct: opt.isCorrect
          })),
          answer: q.type === 'fill-in-blank' ? q.answer : null
        }))
      };

      const response = await apiClient.put(
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

  // Xử lý submit form câu hỏi
  const onSubmitQuestion = (data) => {
    const newQuestion = {
      ...data,
      id: Date.now(),
      order: questions.length + 1
    };

    setQuestions(prev => [...prev, newQuestion]);
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    setShowQuestionDialog(false);
    questionForm.reset();
  };

  // Xử lý xóa câu hỏi
  const handleDeleteQuestion = (questionId) => {
    setQuestions(prev => {
      const newQuestions = prev.filter(q => q.id !== questionId);
      // Cập nhật lại order sau khi xóa
      return newQuestions.map((q, index) => ({
        ...q,
        order: index + 1
      }));
    });
  };

  // Xử lý kéo thả câu hỏi
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Cập nhật lại order sau khi kéo thả
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setQuestions(updatedItems);
    setFormData(prev => ({
      ...prev,
      questions: updatedItems
    }));
  };

  // Xử lý thêm/xóa đáp án
  const addOption = () => {
    const options = questionForm.getValues('options');
    questionForm.setValue('options', [...options, { content: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    const options = questionForm.getValues('options');
    questionForm.setValue('options', options.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div>Đang tải...</div>;
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
            <Form {...examForm}>
              <form onSubmit={examForm.handleSubmit(onSubmitExam)} className="space-y-4">
                <FormField
                  control={examForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={examForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Môn học</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn môn học">
                              {field.value ? subjectMap[field.value] : 'Chọn môn học'}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-none shadow-lg">
                          {Object.entries(subjectMap).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={examForm.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian (phút)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={examForm.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian bắt đầu</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={examForm.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian kết thúc</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate('/admin/exams')}>
                    Hủy
                  </Button>
                  <Button 
                    className="bg-black text-white"
                    type="submit"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Quản lý câu hỏi */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách câu hỏi</CardTitle>
            <CardDescription>Thêm, xóa và sắp xếp các câu hỏi cho bài thi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-black text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm câu hỏi
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border-none shadow-lg">
                  <DialogHeader>
                    <DialogTitle>Thêm câu hỏi mới</DialogTitle>
                    <DialogDescription>
                      Nhập thông tin chi tiết cho câu hỏi
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...questionForm}>
                    <form onSubmit={questionForm.handleSubmit(onSubmitQuestion)} className="space-y-4">
                      <FormField
                        control={questionForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung câu hỏi</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={questionForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại câu hỏi</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue>
                                    {field.value ? questionTypeMap[field.value] : 'Chọn loại câu hỏi'}
                                  </SelectValue>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white border-none shadow-lg">
                                <SelectItem value="single-choice">Một đáp án</SelectItem>
                                <SelectItem value="multiple-choice">Nhiều đáp án</SelectItem>
                                <SelectItem value="fill-in-blank">Tự luận</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        {/* Chỉ hiển thị phần đáp án cho câu hỏi trắc nghiệm */}
                        {(questionForm.watch('type') === 'single-choice' || 
                          questionForm.watch('type') === 'multiple-choice') && (
                          <>
                            <FormLabel>Đáp án</FormLabel>
                            {questionForm.watch('options').map((option, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  value={option.content}
                                  onChange={(e) => {
                                    const options = questionForm.getValues('options');
                                    options[index].content = e.target.value;
                                    questionForm.setValue('options', options);
                                  }}
                                  placeholder={`Đáp án ${index + 1}`}
                                />
                                <input
                                  type={questionForm.watch('type') === 'single-choice' ? 'radio' : 'checkbox'}
                                  name="correct-answer"
                                  checked={option.isCorrect}
                                  onChange={(e) => {
                                    const options = questionForm.getValues('options');
                                    // Nếu là single-choice, chỉ cho phép chọn 1 đáp án đúng
                                    if (questionForm.watch('type') === 'single-choice') {
                                      options.forEach((opt, i) => {
                                        opt.isCorrect = i === index;
                                      });
                                    } else {
                                      options[index].isCorrect = e.target.checked;
                                    }
                                    questionForm.setValue('options', options);
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index)}
                                  disabled={questionForm.watch('options').length <= 2}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={addOption}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Thêm đáp án
                            </Button>
                          </>
                        )}

                        {/* Hiển thị textarea cho câu hỏi tự luận */}
                        {questionForm.watch('type') === 'fill-in-blank' && (
                          <FormField
                            control={questionForm.control}
                            name="answer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Đáp án mẫu</FormLabel>
                                <FormControl>
                                  <Textarea {...field} placeholder="Nhập đáp án mẫu cho câu hỏi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>

                      <FormField
                        control={questionForm.control}
                        name="score"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Điểm số</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button 
                          className="bg-black text-white"
                          type="submit"
                        >
                          Thêm câu hỏi
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {questions.map((question, index) => (
                        <Draggable
                          key={question.id}
                          draggableId={question.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-2 p-2 border rounded-lg bg-background"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{question.content}</div>
                                <div className="text-sm text-muted-foreground">
                                  {questionTypeMap[question.type]} - {question.score} điểm
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  handleDeleteQuestion(question.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Tổng số câu hỏi: {questions.length}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditExam;