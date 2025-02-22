
import { Link, useLocation } from "react-router-dom";
import { Briefcase, MessageSquare, Plus, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function NavigationLinks() {
  const location = useLocation();

  const navItems: NavItem[] = [
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
      title: "SeekBot",
      href: "/seekbot",
      icon: Bot
    },
    {
      title: "Post Job",
      href: "/post-job",
      icon: Plus
    }
  ];

  return (
    <div className="hidden md:flex space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center space-x-2 text-sm transition-all hover:text-gradient-warm",
            location.pathname === item.href
              ? "text-gradient-warm"
              : "text-muted-foreground"
          )}
        >
          <item.icon size={18} />
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  );
}
