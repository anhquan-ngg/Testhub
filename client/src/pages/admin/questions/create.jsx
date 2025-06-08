import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../lib/api-client';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { ADD_QUESTION_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store';
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

const CreateQuestion = () => {
  const navigate = useNavigate();
  const {userInfo} = useAppStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    subject: 'math',
    type: 'single-choice',
    options: [
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false }
    ],
    correct_anwser: '', // Đáp án cho câu hỏi tự luận
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, field, value) => {
    if (formData.type === 'single-choice' && field === 'is_correct' && value === true) {
      // Nếu là câu hỏi một đáp án, bỏ chọn tất cả các đáp án khác
      setFormData(prev => ({
        ...prev,
        options: prev.options.map((option, i) => ({
          ...option,
          is_correct: i === index
        }))
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        options: prev.options.map((option, i) => 
          i === index ? { ...option, [field]: value } : option
        )
      }));
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { text: '', is_correct: false }]
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      alert('Câu hỏi phải có ít nhất 2 đáp án');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.text.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    if (formData.type === 'single-choice' || formData.type === 'multiple-choice') {
      if (!formData.options.some(option => option.is_correct)) {
        toast.error('Vui lòng chọn ít nhất một đáp án đúng');
        return;
      }

      if (formData.options.some(option => !option.text.trim())) {
        toast.error('Vui lòng nhập nội dung cho tất cả các đáp án');
        return;
      }

      if (formData.type === 'single-choice' && formData.options.filter(opt => opt.is_correct).length > 1) {
        toast.error('Câu hỏi một đáp án chỉ được chọn một đáp án đúng');
        return;
      }
    } else if (formData.type === 'fill-in-blank') {
      if (!formData.correct_anwser.trim()) {
        toast.error('Vui lòng nhập đáp án mẫu cho câu hỏi tự luận');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await apiClient.post(
        ADD_QUESTION_ROUTE, 
        {...formData, created_by: userInfo.id}, 
        {withCredentials: true}
      );
      if (response.status === 201) {
        toast.success("Tạo câu hỏi thành công");
        navigate('/admin/questions');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Có lỗi xảy ra khi tạo câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Thêm câu hỏi mới</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Question text */}
        <div className="space-y-2">
          <label className="block font-medium">Nội dung câu hỏi</label>
          <Textarea
            name="text"
            value={formData.text}
            onChange={handleInputChange}
            placeholder="Nhập nội dung câu hỏi..."
            className="min-h-[100px]"
          />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <label className="block font-medium">Loại câu hỏi</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md bg-background"
            >
              {Object.entries(typeMap).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {(formData.type === 'single-choice' || formData.type === 'multiple-choice') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block font-medium">Đáp án</label>
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm đáp án
              </Button>
            </div>
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                      placeholder={`Đáp án ${index + 1}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={formData.type === 'single-choice' ? 'radio' : 'checkbox'}
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(index, 'is_correct', e.target.checked)}
                      className="w-4 h-4"
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
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fill in blank answer */}
        {formData.type === 'fill-in-blank' && (
          <div className="space-y-2">
            <label className="block font-medium">Đáp án mẫu</label>
            <Textarea
              name="correct_anwser"
              value={formData.correct_anwser}
              onChange={handleInputChange}
              placeholder="Nhập đáp án mẫu cho câu hỏi tự luận..."
              className="min-h-[100px]"
            />
          </div>
        )}

        {/* Submit buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/questions')}
          >
            Hủy
          </Button>
          <Button 
            type="submit"
            className="bg-black text-white"
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo câu hỏi'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion; 