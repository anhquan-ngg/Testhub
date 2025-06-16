import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Users, BookOpen, GraduationCap, Award } from 'lucide-react';
import { GET_RECENT_EXAMS_ROUTE, GET_RECENT_USERS_ROUTE } from '../../../utils/constants';

const subjectMap = {
  'math': 'Toán',
  'physics': 'Vật lý',
  'chemistry': 'Hóa học',
  'english': 'Tiếng Anh',
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    activeExams: 0,
    completedExams: 0
  });
  const [recentExams, setRecentExams] = useState([]);
  const [newStudents, setNewStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [getRecentExams, getRecentUsers] = await Promise.all([
        apiClient.get(GET_RECENT_EXAMS_ROUTE, {withCredentials: true}),
        apiClient.get(GET_RECENT_USERS_ROUTE, {withCredentials: true})
      ]);
      
      setStats({
        totalStudents: getRecentUsers.data.filter(user => user.role === 'student').length,
        totalExams: getRecentExams.data.length,
        activeExams: getRecentExams.data.filter(exam => exam.status === 'active').length,
        completedExams: getRecentExams.data.filter(exam => exam.status === 'finished').length
      });

      setRecentExams(getRecentExams.data);

      setNewStudents(getRecentUsers.data.filter(user => user.role === 'student'));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button 
          className="bg-black text-white"
          onClick={() => fetchDashboardData()}
        >
          Làm mới
        </Button>
      </div>

      {/* Thống kê */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tổng số học viên"
          value={stats.totalStudents}
          icon={Users}
          description="Học viên đã đăng ký"
        />
        <StatCard
          title="Tổng số bài thi"
          value={stats.totalExams}
          icon={BookOpen}
          description="Bài thi đã tạo"
        />
        <StatCard
          title="Bài thi đang diễn ra"
          value={stats.activeExams}
          icon={GraduationCap}
          description="Bài thi đang mở"
        />
        <StatCard
          title="Bài thi đã hoàn thành"
          value={stats.completedExams}
          icon={Award}
          description="Bài thi đã đóng"
        />
      </div>

      {/* Bài thi gần đây */}
      <Card>
        <CardHeader>
          <CardTitle>Bài thi gần đây</CardTitle>
          <CardDescription>
            Danh sách các bài thi được tạo gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bài thi</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>{subjectMap[exam.subject]}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exam.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : exam.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {exam.status === 'pending' 
                        ? 'Sắp diễn ra'
                        : exam.status === 'active' 
                        ? 'Đang diễn ra' 
                        : 'Đã kết thúc'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Học viên mới */}
      <Card>
        <CardHeader>
          <CardTitle>Học viên mới đăng ký</CardTitle>
          <CardDescription>
            Danh sách học viên đăng ký gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {new Date(student.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;