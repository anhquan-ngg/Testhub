import React from 'react';
import Logo from '@/assets/logo.svg';
import FileText from '@/assets/icon/file-text.svg';
import FileTextBlue from '@/assets/icon/file-text-blue.svg';
import User from '@/assets/icon/user.svg';
import UserBlue from '@/assets/icon/user-blue.svg';
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
    <div className="relative md:w-[25vw] lg:w-[20vw] xl:w-[15vw] bg-white border-r border-gray-200">
      <div className="h-15 px-4 py-4 border-b border-gray-300">
        <img src={Logo} alt="Logo" className="w-40" />
      </div>
      <div className="flex flex-col text-md">
        <SidebarItem
          to="/student/exams"
          icon={FileText}
          iconActive={FileTextBlue}
          label="Bài thi"
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
