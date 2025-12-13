import { z } from "zod";

const envSchema = z.object({
  PROD: z.boolean(),
});

type Env = z.infer<typeof envSchema>;

const parseEnv = (): Env => {
  try {
    const envData = {
      PROD: import.meta.env.PROD,
    };
    return envSchema.parse(envData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:");
    } else console.error("❌ Unknown error:", error);
    throw new Error("Invalid environment configuration");
  }
};

let envInstance: Env | null = null;

export const getEnv = (): Env => {
  if (!envInstance) {
    envInstance = parseEnv();
  }
  return envInstance;
};

export const env = getEnv();
export type { Env };
