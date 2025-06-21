import { test, expect } from "@playwright/test";

/**
 * 指定された長さのランダム文字列を生成する
 */
function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

test("ユーザーが新しい投稿を作成できる", async ({ page }) => {
  // ホームページに移動
  await page.goto("/");

  // ログイン
  const eMailInput = page.locator("input[type='email']");
  await expect(eMailInput).toBeVisible();
  const testEmail = "higashida@kdl.co.jp";
  await eMailInput.fill(testEmail);

  const passwordInput = page.locator("input[type='password']");
  await expect(passwordInput).toBeVisible();
  const testPassword = "Higashida_0513";
  await passwordInput.fill(testPassword);

  const loginButton = page.getByRole("button", { name: "Sign in" });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  // 投稿フォームが表示されることを確認
  const postForm = page.locator("form");
  await expect(postForm).toBeVisible();

  // 投稿内容を入力
  const postInput = page.locator('textarea[placeholder="今どうしてる？"]');
  await expect(postInput).toBeVisible();
  const testPostContent = "これはテスト投稿です！" + Date.now();
  await postInput.fill(testPostContent);

  // 投稿ボタンが有効になることを確認
  const postButton = page.getByRole("button", { name: "ポスト" });
  await expect(postButton).toBeEnabled();

  // 文字数カウンターが表示されることを確認
  const charCounter = postForm.locator("div").filter({ hasText: /^\d+$/ });
  await expect(charCounter).toBeVisible();

  // 投稿を送信
  await postButton.click();

  // 投稿フォームがクリアされることを確認
  await expect(postInput).toHaveValue("");

  // 投稿が表示されることを確認
  const postContent = page.getByText(testPostContent);
  await expect(postContent).toBeVisible({ timeout: 5000 });
});

test("異常系: 文字数0と141文字", async ({ page }) => {
  // ホームページに移動
  await page.goto("/");

  // ログイン
  const eMailInput = page.locator("input[type='email']");
  await expect(eMailInput).toBeVisible();
  const testEmail = "higashida@kdl.co.jp";
  await eMailInput.fill(testEmail);

  const passwordInput = page.locator("input[type='password']");
  await expect(passwordInput).toBeVisible();
  const testPassword = "Higashida_0513";
  await passwordInput.fill(testPassword);

  const loginButton = page.getByRole("button", { name: "Sign in" });
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  // 投稿フォームが表示されることを確認
  const postForm = page.locator("form");
  await expect(postForm).toBeVisible();

  // 投稿内容を入力
  const postInput = page.locator('textarea[placeholder="今どうしてる？"]');
  await expect(postInput).toBeVisible();

  // 文字数0のケース
  const randomString0 = generateRandomString(0);
  await postInput.fill(randomString0);

  // 投稿ボタンが無効になることを確認
  const postButton = page.getByRole("button", { name: "ポスト" });
  await expect(postButton).toBeDisabled();

  // 文字数141のケース（制限超過）
  const randomString141 = generateRandomString(141);
  await postInput.fill(randomString141);

  // 投稿ボタンが無効になることを確認
  await expect(postButton).toBeDisabled();
});
