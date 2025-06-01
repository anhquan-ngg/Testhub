import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">403</h1>
        <h2 className="text-2xl font-semibold mt-4">Truy cập bị từ chối</h2>
        <p className="mt-2 text-gray-600">Bạn không có quyền truy cập trang này</p>
        <Link 
          to="/" 
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default Forbidden; 