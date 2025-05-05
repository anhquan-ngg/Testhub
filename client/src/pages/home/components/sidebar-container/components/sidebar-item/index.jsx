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

export default SidebarItem;

