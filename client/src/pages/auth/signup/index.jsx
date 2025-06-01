import Logo from '@/assets/logo.svg';
import Eye from '@/assets/icon/eye.svg';
import EyeOff from '@/assets/icon/eye-off.svg';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import {SIGNUP_ROUTE } from '@/utils/constants';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'sonner';
import {Link} from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const {userInfo, setUserInfo} = useAppStore();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'student'){
        navigate('/student/exams');
      } else if (userInfo.role === 'admin'){
        navigate('/admin/dashboard');
      }
    }
  }, [userInfo, navigate]);


  const validateSignup = () => {
    if (!fullname.length){
      toast.error("Họ và tên không được để trống");
      return false;
    }

    if (!email.length){
      toast.error("Email không được để trống");
      return false;
    }

    if (!password.length){
      toast.error("Mật khẩu không được để trống");
      return false;
    }

    if (password != confirmPassword){
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    return true;
  }

  const handleSignup = async () => {
    if (validateSignup()){
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          {full_name: fullname, phone, email, password},
          {withCredentials: true}
        );
        if (res.status == 201){
          setUserInfo(res.data.user);
        }
        toast.info('Đăng ký thành công');
      } catch (error) {
        const message = error.response?.data?.message || 'Đăng ký thất bại';
        toast.error(message);
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-[#b8cae8] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center justify-start">
        <div className="p-[28px] items-center justify-center">
          <img src={Logo} alt='Logo' className="w-72"/>
        </div>
        <div className='h-196 w-116 gap-10 bg-white border-2 border-white text-opacity-90 shadow-2xl rounded-3xl'>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-medium mt-6 mb-6">Đăng ký</h1>
            <p className="text-sm font-medium mb-6">Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-[#0656d2]">Đăng nhập ngay</Link>
            </p>
          </div>
          <div className="p-8">
          <label htmlFor="email" className="block text-base mb-1">
              Họ tên <span className="text-red-600">*</span>
          </label>
          <div className="relative mb-5">                         
            <Input                                    
              placeholder="Điền đầy đủ theo họ tên trên CMND/CCCD"            
              type="text"
              className="w-full border border-gray-300 rounded-xl my-3 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}                  
            />
          </div>
          <label htmlFor="email" className="block text-base mb-1">
              Email <span className="text-red-600">*</span>
          </label>
          <div className="relative mb-5">                         
            <Input                                    
              placeholder="Email"            
              type="email"
              className="w-full border border-gray-300 rounded-xl my-3 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
              value={email}
              onChange={(e) => setEmail(e.target.value)}                  
            />
          </div>
          <label htmlFor="email" className="block text-base mb-1">
              Số điện thoại
          </label>
          <div className="relative mb-5">                         
            <Input                                    
              placeholder="Số điện thoại liên hệ"            
              type="text"
              className="w-full border border-gray-300 rounded-xl my-3 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
              value={phone}
              onChange={(e) => setPhone(e.target.value)}                  
            />
          </div>
          <label htmlFor="email" className="block text-base mb-1">
              Mật khẩu <span className="text-red-600">*</span>
          </label>
          <div className="relative mb-5">                         
            <Input                                    
              placeholder="Nhập mật khẩu"            
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 rounded-xl my-3 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
              value={password}
              onChange={(e) => setPassword(e.target.value)}                  
            />
            <img 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-md text-black"
              src={showPassword ? Eye : EyeOff}
              onClick={() => setShowPassword(!showPassword)}
            />                
          </div>
          <label htmlFor="email" className="block text-base mb-1">
            Nhập lại mật khẩu <span className="text-red-600">*</span>
          </label>   
          <div className="relative mb-8">
              <Input            
                placeholder="Xác nhận lại mật khẩu"
                type= {showConfirmPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-xl my-3 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#0656d2] "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-md text-black"
                src={showConfirmPassword ? Eye : EyeOff}
                onClick={()=> setShowConfirmPassword(!showConfirmPassword)} 
              />                
          </div>            
          <Button className="w-full bg-[#0656d2] text-white font-semibold my-3 rounded-xlxl hover:bg-[#054bb8] transition-colors" onClick={handleSignup}>Đăng ký</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup