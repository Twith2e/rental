import { Sofa } from "lucide-react";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <main className="flex flex-col items-center justify-center p-4 bg-background">
      <div className="flex flex-col items-center space-y-6 w-full max-w-md">
        <div className="flex items-center space-x-2">
          <Sofa />
          <h1 className="text-2xl font-bold">Rental Furnish</h1>
        </div>
        {children}
      </div>
    </main>
  );
}
