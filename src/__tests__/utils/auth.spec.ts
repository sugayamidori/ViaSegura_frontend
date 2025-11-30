import { setCookieLogin, clearToken } from "@viasegura/utils/auth";
import { setCookie, deleteCookie } from "cookies-next";
import {
  COOKIE_TOKEN,
  COOKIE_LOGIN,
  COOKIE_REFRESH_TOKEN,
} from "@viasegura/constants/cookies";

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));

describe("Auth Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setCookieLogin", () => {
    test("should set cookies correctly from response", async () => {
      const mockData = {
        accessToken: "access-123",
        refreshToken: "refresh-123",
        username: "user-123",
      };

      const mockResponse = {
        json: jest.fn().mockResolvedValue(mockData),
      } as unknown as Response;

      await setCookieLogin({ response: mockResponse });

      expect(setCookie).toHaveBeenCalledTimes(3);
      expect(setCookie).toHaveBeenCalledWith(
        COOKIE_TOKEN,
        mockData.accessToken,
        expect.any(Object)
      );
      expect(setCookie).toHaveBeenCalledWith(
        COOKIE_REFRESH_TOKEN,
        mockData.refreshToken,
        expect.any(Object)
      );
      expect(setCookie).toHaveBeenCalledWith(
        COOKIE_LOGIN,
        mockData.username,
        expect.any(Object)
      );
    });
  });

  describe("clearToken", () => {
    test("should delete all auth cookies", () => {
      clearToken();

      expect(deleteCookie).toHaveBeenCalledTimes(3);
      expect(deleteCookie).toHaveBeenCalledWith(COOKIE_TOKEN, { path: "/" });
      expect(deleteCookie).toHaveBeenCalledWith(COOKIE_REFRESH_TOKEN, {
        path: "/",
      });
      expect(deleteCookie).toHaveBeenCalledWith(COOKIE_LOGIN, { path: "/" });
    });
  });
});
