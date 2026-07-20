import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SchoolLogo from "../ui/SchoolLogo";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "📊", end: true },
  { to: "/admin/faculty", label: "Faculty", icon: "👨‍🏫" },
  { to: "/admin/events", label: "Events", icon: "📅" },
  { to: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "💬" },
  { to: "/admin/announcements", label: "Announcements", icon: "📢" },
  { to: "/admin/admissions", label: "Admission Enquiries", icon: "📝" },
  { to: "/admin/careers", label: "Teacher Applications", icon: "👩‍🏫" },
  { to: "/admin/test-attempts", label: "Online Test Results", icon: "📋" },
  { to: "/admin/messages", label: "Contact Messages", icon: "✉️" },
  { to: "/admin/subscribers", label: "Newsletter Subscribers", icon: "📧" },
  { to: "/admin/settings", label: "Site Settings", icon: "⚙️" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-primary text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <SchoolLogo className="w-10 h-10 rounded-lg" />
            <div>
              <p className="font-heading font-bold text-sm leading-tight">Admin Panel</p>
              <p className="text-white/50 text-xs">Rising Star Public School</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-white/10 text-accent border-r-2 border-accent" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/50 text-xs mb-2 px-2">Logged in as {admin?.name}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-sm text-white/80 hover:text-accent transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <p className="font-heading font-semibold text-primary">Management Dashboard</p>
          <button onClick={handleLogout} className="md:hidden text-sm text-primary font-medium">
            Logout
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
