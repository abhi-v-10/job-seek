
import { Link, useLocation } from "react-router-dom";
import { Briefcase, MessageSquare, Plus, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function NavigationLinks() {
  const location = useLocation();
  const { user } = useAuth();

  // Query for unread messages
  const { data: hasUnreadMessages = false } = useQuery({
    queryKey: ["unreadMessages"],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase
        .from("messages")
        .select("id")
        .eq("receiver_id", user.id)
        .eq("read", false)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

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
            "flex items-center space-x-2 text-sm transition-all hover:text-gradient-warm relative",
            location.pathname === item.href
              ? "text-gradient-warm"
              : "text-muted-foreground"
          )}
        >
          <item.icon size={18} />
          <span>{item.title}</span>
          {item.href === "/messages" && hasUnreadMessages && (
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Link>
      ))}
    </div>
  );
}

