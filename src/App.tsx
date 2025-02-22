
import { useRoutes } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Messages = lazy(() => import("./pages/Messages"));
const PostJob = lazy(() => import("./pages/PostJob"));
const ProfileSettings = lazy(() => import("./pages/ProfileSettings"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const { user } = useAuth();

  const routes = useRoutes([
    {
      path: "/",
      element: <Index />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/messages",
      element: user ? <Messages /> : <Auth />,
    },
    {
      path: "/post-job",
      element: user ? <PostJob /> : <Auth />,
    },
    {
      path: "/profile/settings",
      element: user ? <ProfileSettings /> : <Auth />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return routes;
}

