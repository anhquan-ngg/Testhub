import React from 'react';
import Logo from '@/assets/logo.svg';
import FileText from '@/assets/icon/file-text.svg';
import FileTextBlue from '@/assets/icon/file-text-blue.svg';
import User from '@/assets/icon/user.svg';
import UserBlue from '@/assets/icon/user-blue.svg';
import Frame from '@/assets/icon/frame.svg';
import FrameBlue from '@/assets/icon/frame-blue.svg';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ to, icon, iconActive, label }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-6 py-3 border-b border-gray-200 hover:bg-gray-50 ${
        isActive ? 'text-[#0056d2]' : 'text-black'
      }`}
    >
      <img
        src={isActive ? iconActive : icon}
        alt={label}
        className="w-6"
      />
      <span>{label}</span>
    </Link>
  );
};

const SidebarContainer = () => {
  return (
    <div className="md:w-[25vw] lg:w-[20vw] xl:w-[15vw] bg-white border-r-gray-400">
      <div className="p-[28px] items-center justify-center">
        <img src={Logo} alt='Logo' className="w-72"/>
      </div>
      
      <div className="text-md">
        <SidebarItem 
          to="/student/exams" 
          icon={FileText} 
          iconActive={FileTextBlue} 
          label="Bài thi" 
        />
        <SidebarItem 
          to="/student/results" 
          icon={Frame} 
          iconActive={FrameBlue} 
          label="Kết quả" 
        />
        <SidebarItem 
          to="/student/profile" 
          icon={User} 
          iconActive={UserBlue} 
          label="Tài khoản" 
        />
      </div>
    </div>
  );
};

export default SidebarContainer;