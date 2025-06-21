import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "@mui/material";
import { globalStyles } from "./styles/global";
import App from "./App.tsx";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_jDy6IO2m7", // CDK実行結果のBaseInfraStack.cognitoUserPoolId
      userPoolClientId: "3lns0hu13e34n00pdj2jotml9n", // CDK実行結果のBaseInfraStack.cognitoUserPoolClientId
      identityPoolId: "ap-northeast-1:cbf6a159-d75e-4011-b3de-6de690266a53", // CDK実行結果のBaseInfraStack.cognitoIdentityPoolId
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Authenticator.Provider>
    <QueryClientProvider client={queryClient}>
      <GlobalStyles styles={globalStyles} />
      <StrictMode>
        <App />
      </StrictMode>
    </QueryClientProvider>
  </Authenticator.Provider>,
);
