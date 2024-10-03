import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    CMS_API_URL: z.string(),
    CMS_API_KEY: z.string(),
    CMS_ABORT_TIMEOUT: z.preprocess(
      (value) => (typeof value === "string" ? parseInt(value, 10) : undefined),
      z.number().int().positive(),
    ),
  },
  client: {},
  runtimeEnv: {
    CMS_ABORT_TIMEOUT: process.env.CMS_ABORT_TIMEOUT,
    CMS_API_URL: process.env.CMS_API_URL,
    CMS_API_KEY: process.env.CMS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
