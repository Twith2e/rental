import { RecommendationsForm } from "./recommendations-form";

export default function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Furniture Recommendation
        </h1>
        <p className="text-muted-foreground">
          Get AI-powered furniture suggestions based on your needs.
        </p>
      </div>
      <RecommendationsForm />
    </div>
  );
}
