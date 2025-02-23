
import { Link, useNavigate } from "react-router-dom";
import { Search, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { UserDropdown } from "./navigation/UserDropdown";

export function MainNav() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/40 text-foreground px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-serif text-gradient-warm hover:opacity-80 transition-opacity">
            JobSeek
          </Link>
          <NavigationLinks />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Search size={20} className="text-muted-foreground hover:text-foreground transition-colors" />
          </button>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="glass-morphism hover:bg-accent/20"
              onClick={() => navigate("/auth")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
