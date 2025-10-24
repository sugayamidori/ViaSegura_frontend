import { deleteCookie, setCookie } from "cookies-next";
import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";
import { SetCookiesLoginProps } from "@viasegura/types/auth";

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
}

export const setCookieLogin = async ({ response }: SetCookiesLoginProps) => {
  const apiData: LoginApiResponse = await response.json();

  const { accessToken, refreshToken, username } = apiData;

  setCookie(COOKIE_TOKEN, accessToken, {
    path: "/",
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  setCookie(COOKIE_REFRESH_TOKEN, refreshToken, {
    path: "/",
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  setCookie(COOKIE_LOGIN, username, {
    path: "/",
    maxAge: 60 * 60,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const clearToken = () => {
  deleteCookie(COOKIE_TOKEN, { path: "/" });
  deleteCookie(COOKIE_REFRESH_TOKEN, { path: "/" });
  deleteCookie(COOKIE_LOGIN, { path: "/" });
};
