import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { HomePage } from "./pages/HomePage";
import "@aws-amplify/ui-react/styles.css";

const queryClient = new QueryClient();

function App() {
  const { route } = useAuthenticator((context) => [context.user]);

  return route === "authenticated" || route === "setup" ? (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <HomePage />
      </CurrentUserProvider>
    </QueryClientProvider>
  ) : (
    <Authenticator />
  );
}

export default App;
