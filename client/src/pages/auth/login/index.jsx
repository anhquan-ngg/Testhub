import Logo from '@/assets/logo.svg';
import User from '@/assets/icon/user.svg';
import Lock from '@/assets/icon/lock.svg';
import Eye from '@/assets/icon/eye.svg';
import EyeOff from '@/assets/icon/eye-off.svg';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import {LOGIN_ROUTE} from '@/utils/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner';
import { Link } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateLogin = () => {
    if (!email.length){
      toast.error("Email không được để trống");
      return false;
    }

    if (!password.length){
      toast.error("Mật khẩu không được để trống");
      return false;
    }

    return true;
  }


  const handleLogin = async () => {
    if (validateLogin()){
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          {email, password},
          {withCredentials: true}
        );
        if (res.data.user.id){
          setUserInfo(res.data.user);
          if (res.data.user.role == "student"){
            navigate('/exams');
          }
        }
        console.log(res.data);
      } catch (error) {
        const message = error.response?.data?.message || 'Đăng nhập thất bại';
        toast.error(message);
        console.log(error);
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-[#b8cae8] flex items-center justify-center font-sans" >
      <div className="flex flex-col items-center justify-start">
        <div className="p-[28px] items-center justify-center">
          <img src={Logo} alt='Logo' className="w-72"/>
        </div>
        <div className='h-124 w-116 gap-10 bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl'>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-medium mt-6 mb-6">Đăng nhập</h1>
            <p className="text-sm font-medium mb-6">Bạn chưa có tài khoản?{' '}
              <Link to="/auth/signup" className="text-[#0656d2]">Đăng ký ngay</Link>
            </p>
          </div>
          <div className="p-8">
          <label htmlFor="email" className="block text-base mb-1">
              Email <span className="text-red-600">*</span>
          </label>
          <div className="relative mb-5">                         
            <Input                                    
              placeholder="Email"            
              type="email"
              className="w-full border border-gray-300 rounded-xl my-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
              value={email}
              onChange={(e) => setEmail(e.target.value)}                  
            />
            <img src={User} className="absolute left-2 top-1/2 -translate-y-1/2 text-md text-black"/>
          </div>
          <label htmlFor="email" className="block text-base mb-1">
            Mật khẩu <span className="text-red-600">*</span>
          </label>   
          <div className="relative mb-8">
              <Input            
                placeholder="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-xl my-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img src={Lock} className="absolute left-2 top-1/2 -translate-y-1/2 text-md text-black"/>  
              <img  
                className="absolute right-2 top-1/2 -translate-y-1/2 text-md text-black"
                src={showPassword ? Eye : EyeOff }
                onClick={() => setShowPassword(!showPassword)}
              />                
          </div>            
          <Button className="w-full bg-[#0656d2] text-white font-semibold my-3 rounded-xl hover:bg-[#054bb8] transition-colors" onClick={handleLogin}>Đăng nhập</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
