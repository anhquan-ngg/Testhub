import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Camera from "@/assets/icon/camera.svg"
import Frame from "@/assets/icon/frame.svg";
import Clipboard from "@/assets/icon/clipboard.svg";
import Edit from "@/assets/icon/edit.svg";
import { useAppStore } from "@/store";
import { useState, useEffect } from 'react';
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO_ROUTE, UPDATE_USER_INFO_ROUTE, GET_STUDENT_REGISTRATIONS_ROUTE } from "@/utils/constants";
import { set } from "react-hook-form";
 
function StudentProfile() {
  const {userInfo, setUserInfo} = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    school: '',
    phone: '',
    address: ''
  });
  const [listTest, setListTest] = useState([]);
  
  const fetchData = async() => {
    try {
      const [ getUserInfo, getListTest ] = await Promise.all([
        apiClient.get(GET_USER_INFO_ROUTE, {withCredentials: true}),
        apiClient.get(`${GET_STUDENT_REGISTRATIONS_ROUTE}/${userInfo.id}`, {withCredentials: true})
      ]);
      setUserInfo(getUserInfo.data);
      setFormData({
        full_name: getUserInfo.data.full_name,
        school: getUserInfo.data.school,
        phone: getUserInfo.data.phone,
        address: getUserInfo.data.address
      });
      setListTest(getListTest.data.filter(test => test.status === 'registered'));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        full_name: userInfo.full_name || '',
        school: userInfo.school || '',
        phone: userInfo.phone || '',
        address: userInfo.address || ''
      });
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleUpdateInfo = async() => {
    try {
      setIsLoading(true);
      const response = await apiClient.put(
        UPDATE_USER_INFO_ROUTE,
        formData,
        {withCredentials: true}
      );
      if (response.status === 200) {
        setUserInfo(response.data);
      }
    } catch (error){
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
            Hồ sơ cá nhân
          </h1>
        </div>

        {/* Top Cards Section - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* User Profile Card */}
          <Card className="bg-white border-none shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center pt-6 pb-6 sm:pt-8 sm:pb-8">
              <img
                src={Camera}
                alt="Profile icon"
                className="object-contain self-start w-8 h-8 sm:w-10 sm:h-10 mb-2"
              />
              <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px]">
                <AvatarImage
                  src={userInfo?.avatar}
                  alt="User"
                />
                <AvatarFallback className="text-lg sm:text-xl">
                  {formData.full_name ? formData.full_name.charAt(0).toUpperCase() : 'UN'}
                </AvatarFallback>
              </Avatar>
              <div className="mt-2 sm:mt-3 text-sm sm:text-base font-medium text-center px-2">
                {formData.full_name || 'Chưa có tên'}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tests Card */}
          <Card className="bg-white border-none shadow-sm rounded-xl">
            <CardContent className="flex flex-col items-center pt-6 pb-6 sm:pt-8 sm:pb-8">
              <img
                src={Clipboard}
                alt="Pending tests"
                className="object-contain self-start w-8 h-8 sm:w-10 sm:h-10 mb-2"
              />
              <Badge
                variant="secondary"
                className="mt-3 sm:mt-5 text-lg sm:text-xl text-orange-400 bg-orange-50 rounded-full h-16 w-16 sm:h-20 sm:w-20 lg:h-[72px] lg:w-[72px] flex items-center justify-center font-bold"
              >
                {listTest.filter(test => test.status === 'registered').length}
              </Badge>
              <div className="mt-3 sm:mt-5 text-sm sm:text-base font-medium text-center">
                Bài cần làm
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Information Section - Responsive */}
        <Card className="bg-white border-none shadow-sm rounded-xl">
          <CardHeader className="px-4 sm:px-6">
            <h3 className="text-lg sm:text-xl font-medium">Thông tin cá nhân</h3>
            <Separator className="mt-2" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Email Field - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="email" className="text-sm sm:text-base font-medium text-gray-700 min-w-0 sm:min-w-[120px]">
                  Email:
                </Label>
                <div className="w-full sm:w-[330px] bg-zinc-300 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutral-600 break-all">
                  {userInfo?.email}
                </div>
              </div>

              {/* Full Name Field - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="fullname" className="text-sm sm:text-base font-medium text-gray-700 min-w-0 sm:min-w-[120px]">
                  Họ tên <span className="text-red-500">*</span>:
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  className="w-full sm:w-[330px] rounded-xl border-neutral-400 text-sm sm:text-base"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* School Field - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="school" className="text-sm sm:text-base font-medium text-gray-700 min-w-0 sm:min-w-[120px]">
                  Trường học:
                </Label>
                <Input
                  id="school"
                  name="school"
                  className="w-full sm:w-[330px] rounded-xl border-neutral-400 text-sm sm:text-base"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Nhập tên trường học"
                />
              </div>

              {/* Phone Field - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="phone" className="text-sm sm:text-base font-medium text-gray-700 min-w-0 sm:min-w-[120px]">
                  Số điện thoại:
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  className="w-full sm:w-[330px] rounded-xl border-neutral-400 text-sm sm:text-base"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Address Field - Responsive */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <Label htmlFor="address" className="text-sm sm:text-base font-medium text-gray-700 min-w-0 sm:min-w-[120px]">
                  Địa chỉ:
                </Label>
                <Input
                  id="address"
                  name="address"
                  className="w-full sm:w-[330px] rounded-xl border-neutral-400 text-sm sm:text-base"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Update Button - Responsive */}
              <div className="flex justify-center sm:justify-end pt-4">
                <Button
                  variant="secondary"
                  className="w-full sm:w-[330px] bg-slate-300 text-blue-700 rounded-xl cursor-pointer text-sm sm:text-base py-2 sm:py-2.5"
                  onClick={handleUpdateInfo}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default StudentProfile;