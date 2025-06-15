import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExamTakingHeader from './components/ExamTakingHeader';
import QuestionDisplay from './components/QuestionDisplay';
import QuickQuestionJumper from './components/QuickQuestionJumper';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.jsx"
import { apiClient } from '@/lib/api-client';
import { GET_DETAIL_EXAM_ROUTE, ADD_SUBMISSION_ROUTE } from '@/utils/constants';
import { useAppStore } from './../../../store/index';
import { toast } from 'sonner';

const ExamTakingPage = () => {
  const {userInfo} = useAppStore();
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // State cho trang làm bài
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // Thêm state mới cho việc chọn câu hỏi
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [formData, setFormData] = useState({
    selectedAnswers: {}, // Lưu đáp án của các câu hỏi được chọn
    note: '', // Ghi chú cho các câu hỏi được chọn
  });

  // Thêm loading state

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Log để debug
        console.log('Fetching exam with ID:', examId);
        
        const response = await apiClient.get(
          `${GET_DETAIL_EXAM_ROUTE}/${examId}`,
          {withCredentials: true} // Thêm tùy chọn này nếu cần thiết để gửi cookie
        ); // Sửa đường dẫn API
        
        // Log response
        console.log('API Response:', response.data);

        if (!response.data) {
          throw new Error('Không có dữ liệu trả về');
        }

        setExamData(response.data);

      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setError(error.response?.data?.message || 'Không thể tải thông tin bài thi');
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId]);

  // Đầu tiên, thêm useCallback để memoize hàm handleTimeUp
  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    // Các xử lý khác khi hết giờ
  }, []); // Mảng rỗng vì không phụ thuộc giá trị nào

  // // Sau đó sửa lại useEffect đếm ngược
  // useEffect(() => {
  //   // Chỉ bắt đầu đếm khi có thời gian và chưa hết giờ
  //   if (timeLeft > 0 && !isTimeUp) {
  //     const timer = setInterval(() => {
  //       setTimeLeft((prevTime) => {
  //         if (prevTime <= 1) {
  //           clearInterval(timer);
  //           handleTimeUp();
  //           return 0;
  //         }
  //         return prevTime - 1;
  //       });
  //     }, 1000);

  //     // Cleanup function để clear interval khi component unmount
  //     return () => clearInterval(timer);
  //   }
  // }, [timeLeft, isTimeUp, handleTimeUp]); // Thêm đầy đủ các dependencies

  const handleQuestionSelect = (index) => {
    if (index >= 0 && index < examData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleMarkQuestion = (questionId) => {
    setMarkedQuestions(prevMarked => {
      if (prevMarked.includes(questionId)) {
        return prevMarked.filter(id => id !== questionId); // Bỏ đánh dấu
      } else {
        return [...prevMarked, questionId]; // Đánh dấu
      }
    });
  };

  // Hàm xử lý chọn câu hỏi
  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        // Nếu câu hỏi đã được chọn, bỏ chọn nó
        const newSelected = prev.filter(id => id !== questionId);
        // Xóa đáp án của câu hỏi này khỏi formData
        const newSelectedAnswers = { ...formData.selectedAnswers };
        delete newSelectedAnswers[questionId];
        setFormData(prev => ({
          ...prev,
          selectedAnswers: newSelectedAnswers
        }));
        return newSelected;
      } else {
        // Nếu câu hỏi chưa được chọn, thêm vào danh sách
        return [...prev, questionId];
      }
    });
  };

  // Hàm xử lý cập nhật đáp án cho câu hỏi được chọn
  const handleSelectedAnswerChange = (questionId, answer) => {
    if (selectedQuestions.includes(questionId)) {
      setFormData(prev => ({
        ...prev,
        selectedAnswers: {
          ...prev.selectedAnswers,
          [questionId]: answer
        }
      }));
    }
  };

  // Hàm xử lý cập nhật ghi chú
  const handleNoteChange = (note) => {
    setFormData(prev => ({
      ...prev,
      note
    }));
  };

  const handleSubmitExam = async () => {
    try {
      if (!examData || !userInfo || !userInfo.id) {
        toast.error('Thiếu thông tin cần thiết để nộp bài!');
        return;
      }

      const answers = Object.entries(userAnswers).reduce((acc, [questionId, answer]) => {
        if (answer !== null && answer !== undefined && answer !== '') {
          if (Array.isArray(answer)) {
            acc[questionId] = answer.map(Number);
          } else if (typeof answer === 'string') {
            acc[questionId] = answer;
          } else {
            acc[questionId] = Number(answer);
          }
        }
        return acc;
      }, {});

      if (Object.keys(answers).length === 0) {
        toast.error('Bạn chưa trả lời câu hỏi nào!');
        return;
      }

      const payload = {
        student_id: Number(userInfo.id),
        exam_id: examData.id.toString(),
        answers,
        time_spent: Math.max(1, Math.floor((examData.duration * 60) - timeLeft))
      };

      console.log('Submitting payload:', payload);

      const response = await apiClient.post(ADD_SUBMISSION_ROUTE, payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        toast.success('Nộp bài thành công!');
        navigate('/student/exams');
      }

    } catch (error) {
      console.error('Submit error:', {
        error,
      });

      if (error.response?.status === 400) {
        toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!');
      } else if (error.response?.status === 401) {
        toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else {
        toast.error('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
      }
    }
  };

  const answeredCount = useMemo(() => {
    return Object.keys(userAnswers).filter(qid => {
        const answer = userAnswers[qid];
        if (Array.isArray(answer)) return answer.length > 0; 
        return answer !== null && answer !== ''; 
    }).length;
  }, [userAnswers]);

  const formattedTimeLeft = useMemo(() => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [timeLeft]);

  // Loading state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <p>Đang tải...</p>
    </div>;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-600 mb-4">Lỗi: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }
  
  if (isTimeUp) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Hết giờ làm bài!</h1>
        <p className="text-lg mb-6">Bài thi của bạn đã được ghi nhận.</p>
        <button 
          onClick={() => navigate('/student/exams')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang danh sách bài thi
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header cố định ở trên cùng */}
      <div className="bg-white border-gray-200 shadow-sm sticky top-0 z-50">
        <ExamTakingHeader 
          examTitle={examData.title}
          timeLeft={formattedTimeLeft}
          onTimeUp={handleTimeUp}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Question number and navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Câu {currentQuestionIndex + 1}/{examData.questions.length}
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu trước
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === examData.questions.length - 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Câu tiếp
                </button>
              </div>
            </div>

            {/* Question content */}
            <div className="bg-white rounded-lg shadow-sm border-gray-200 p-6 mb-6">
              <QuestionDisplay
                question={examData.questions[currentQuestionIndex]}
                userAnswer={userAnswers[examData.questions[currentQuestionIndex].id]}
                onAnswerChange={handleAnswerChange}
                isMarked={markedQuestions.includes(examData.questions[currentQuestionIndex].id)}
                onMarkQuestion={handleMarkQuestion}
                isSelected={selectedQuestions.includes(examData.questions[currentQuestionIndex].id)}
                onSelectQuestion={() => handleSelectQuestion(examData.questions[currentQuestionIndex].id)}
                selectedAnswer={formData.selectedAnswers[examData.questions[currentQuestionIndex].id]}
                onSelectedAnswerChange={(answer) => handleSelectedAnswerChange(examData.questions[currentQuestionIndex].id, answer)}
              />
            </div>

            {/* Question controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => handleMarkQuestion(examData.questions[currentQuestionIndex].id)}
                  className="px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 border-gray-200 border-yellow-200 rounded-md hover:bg-yellow-100"
                >
                  {markedQuestions.includes(examData.questions[currentQuestionIndex].id)
                    ? "Bỏ đánh dấu"
                    : "Đánh dấu câu này"}
                </button>
                <button
                  onClick={() => handleSelectQuestion(examData.questions[currentQuestionIndex].id)}
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedQuestions.includes(examData.questions[currentQuestionIndex].id)
                      ? "text-blue-600 bg-blue-50 border-blue-200"
                      : "text-gray-600 bg-gray-50 border-gray-200"
                  } rounded-md hover:bg-opacity-75`}
                >
                  {selectedQuestions.includes(examData.questions[currentQuestionIndex].id)
                    ? "Bỏ chọn câu này"
                    : "Chọn câu này"}
                </button>
              </div>
            </div>

            {/* Note section for selected questions */}
            {selectedQuestions.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Ghi chú cho câu hỏi đã chọn</h3>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  className="w-full h-32 p-2 border border-gray-200 rounded-md"
                  placeholder="Nhập ghi chú của bạn ở đây..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar - Quick navigation */}
        <div className="w-72 bg-white border-l-gray-200 p-4 overflow-y-auto hidden xl:block">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tổng quan</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã làm:</span>
                <span className="text-sm font-medium text-gray-900">{answeredCount}/{examData.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đánh dấu:</span>
                <span className="text-sm font-medium text-gray-900">{markedQuestions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chưa làm:</span>
                <span className="text-sm font-medium text-gray-900">{examData.questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Đã chọn:</span>
                <span className="text-sm font-medium text-gray-900">{selectedQuestions.length}</span>
              </div>
            </div>
          </div>
          <QuickQuestionJumper
            questions={examData.questions}
            currentIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            markedQuestions={markedQuestions}
            selectedQuestions={selectedQuestions}
            onQuestionSelect={handleQuestionSelect}
          />
        </div>
      </div>

      {/* Footer cố định ở dưới cùng */}
      <div className="bg-white border-t-gray-200 shadow-sm sticky bottom-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                Đã làm: <span className="font-medium text-gray-900">{answeredCount}/{examData.questions.length}</span>
              </div>
              <div className="text-sm text-gray-600">
                Thời gian còn lại: <span className="font-medium text-gray-900">{formattedTimeLeft}</span>
              </div>
            </div>
            <button
              onClick={handleSubmitExam}
              className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Nộp bài
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamTakingPage;