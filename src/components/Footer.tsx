
import { Instagram, Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-background/95 backdrop-blur-sm border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://www.instagram.com/jobseek.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            >
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
            </a>
            <a
              href="mailto:jobseekplatform@gmail.com"
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            >
              <Mail className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/in/jobseek-seekbot/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
            </a>
          </div>

          {/* Developer Credits */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-accent">♥</span> by
            </p>
            <div className="flex flex-wrap justify-center gap-x-4 text-sm font-medium">
              <span className="text-foreground hover:text-accent transition-colors">Abhisyanth</span>
              <span className="text-foreground hover:text-accent transition-colors">Paardhiv Reddy</span>
              <span className="text-foreground hover:text-accent transition-colors">Jithendhra</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
