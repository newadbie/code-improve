import { z } from "zod";

export const imageSchema = z.union([
  z.object({
    alt: z.string().nullish(),
    base64: z.string().nullish(),
    url: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  z.string(),
]);

export type ImageSchema = z.infer<typeof imageSchema>;
