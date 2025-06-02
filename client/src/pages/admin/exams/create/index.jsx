import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Validation schema cho form tạo bài thi
const examSchema = z.object({
  title: z.string().min(1, 'Vui lòng nhập tiêu đề bài thi'),
  subject: z.string().min(1, 'Vui lòng chọn môn học'),
  description: z.string(),
  duration: z.number().min(1, 'Thời gian thi phải lớn hơn 0'),
  startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
});

// Validation schema cho form tạo câu hỏi
const questionSchema = z.object({
  content: z.string().min(1, 'Vui lòng nhập nội dung câu hỏi'),
  type: z.enum(['single', 'multiple']),
  options: z.array(z.object({
    content: z.string().min(1, 'Vui lòng nhập nội dung đáp án'),
    isCorrect: z.boolean(),
  })).min(2, 'Phải có ít nhất 2 đáp án'),
  score: z.number().min(0, 'Điểm số không được âm'),
});

const CreateExam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);

  // Form cho bài thi
  const examForm = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: '',
      subject: '',
      description: '',
      duration: 60,
      startTime: '',
      endTime: '',
    },
  });

  // Form cho câu hỏi
  const questionForm = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
      type: 'single',
      options: [
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ],
      score: 1,
    },
  });

  // Xử lý submit form bài thi
  const onSubmitExam = async (data) => {
    try {
      // TODO: Gọi API tạo bài thi
      console.log('Exam data:', { ...data, questions });
      navigate('/admin/exams');
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  // Xử lý submit form câu hỏi
  const onSubmitQuestion = (data) => {
    setQuestions([...questions, { ...data, id: Date.now() }]);
    setShowQuestionDialog(false);
    questionForm.reset();
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

  // Xử lý kéo thả câu hỏi
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setQuestions(items);
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
            <CardDescription>Nhập các thông tin cơ bản của bài thi</CardDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn môn học" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="math">Toán</SelectItem>
                          <SelectItem value="physics">Vật lý</SelectItem>
                          <SelectItem value="chemistry">Hóa học</SelectItem>
                          <SelectItem value="english">Tiếng Anh</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={examForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
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
                    name="startTime"
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
                    name="endTime"
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
                    Tạo bài thi
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
            <CardDescription>Thêm và sắp xếp các câu hỏi cho bài thi</CardDescription>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Một đáp án</SelectItem>
                                <SelectItem value="multiple">Nhiều đáp án</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
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
                              type="checkbox"
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const options = questionForm.getValues('options');
                                options[index].isCorrect = e.target.checked;
                                questionForm.setValue('options', options);
                              }}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addOption}>
                          Thêm đáp án
                        </Button>
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
                                  {question.type === 'single' ? 'Một đáp án' : 'Nhiều đáp án'} - {question.score} điểm
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setQuestions(questions.filter((q) => q.id !== question.id));
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

export default CreateExam;