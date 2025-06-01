import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/index';
const NotFound = () => {
  const {userInfo} = useAppStore();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Trang không tồn tại</h2>
        <p className="mt-2 text-gray-600">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển</p>
        {!userInfo ? (
          <Link 
            to="/login" 
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Về trang đăng nhập
          </Link>
        ) : (
          <>
            {userInfo.role === "student" && (
              <Link 
                to="/student/exams" 
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Về trang chủ
              </Link>
            )}
            {userInfo.role === "admin" && (
              <Link 
                to="/admin/dashboard" 
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Về trang chủ
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotFound; 