import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { GET_STATUS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const ExamCard = ({exam}) => {
    const navigate = useNavigate()
    const {userInfo} = useAppStore();
    const isExpired = new Date(exam.end_time) < new Date();
    const isNotStarted = new Date(exam.start_time) > new Date();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const checkIsRegistered = async () => {
            try {
                const response = await apiClient.get(
                    `${GET_STATUS_ROUTE}/${userInfo.id}/${exam.id}`,
                    {
                        withCredentials: true
                    });
                setIsRegistered(response.data.status === 'registered');
                setIsCompleted(response.data.status === 'completed');
            } catch (error) {
                console.error("Error checking registration status:", error);
            }
        }

        checkIsRegistered();
    },[]);

    return (
        <Card className="max-w border border-[#f5f5f5] bg-white">
            <CardHeader className="border-b-2 border-[#f5f5f5] pb-3">
                <CardTitle className="text-lg text-bold font-medium">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base text-[#8c8c8c] text-bold text-muted-foreground">Hình thức thi:</span>
                        <div className="inline-block px-2 py-1 rounded-2xl  bg-[#b8cae8] "
                        >
                            <span className="text-base text-bold text-[#0056d2]">Thi tại địa điểm thi</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base text-[#8c8c8c] text-bold text-muted-foreground">Thời gian đăng ký:</span>
                        <span className="text-sm">{formatDate(exam.start_time)} - {formatDate(exam.end_time)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base text-[#8c8c8c] text-bold text-muted-foreground">Thời gian thi:</span>
                        <span className="text-sm">{formatDate(exam.start_time)} - {formatDate(exam.end_time)}</span>
                    </div>

                    <div className="flex justify-end pt-2">
                        { isCompleted
                            ? <Button className = "text-base text-bold text-muted-foreground bg-[#f5f5f5] text-[#8c8c8c] disabled" >Đã hoàn thành</Button>
                            : isNotStarted
                            ? <Button className = "text-base text-bold text-muted-foreground bg-[#f5f5f5] text-[#8c8c8c] disabled" >Chưa bắt đầu</Button>
                            : isExpired
                            ? <Button className = "text-base text-bold text-muted-foreground bg-[#f5f5f5] text-[#8c8c8c] disabled" >Hết hạn đăng ký</Button>
                                : isRegistered
                                    ? 
                                    <Button 
                                        className = "text-base text-bold text-muted-foreground bg-[#2eb553] text-white hover: cursor-pointer"
                                        onClick = {() => navigate(`/student/exams/${exam.id}/take`)}
                                    >
                                        Vào thi
                                    </Button>
                                    : 
                                    <Button 
                                        className = "text-base text-bold text-muted-foreground bg-[#b8cae8] text-[#0056d2] hover: cursor-pointer" 
                                        onClick = {() => navigate(`/student/exams/${exam.id}/register`)}
                                    >
                                        Đăng ký
                                    </Button>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
  )
}

export default ExamCard;