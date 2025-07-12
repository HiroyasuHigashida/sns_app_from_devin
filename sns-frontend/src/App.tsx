import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { CurrentUserProvider } from "./contexts/CurrentUserContext";
import { router } from "./routes";
import "@aws-amplify/ui-react/styles.css";

const queryClient = new QueryClient();

function App() {
  const { route } = useAuthenticator((context) => [context.user]);

  return route === "authenticated" || route === "setup" ? (
    <QueryClientProvider client={queryClient}>
      <CurrentUserProvider>
        <RouterProvider router={router} />
      </CurrentUserProvider>
    </QueryClientProvider>
  ) : (
    <Authenticator />
  );
}

export default App;
