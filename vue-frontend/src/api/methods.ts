// axiosのインスタンスをインポートし、設定を定義
import axios, { type InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

// 環境変数からAPIのベースURLを取得してaxiosインスタンスを作成
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// トークンをリクエストヘッダーに追加し、レスポンスのエラーを処理するインターセプター
instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const idToken =
    ((await fetchAuthSession()).tokens?.idToken as unknown as string) ?? "";
  if (!idToken) {
    throw new Error("idToken is empty");
  }
  config.headers.Authorization = `${idToken}`;
  return config;
});

/**
 * GETリクエストを送る関数
 * @param path - APIのエンドポイント
 * @param options - Axiosリクエストの設定オプション
 * @returns - レスポンスデータまたはエラー情報
 */
export const get = async (path: string) => {
  try {
    const response = await instance.get(path);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // エラーをスローしてTanStack Queryに処理させる
  }
};

/**
 * POSTリクエストを送る関数
 * @param path - APIのエンドポイント
 * @param data - Axiosリクエストのデータ
 * @returns - レスポンスデータまたはエラー情報
 */
export const post = async (path: string, data: unknown) => {
  try {
    const response = await instance.post(path, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // エラーをスローしてTanStack Queryに処理させる
  }
};

/**
 * PUTリクエストを送る関数
 * @param path - APIのエンドポイント
 * @param data - Axiosリクエストのdata
 * @returns - レスポンスデータまたはエラー情報
 */
export const put = async (path: string, data: unknown) => {
  try {
    const response = await instance.put(path, data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // エラーをスローしてTanStack Queryに処理させる
  }
};

/**
 * DELETEリクエストを送る関数
 * @param path - APIのエンドポイント
 * @param options - Axiosリクエストの設定オプション
 * @returns - レスポンスデータまたはエラー情報
 */
export const deleteRequest = async (path: string) => {
  try {
    const response = await instance.delete(path);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // エラーをスローしてTanStack Queryに処理させる
  }
};
