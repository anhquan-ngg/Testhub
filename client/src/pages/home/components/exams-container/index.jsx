import React from "react";
import ExamCard from "@/components/ui/exam-card";

const ExamContainer = () => {
  const examData = [
    {
      id: 1,
      title: "Bài thi số 1",
      registrationPeriod: "01/01/2024 - 15/01/2024",
      examDate: "20/01/2024",
      registrationEnd: "2024-01-15"
    },
    {
      id: 2,
      title: "Bài thi số 2",
      registrationPeriod: "10/01/2024 - 25/01/2024",
      examDate: "30/01/2024",
      registrationEnd: "2024-01-25"
    },
    {
      id: 3,
      title: "Bài thi số 3",
      registrationPeriod: "15/01/2024 - 30/01/2024",
      examDate: "05/02/2024",
      registrationEnd: "2024-01-30"
    },
    {
      id: 4,
      title: "Bài thi số 4",
      registrationPeriod: "10/05/2025 - 30/05/2025",
      examDate: "10/06/2025",
      registrationEnd: "2025-05-30"
    }
  ];

  return (
      <div className="pl-12 py-8 pr-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Bài thi</h2>
          <button className="px-6 py-2 bg-white text-blue-700 rounded-full hover:bg-blue-50">
            Xem tất cả các bài thi
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examData.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
  );
};

export default ExamContainer;