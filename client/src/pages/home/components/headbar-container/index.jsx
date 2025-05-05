import React from 'react';
import Icon from "@/assets/icon/dropdown-menu.svg";
import User from "@/assets/icon/user.svg";
import LogOut from "@/assets/icon/log-out.svg";
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from '@/lib/api-client';
import { LOGOUT_ROUTE } from '@/utils/constants';

const HeadbarContainer = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { 
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {withCredentials: true}
      );
      if (res.status == 200){
        navigate('/auth/login');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full h-15 bg-white flex items-center border-b-1 border-gray-200">
      <div className="absolute right-0 pr-20">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:ring-0 cursor-pointer">
            <div>
              <img src={Icon} alt="dropdown-menu" className='w-3 h-1.5'/>  
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white border-none">
            <DropdownMenuItem 
              className="hover:bg-gray-200 hover:text-gray-600"
              onClick={() => {
                navigate('/profile');
              }}
            >
              <img src={User} alt="User" className='w-4 h-4'/>
              Tài khoản
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-200 hover:text-gray-600"
              onClick={handleLogout}
            >
              <img src={LogOut} alt="Logout" className='w-4 h-4'/>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default HeadbarContainer