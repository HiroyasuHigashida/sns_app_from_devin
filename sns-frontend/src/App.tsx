import { useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { Layout } from "./components/Layout";
import { TimelinePage } from "./pages/TimelinePage";
import { ProfilePage } from "./pages/ProfilePage";
import "@aws-amplify/ui-react/styles.css";

const queryClient = new QueryClient();

function App() {
  const { route } = useAuthenticator((context) => [context.user]);
  const [activePage, setActivePage] = useState<"home" | "profile">("home");
  const [profileUsername, setProfileUsername] = useState<string | undefined>();

  const handleNavigate = (page: string, username?: string) => {
    if (page === "home") {
      setActivePage("home");
      setProfileUsername(undefined);
    } else if (page === "profile") {
      setActivePage("profile");
      setProfileUsername(username);
    }
  };

  return route === "authenticated" || route === "setup" ? (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <Layout activePage={activePage} onNavigate={handleNavigate}>
          {activePage === "profile" ? (
            <ProfilePage username={profileUsername} />
          ) : (
            <TimelinePage onAvatarClick={handleNavigate} />
          )}
        </Layout>
      </CurrentUserProvider>
    </QueryClientProvider>
  ) : (
    <Authenticator />
  );
}

export default App;
