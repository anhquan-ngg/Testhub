import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExamCard = ({exam}) => {
    const navigate = useNavigate()
    const isExpired = new Date(exam.registrationEnd) < new Date();
    const isRegistered = true;
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
                        <span className="text-sm">{exam.registrationPeriod}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base text-[#8c8c8c] text-bold text-muted-foreground">Thời gian thi:</span>
                        <span className="text-sm">{exam.examDate}</span>
                    </div>

                    <div className="flex justify-end pt-2">
                        {
                            isExpired 
                            ? <Button className = "text-base text-bold text-muted-foreground bg-[#f5f5f5] text-[#8c8c8c] disabled" >Hết hạn đăng ký</Button>
                                : isRegistered
                                    ? 
                                    <Button 
                                        className = "text-base text-bold text-muted-foreground bg-[#2eb553] text-white hover: cursor-pointer"
                                        onClick = {() => navigate(`/exams/${exam.id}`)}
                                    >
                                        Vào thi
                                    </Button>
                                    : <Button className = "text-base text-bold text-muted-foreground bg-[#b8cae8] text-[#0056d2] hover: cursor-pointer" >Đăng ký</Button>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>
  )
}

export default ExamCard