import { assessStyleAndSuggestFurnitureFlow } from '@/ai/flows/assess-style-and-suggest-furniture';
import { appRoute } from '@genkit-ai/next';

export const POST = appRoute(assessStyleAndSuggestFurnitureFlow);