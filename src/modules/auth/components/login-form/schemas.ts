import { z } from "zod";

export const loginSchema = () => {
  const schema = z.object({
    username: z
      .string()
      .trim()
      .min(1, {
        message: "Mínimo de 1 caracteres",
      })
      .email("E-mail inválido")
      .max(128, {
        message: "Máximo de 128 caracteres",
      }),

    password: z
      .string()
      .trim()
      .min(6, {
        message: "Mínimo de 6 caracteres",
      })
      .max(12, {
        message: "Máximo de 12 caracteres",
      }),
  });
  return schema;
};
