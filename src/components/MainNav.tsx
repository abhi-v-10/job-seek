
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Search, MessageSquare, Briefcase, Plus } from "lucide-react";

export function MainNav() {
  const location = useLocation();
  
  const navItems = [
    {
      title: "Jobs",
      href: "/",
      icon: Briefcase
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare
    },
    {
      title: "Post Job",
      href: "/post-job",
      icon: Plus
    }
  ];

  return (
    <nav className="bg-[#18181B] text-white px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold">
            JobSeek
          </Link>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm transition-colors hover:text-white/80",
                  location.pathname === item.href
                    ? "text-white"
                    : "text-white/60"
                )}
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Search size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
