import { z } from "zod";

import { registerSchema } from "./schemas";

const typesRegister = registerSchema();
export type registerFormInputsProps = z.infer<typeof typesRegister>;

export interface RegisterComponentProps {
  userType?: string;
}
