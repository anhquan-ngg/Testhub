import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Button } from '../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../components/ui/sheet';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  LogOut,
  Menu,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { apiClient } from '@/lib/api-client';
import { LOGOUT_ROUTE } from '@/utils/constants';

const AdminLayout = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_ROUTE,
        {},
        {withCredentials: true}
      );
      if (res.status == 200){
        setUserInfo(undefined);
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Quản lý người dùng',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Quản lý bài thi',
      href: '/admin/exams',
      icon: GraduationCap,
    },
  ];

  const NavItem = ({ item, className }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100',
          isActive ? 'bg-gray-300' : 'bg-white',
          className
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Sidebar cho desktop */}
      <aside className="hidden border-r bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <User className="h-6 w-6" />
            <span className="text-lg font-semibold">Testhub Admin</span>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          <Button
            variant="outline"
            className="justify-start bg-black text-white gap-2 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Header và content cho mobile */}
      <div className="flex flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6 bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b pb-4">
                  <User className="h-6 w-6" />
                  <span className="text-lg font-semibold">Testhub Admin</span>
                </div>

                <nav className="flex flex-1 flex-col gap-1">
                  {navigation.map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      className="w-full"
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </nav>

                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <span className="text-lg font-semibold">Testhub Admin</span>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;