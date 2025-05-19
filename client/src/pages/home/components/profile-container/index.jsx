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
import { UPDATE_USER_INFO_ROUTE } from "@/utils/constants";
 
function ProfileContainer() {
  const {userInfo, setUserInfo} = useAppStore();
  const [updateInfo, setUpdateInfo] = useState({
    full_name: "",
    school: "",
    phone: "",
    address: "",
  })
  
  useEffect(() => {
    if (userInfo) {
      setUpdateInfo({
        full_name: userInfo.full_name || "",
        school: userInfo.school || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
    }
    }, [userInfo]);

  const handleInputChange = async(e) => {
    const {name, value} = e.target;
    setUpdateInfo((prev) => ({
        ...prev,
        [name]: value
    }))
  }

  const handleUpdateInfo = async() => {
    try {
      const response = await apiClient.put(
        UPDATE_USER_INFO_ROUTE,
        updateInfo,
        {withCredentials: true}
      )
      if (response.status === 200) {
        setUpdateInfo({
          school: "",
          phone: "",
          address: "",
        })
        setUserInfo(response.data.user)
      }
    } catch (error){
      console.log(error)
    }
  }

  return (
    <div className="p-12 w-full max-w-[1034px] max-md:mt-10 max-md:max-w-full">
      <div className="max-w-full w-[771px]">
        <div className="flex gap-5 max-md:flex-col">
          {/* User Profile Card */}
          <div className="flex-1">
            <Card className="h-full bg-white border-none rounded-xl">
              <CardContent className="flex flex-col items-center pt-6 pb-9">
                <img
                  src={Camera}
                  alt="Profile icon"
                  className="object-contain self-start w-10 aspect-square"
                />
                <Avatar className="mt-2 w-[100px] h-[100px]">
                  <AvatarImage
                    src={userInfo?.avatar}
                    alt="User"
                  />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="mt-1 text-base font-medium">{userInfo?.full_name}</div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Tests Card */}
          <div className="flex-1">
            <Card className="h-full bg-white border-none rounded-xl">
              <CardContent className="flex flex-col items-center pt-6 pb-9">
                <img
                  src={Frame}
                  alt="Completed tests"
                  className="object-contain self-start w-10 aspect-square"
                />
                <Badge
                  variant="secondary"
                  className="mt-5 px-8 py-8 text-xl bg-cyan-50 text-blue-950 rounded-full h-[72px] w-[72px] flex items-center justify-center"
                >
                  0
                </Badge>
                <div className="mt-5 text-base font-medium">Bài đã làm</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Tests Card */}
          <div className="flex-1">
            <Card className="h-full bg-white border-none rounded-xl">
              <CardContent className="flex flex-col items-center pt-6 pb-9">
                <img
                  src={Clipboard}
                  alt="Pending tests"
                  className="object-contain self-start w-10 aspect-square"
                />
                <Badge
                  variant="secondary"
                  className="mt-5 px-8 py-8 text-xl text-orange-400 bg-orange-50 rounded-full h-[72px] w-[72px] flex items-center justify-center"
                >
                  0
                </Badge>
                <div className="mt-5 text-base font-medium">Bài cần làm</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Personal Information and Profile Section */}
      <div className="mt-5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          {/* Personal Information Card */}
          <div className="w-6/12 max-md:ml-0 max-md:w-full">
            <Card className="w-127 h-full bg-white border-none">
              <CardHeader>
                <h3 className="text-xl font-medium">Thông tin cá nhân</h3>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="email" className="text-base">
                      Email :
                    </Label>
                    <div className="w-[330px] min-w-[240px] bg-zinc-300 rounded-xl px-4 py-2.5 text-sm text-neutral-400">
                      {userInfo?.email}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Label htmlFor="fullname" className="text-base">
                      Họ tên <span className="text-red-500">*</span> :
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      className="w-[330px] rounded-xl border-neutral-400"
                      value={updateInfo.full_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Label htmlFor="school" className="text-base">
                      Trường học :
                    </Label>
                    <Input
                      id="school"
                      name="school"
                      className="w-[330px] rounded-xl border-neutral-400"
                      value={updateInfo.school}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Label htmlFor="phone" className="text-base">
                      Số điện thoại :
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="w-[330px] rounded-xl border-neutral-400"
                      value={updateInfo.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Label htmlFor="address" className="text-base">
                      Địa chỉ :
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      className="w-[330px] rounded-xl border-neutral-400"
                      value={updateInfo.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      className="w-[330px] bg-slate-300 text-blue-700 rounded-xl cursor-pointer"
                      onClick={() => handleUpdateInfo()}
                    >
                      Cập nhật thông tin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <div className="pl-10 w-6/12 max-md:ml-0 max-md:w-full">
            <Card className="h-full w-127 bg-white border-none">
              <CardHeader>
                <h3 className="text-xl font-medium">Hồ sơ</h3>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-5 justify-between w-full">
                  <div className="flex">
                    <div className="py-5 pr-2 pl-5">
                      <div className="bg-zinc-300 min-h-[100px] w-[75px]"></div>
                    </div>
                    <div className="flex flex-col items-start my-auto text-base font-medium">
                      <div>Username</div>
                      <div className="mt-1.5">Email : user@email.com</div>
                      <div className="mt-2">CCCD/CMND: XXXXXXXXXXXX</div>
                      <div className="mt-2">Ngày sinh: XX/XX/XXXX</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="p-0">
                    <img
                      src={Edit}
                      alt="Edit"
                      className="object-contain w-6 aspect-square"
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileContainer;
