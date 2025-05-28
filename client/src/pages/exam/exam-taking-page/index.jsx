import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExamTakingHeader from './components/ExamTakingHeader';
import QuestionNavigationPanel from './components/QuestionNavigationPanel';
import QuestionDisplay from './components/QuestionDisplay';
import QuickQuestionJumper from './components/QuickQuestionJumper';
import ExamControls from './components/ExamControl';
import ExamTakingFooter from './components/ExamTakingFooter';
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

const mockExamData = {
  "id": "4",
  "title": "Đề thi đánh giá tư duy",
  "subject": "Môn: Toán",
  "duration": 5400,
  "questions": [
    {
      "id": "q1",
      "number": 1,
      "text": "Trong không gian Oxyz, cho mặt cầu (S) có tâm I(1; -2; 3) và bán kính R = 2. Phương trình của mặt cầu (S) là:",
      "type": "multiple-choice-single",
      "points": 0.2,
      "options": [
        { "id": "q1o1", "text": "(x + 1)² + (y - 2)² + (z + 3)² = 4" },
        { "id": "q1o2", "text": "(x - 1)² + (y + 2)² + (z - 3)² = 2" },
        { "id": "q1o3", "text": "(x - 1)² + (y + 2)² + (z - 3)² = 4" },
        { "id": "q1o4", "text": "(x + 1)² + (y - 2)² + (z + 3)² = 2" }
      ],
      "image": null
    },
    {
      "id": "q2",
      "number": 2,
      "text": "Cho hàm số y = ax³ + bx² + cx + d (a ≠ 0) có đồ thị như hình vẽ bên. Mệnh đề nào sau đây đúng?",
      "type": "multiple-choice-single",
      "points": 0.2,
      "options": [
        { "id": "q2o1", "text": "a > 0, d > 0" },
        { "id": "q2o2", "text": "a < 0, d > 0" },
        { "id": "q2o3", "text": "a > 0, d < 0" },
        { "id": "q2o4", "text": "a < 0, d < 0" }
      ],
      "image": "https://i.imgur.com/exampleGraph.png"
    },
    {
      "id": "q3",
      "number": 3,
      "text": "Tìm nguyên hàm của hàm số f(x) = 2x + 1.",
      "type": "fill-in-blank",
      "points": 0.2,
      "image": null
    },
    {
      "id": "q4",
      "number": 4,
      "text": "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA ⊥ (ABCD) và SA = a√3. Tính thể tích khối chóp S.ABCD.",
      "type": "fill-in-blank",
      "points": 0.2,
      "image": null
    },
    {
      "id": "q5",
      "number": 5,
      "text": "Những số nào sau đây là nghiệm của phương trình log₂(x² - x + 2) = 1 + log₂(x+1)? (Chọn tất cả các đáp án đúng)",
      "type": "multiple-choice-multiple",
      "points": 0.2,
      "options": [
        { "id": "q5o1", "text": "x = 0" },
        { "id": "q5o2", "text": "x = 1" },
        { "id": "q5o3", "text": "x = -1/2" },
        { "id": "q5o4", "text": "x = 2" }
      ],
      "image": null
    }
  ]
}

const ExamTakingPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState(mockExamData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // State cho trang làm bài
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [markedQuestions, setMarkedQuestions] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(mockExamData.duration);

  useEffect(() => {
    const loadExamData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setExamData(mockExamData);
        setError(null);
      } catch (err) {
        console.error("Failed to load exam data:", err);
        setError("Không thể tải dữ liệu bài thi. Vui lòng thử lại.");
        setExamData(null);
      } finally {
        setLoading(false);
      }
    };
    loadExamData();
  }, [examId]);

  const handleTimeUp = () => {
    console.log("Hết giờ làm bài!");
    setIsTimeUp(true);
    // Xử lý logic nộp bài tự động
  };

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

  const handleSubmitExam = () => {
    console.log("Người dùng yêu cầu nộp bài.");
  };

  const submitExamLogic = (message) => {
    console.log("Đang nộp bài...");
    console.log("Câu trả lời của người dùng:", userAnswers);
    alert(message); 
    navigate('/exams'); 
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl">Đang tải dữ liệu bài thi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl">Không tìm thấy dữ liệu bài thi.</p>
      </div>
    );
  }

  if (isTimeUp) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Hết giờ làm bài!</h1>
        <p className="text-lg mb-6">Bài thi của bạn đã được ghi nhận.</p>
        <button 
          onClick={() => navigate('/exams')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay về danh sách bài thi
        </button>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      <ExamTakingHeader
        examTitle={examData.title}
        subject={examData.subject}
        initialDurationInSeconds={examData.duration}
        onTimeUp={handleTimeUp}
      />
      <div className="container mx-auto p-4">
        <QuestionNavigationPanel
          questions={examData.questions}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          markedQuestions={markedQuestions}
          onQuestionSelect={handleQuestionSelect}
        />

        <QuestionDisplay
          question={currentQuestion}
          userAnswer={userAnswers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
          onMarkQuestion={handleMarkQuestion}
          isMarked={markedQuestions.includes(currentQuestion.id)}
        />

        <ExamControls
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={examData.questions.length}
          onPreviousQuestion={handlePreviousQuestion}
          onNextQuestion={handleNextQuestion}
        />

        <QuickQuestionJumper
          questions={examData.questions}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          markedQuestions={markedQuestions}
          onQuestionSelect={handleQuestionSelect}
        />
      </div>

      <ExamTakingFooter
          onSubmitExam={handleSubmitExam} // Sẽ dùng AlertDialogTrigger ở đây
          timeLeftFormatted={formattedTimeLeft}
          answeredCount={answeredCount}
          totalQuestions={examData.questions.length}
        />
    </div>
  );
  };
export default ExamTakingPage;