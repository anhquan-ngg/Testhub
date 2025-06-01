import SidebarContainer from "@/components/sidebar-container";
import HeadbarContainer from "@/components/headbar-container";
import { useLocation, Outlet } from 'react-router-dom';

const StudentLayout = () => {
  const location = useLocation();
  // const pathname = location.pathname;
  return (
    <div className = "fixed top-0 h-[100vh] w-[100vw] bg-[#b8cae8] flex">
      <SidebarContainer />
      <div className = "flex flex-col h-[100vh] w-full">
        <HeadbarContainer />
        <Outlet />
      </div>
    </div>
  )
}

export default StudentLayout;