import { z } from "zod";

import { loginSchema } from "./schemas";

const typesLogin = loginSchema();
export type loginFormInputsProps = z.infer<typeof typesLogin>;
