// src/ai/flows/generate-furniture-recommendations.ts
"use server";

/**
 * @fileOverview Generates personalized furniture recommendations based on user preferences, budget, and apartment size.
 *
 * - generateFurnitureRecommendations - A function that takes user preferences and generates tailored furniture recommendations.
 * - GenerateFurnitureRecommendationsInput - The input type for the generateFurnitureRecommendations function.
 * - GenerateFurnitureRecommendationsOutput - The return type for the generateFurnitureRecommendations function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateFurnitureRecommendationsInputSchema = z.object({
  rentalPreferences: z
    .string()
    .describe(
      "The user\u0027s rental preferences (e.g., style, color, material)."
    ),
  budget: z.number().describe("The user\u0027s budget for furniture rentals."),
  apartmentSize: z
    .string()
    .describe(
      "The size of the user\u0027s apartment (e.g., small, medium, large)."
    ),
  photoDataUri: z
    .string()
    .describe(
      "A photo of the user's space, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
});

export type GenerateFurnitureRecommendationsInput = z.infer<
  typeof GenerateFurnitureRecommendationsInputSchema
>;

const GenerateFurnitureRecommendationsOutputSchema = z.object({
  furnitureRecommendations: z
    .string()
    .describe("A list of furniture recommendations tailored to the user."),
});

export type GenerateFurnitureRecommendationsOutput = z.infer<
  typeof GenerateFurnitureRecommendationsOutputSchema
>;

export async function generateFurnitureRecommendations(
  input: GenerateFurnitureRecommendationsInput
): Promise<GenerateFurnitureRecommendationsOutput> {
  return generateFurnitureRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: "generateFurnitureRecommendationsPrompt",
  input: { schema: GenerateFurnitureRecommendationsInputSchema },
  output: { schema: GenerateFurnitureRecommendationsOutputSchema },
  prompt: `You are an expert interior designer specializing in rental furniture.

You will generate personalized furniture recommendations based on the user\u0027s rental preferences, budget, and apartment size. Use the following information to generate the recommendations:

Rental Preferences: {{{rentalPreferences}}}
Budget: {{{budget}}}
Apartment Size: {{{apartmentSize}}}
{{#if photoDataUri}}
Space Photo: {{media url=photoDataUri}}
{{/if}}

Consider suggesting complete furniture sets (sofas, beds, tables, etc.) that are suitable for rentals.
`, // Added conditional to handle photoDataUri if available.
});

const generateFurnitureRecommendationsFlow = ai.defineFlow(
  {
    name: "generateFurnitureRecommendationsFlow",
    inputSchema: GenerateFurnitureRecommendationsInputSchema,
    outputSchema: GenerateFurnitureRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

// Export the flow for use in API routes
export { generateFurnitureRecommendationsFlow };
