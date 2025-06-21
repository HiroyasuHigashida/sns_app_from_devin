import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { HomePage } from "./pages/HomePage";
import "@aws-amplify/ui-react/styles.css";

function App() {
  const { route } = useAuthenticator((context) => [context.user]);

  return route === "authenticated" || route === "setup" ? (
    <HomePage />
  ) : (
    <Authenticator />
  );
}

export default App;
