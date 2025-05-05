import ExamsContainer from "./components/exams-container";
import HeadbarContainer from "./components/headbar-container";
import SidebarContainer from "./components/sidebar-container";
import ProfileContainer from "./components/profile-container";
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <div className = "fixed top-0 h-[100vh] w-[100vw] bg-[#b8cae8] flex">
      <SidebarContainer />
      <div className = "flex flex-col h-[100vh] w-full">
        <HeadbarContainer />
        {
          pathname === "/exams" ? <ExamsContainer /> : <ProfileContainer />
        }
      </div>
    </div>
  )
}

export default Home;