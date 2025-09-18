"use server";
/**
 * @fileOverview An AI agent that assesses a user's style based on uploaded photos
 *  and suggests furniture recommendations that match the existing decor.
 *
 * - assessStyleAndSuggestFurniture - A function that handles the style assessment and furniture recommendation process.
 * - AssessStyleAndSuggestFurnitureInput - The input type for the assessStyleAndSuggestFurniture function.
 * - AssessStyleAndSuggestFurnitureOutput - The return type for the assessStyleAndSuggestFurniture function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const AssessStyleAndSuggestFurnitureInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's space, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AssessStyleAndSuggestFurnitureInput = z.infer<
  typeof AssessStyleAndSuggestFurnitureInputSchema
>;

const AssessStyleAndSuggestFurnitureOutputSchema = z.object({
  styleAssessment: z
    .string()
    .describe("The assessment of the user space style."),
  furnitureRecommendations: z
    .string()
    .describe("Furniture recommendations that match the assessed style."),
});
export type AssessStyleAndSuggestFurnitureOutput = z.infer<
  typeof AssessStyleAndSuggestFurnitureOutputSchema
>;

const prompt = ai.definePrompt({
  name: "assessStyleAndSuggestFurniturePrompt",
  input: { schema: AssessStyleAndSuggestFurnitureInputSchema },
  output: { schema: AssessStyleAndSuggestFurnitureOutputSchema },
  prompt: `You are an interior design assistant. A user will upload a photo of their space. You will assess their style based on the photo, and then provide furniture recommendations that match the assessed style.

Photo: {{media url=photoDataUri}}

Style Assessment: Based on the photo, describe the user's style. Consider elements like color palettes, furniture types, and overall aesthetic.

Furniture Recommendations: Based on the style assessment, recommend specific types of furniture (e.g., sofas, chairs, tables) that would complement the space.  Explain why you are recommending the given furniture.
`,
});

// Export the actual Genkit flow instead of keeping it internal
export const assessStyleAndSuggestFurnitureFlow = ai.defineFlow(
  {
    name: "assessStyleAndSuggestFurnitureFlow",
    inputSchema: AssessStyleAndSuggestFurnitureInputSchema,
    outputSchema: AssessStyleAndSuggestFurnitureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

// Keep the wrapper function for backward compatibility if needed
export async function assessStyleAndSuggestFurniture(
  input: AssessStyleAndSuggestFurnitureInput
): Promise<AssessStyleAndSuggestFurnitureOutput> {
  return assessStyleAndSuggestFurnitureFlow(input);
}
