import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  User, 
  Mail, 
  Phone, 
  School,
  MapPin,
  FileText
} from 'lucide-react';
import { useAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';
import { 
  GET_DETAIL_EXAM_ROUTE, 
  REGISTER_EXAM_ROUTE 
} from '@/utils/constants';
import { toast } from 'sonner';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lý',
  'chemistry': 'Hóa học', 
  'english': 'Tiếng Anh',
}

const ExamRegistration = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userInfo?.full_name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
    school: userInfo?.school || '',
    address: userInfo?.address || '',
  });

  useEffect(() => {
    fetchExamDetails();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
      `${GET_DETAIL_EXAM_ROUTE}/${examId}`, {
        withCredentials: true
      });
      setExam(response.data);
    } catch (error) {
      console.error('Error fetching exam details:', error);
      toast.error('Không thể tải thông tin bài thi');
      navigate('/student/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.full_name || !formData.email || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.post(REGISTER_EXAM_ROUTE, {
        exam_id: examId,
        user_id: userInfo.id,
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success('Đăng ký bài thi thành công!');
        navigate('/student/exams');
      }
    } catch (error) {
      console.error('Error registering exam:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Không tìm thấy thông tin bài thi</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/student/exams')}
          className="mt-4"
        >
          Quay lại danh sách bài thi
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#b8cae8] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#2563eb] mb-2">TESTHUB</h1>
          <h2 className="text-xl font-semibold text-gray-800">Đăng ký thi</h2>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Student Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin thí sinh
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Họ và tên *</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Nhập email"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="school">Trường học</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => handleInputChange('school', e.target.value)}
                        placeholder="Nhập tên trường"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Exam Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Thông tin bài thi
                  </h3>
                  
                  <Card className="border-2 border-blue-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-blue-700">{exam.title}</CardTitle>
                      <Badge variant="secondary" className="w-fit">
                        Môn: {subjectMap[exam.subject]}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Thời gian: {formatDuration(exam.duration)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Bắt đầu: {formatDate(exam.start_time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Kết thúc: {formatDate(exam.end_time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>Số câu hỏi: {exam.questions?.length || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Registration Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Xác nhận thông tin</h3>
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">{formData.full_name || 'Chưa nhập'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{formData.email || 'Chưa nhập'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Số điện thoại:</span>
                        <span className="font-medium">{formData.phone || 'Chưa nhập'}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bài thi:</span>
                        <span className="font-medium">{exam.title}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting || !formData.full_name || !formData.email || !formData.phone}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3"
                  size="lg"
                >
                  {submitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamRegistration;
