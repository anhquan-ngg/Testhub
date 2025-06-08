import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const questionTypeMap = {
  'single-choice': 'Một đáp án',
  'multiple-choice': 'Nhiều đáp án',
  'fill-in-blank': 'Tự luận'
};

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

const QuestionForm = ({ open, onOpenChange, onSubmit }) => {
  const form = useForm({
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

  // Xử lý thêm/xóa đáp án
  const addOption = () => {
    const options = form.getValues('options');
    form.setValue('options', [...options, { content: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    const options = form.getValues('options');
    form.setValue('options', options.filter((_, i) => i !== index));
  };

  const handleSubmit = (data) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Thêm câu hỏi mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho câu hỏi
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              {(form.watch('type') === 'single-choice' || 
                form.watch('type') === 'multiple-choice') && (
                <>
                  <FormLabel>Đáp án</FormLabel>
                  {form.watch('options').map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option.content}
                        onChange={(e) => {
                          const options = form.getValues('options');
                          options[index].content = e.target.value;
                          form.setValue('options', options);
                        }}
                        placeholder={`Đáp án ${index + 1}`}
                      />
                      <input
                        type={form.watch('type') === 'single-choice' ? 'radio' : 'checkbox'}
                        name="correct-answer"
                        checked={option.isCorrect}
                        onChange={(e) => {
                          const options = form.getValues('options');
                          // Nếu là single-choice, chỉ cho phép chọn 1 đáp án đúng
                          if (form.watch('type') === 'single-choice') {
                            options.forEach((opt, i) => {
                              opt.isCorrect = i === index;
                            });
                          } else {
                            options[index].isCorrect = e.target.checked;
                          }
                          form.setValue('options', options);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        disabled={form.watch('options').length <= 2}
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
              {form.watch('type') === 'fill-in-blank' && (
                <FormField
                  control={form.control}
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
              control={form.control}
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
  );
};

export default QuestionForm; 