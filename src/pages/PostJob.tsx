
import { MainNav } from "@/components/MainNav";

const PostJob = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">Post a Job</h1>
        <p className="text-muted-foreground mt-2">
          Connect to Supabase to enable job posting
        </p>
      </main>
    </div>
  );
}

export default PostJob;
