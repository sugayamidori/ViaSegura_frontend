export interface LoginAuthReponse {
  access_token: string;
  usuario: string;
}

export interface SetCookiesLoginProps {
  response: Response;
}
