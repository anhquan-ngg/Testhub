import React, { useEffect, useState } from "react";
import ExamCard from "@/components/ui/exam-card";
import { GET_LIST_EXAMS_ROUTE } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";

const StudentHome = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await apiClient.get(GET_LIST_EXAMS_ROUTE, {withCredentials: true});
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="pl-12 py-8 pr-8">
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="pl-12 py-8 pr-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Bài thi</h2>
        <button className="px-6 py-2 bg-white text-blue-700 rounded-full hover:bg-blue-50">
          Xem tất cả các bài thi
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
};

export default StudentHome;