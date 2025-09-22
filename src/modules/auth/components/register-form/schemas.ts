import { z } from "zod";

export const registerSchema = () => {
  const schema = z.object({
    username: z
      .string()
      .min(1, {
        message: "Mínimo de 1 caracteres",
      })
      .max(128, {
        message: "Máximo de 128 caracteres",
      })
      .trim(),
    email: z
      .string()
      .email("E-mail inválido")
      .min(1, {
        message: "Mínimo de 1 caracteres",
      })
      .max(128, {
        message: "Máximo de 128 caracteres",
      })
      .trim(),
    password: z
      .string()
      .min(6, {
        message: "Mínimo de 6 caracteres",
      })
      .max(12, {
        message: "Máximo de 12 caracteres",
      })
      .trim(),
  });
  return schema;
};
