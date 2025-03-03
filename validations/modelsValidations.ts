import { z } from "zod";

export const modelsSchema = z.object({
  modelName: z
    .string({ required_error: "Model Name is required" })
    .trim()
    .min(3, { message: "Model Name should be at least 3 characters" })
    .transform((value) =>
      value
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    ),
  company: z
    .number({
      required_error: "Company is required",
      invalid_type_error: "Company must be a number",
    })
    .int(),
});

export type ModelType = z.infer<typeof modelsSchema>;
