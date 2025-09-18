import { generateFurnitureRecommendationsFlow } from '@/ai/flows/generate-furniture-recommendations';
import { appRoute } from '@genkit-ai/next';

// Export the POST handler for the generateFurnitureRecommendations flow
export const POST = appRoute(generateFurnitureRecommendationsFlow);