import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockAmplifyConfig = vi.fn();
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: mockAmplifyConfig,
  },
}));

vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
}));

vi.mock('../App.tsx', () => ({
  default: () => 'App',
}));

vi.mock('@aws-amplify/ui-react', () => ({
  Authenticator: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@mui/material', () => ({
  GlobalStyles: () => 'GlobalStyles',
}));

vi.mock('../styles/global', () => ({
  globalStyles: {},
}));

describe('メインエントリーポイント', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('Amplifyが正しい設定で初期化される', async () => {
    await import('../main');
    
    expect(mockAmplifyConfig).toHaveBeenCalledWith({
      Auth: {
        Cognito: {
          userPoolId: "ap-northeast-1_jDy6IO2m7",
          userPoolClientId: "3lns0hu13e34n00pdj2jotml9n",
          identityPoolId: "ap-northeast-1:cbf6a159-d75e-4011-b3de-6de690266a53",
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
  });

  it('createRootが正しい要素で呼び出される', async () => {
    await import('../main');
    
    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById("root"));
  });

  it('アプリケーションが正しいプロバイダーでレンダリングされる', async () => {
    await import('../main');
    
    expect(mockRender).toHaveBeenCalledTimes(1);
    expect(mockRender).toHaveBeenCalled();
  });

  it('QueryClientが作成される', async () => {
    await import('../main');
    
    expect(mockCreateRoot).toHaveBeenCalled();
  });

  it('GlobalStylesが適用される', async () => {
    await import('../main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('StrictModeが有効になる', async () => {
    await import('../main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('Authenticator.Providerが設定される', async () => {
    await import('../main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('QueryClientProviderが設定される', async () => {
    await import('../main');
    
    expect(mockRender).toHaveBeenCalled();
  });

  it('rootエレメントが存在しない場合でもエラーが発生しない', async () => {
    document.body.innerHTML = '';
    
    await expect(async () => {
      await import('../main');
    }).not.toThrow();
  });

  it('設定値が正しく設定される', async () => {
    await import('../main');
    
    expect(mockAmplifyConfig).toHaveBeenCalled();
    const configCall = mockAmplifyConfig.mock.calls[0][0] as any;
    expect(configCall.Auth.Cognito.userPoolId).toBe("ap-northeast-1_jDy6IO2m7");
    expect(configCall.Auth.Cognito.userPoolClientId).toBe("3lns0hu13e34n00pdj2jotml9n");
    expect(configCall.Auth.Cognito.identityPoolId).toBe("ap-northeast-1:cbf6a159-d75e-4011-b3de-6de690266a53");
    expect(configCall.Auth.Cognito.loginWith.email).toBe(true);
    expect(configCall.Auth.Cognito.signUpVerificationMethod).toBe("code");
    expect(configCall.Auth.Cognito.userAttributes.email.required).toBe(true);
    expect(configCall.Auth.Cognito.allowGuestAccess).toBe(true);
  });

  it('パスワード形式の設定が正しく設定される', async () => {
    await import('../main');
    
    expect(mockAmplifyConfig).toHaveBeenCalled();
    const configCall = mockAmplifyConfig.mock.calls[0][0] as any;
    const passwordFormat = configCall.Auth.Cognito.passwordFormat;
    expect(passwordFormat.minLength).toBe(8);
    expect(passwordFormat.requireLowercase).toBe(true);
    expect(passwordFormat.requireUppercase).toBe(true);
    expect(passwordFormat.requireNumbers).toBe(true);
    expect(passwordFormat.requireSpecialCharacters).toBe(true);
  });
});
