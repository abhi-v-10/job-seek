
import { MainNav } from "@/components/MainNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Welcome to JobSeek</h1>
            <p className="text-muted-foreground mt-2">
              Your job search companion
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Index;

