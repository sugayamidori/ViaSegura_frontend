import { fetchAPI } from ".";
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";

import { setCookieLogin } from "@viasegura/utils/auth";
import { loginFormInputsProps } from "@viasegura/modules/auth/components/login-form/types";
import { registerFormInputsProps } from "@viasegura/modules/auth/components/register-form/types";

export const authRegister = async ({
  username,
  email,
  password,
}: registerFormInputsProps) => {
  const registerRequest = {
    nome: username,
    email,
    senha: password,
  };

  const response = await fetchAPI({
    url: "usuarios",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    },
  });

  return response.status === 201;
};
