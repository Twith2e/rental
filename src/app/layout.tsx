import type { Metadata } from "next";
import "./globals.css"; // This should be early in the imports
import { Toaster } from "@/components/ui/toaster";
import { SidebarWrapper } from "@/components/app/sidebar-wrapper";
import { NavigationErrorBoundary } from "@/components/app/navigation-error-boundary";
import { cn } from "@/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/app/providers";

export const metadata: Metadata = {
  title: "Rental Furnish",
  description: "AI-powered furniture recommendations for rentals.",
};

/**
 * Root layout component that provides the basic HTML structure
 * Uses SidebarWrapper to handle client-side navigation components
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased", "bg-background")}>
        <Providers>
          <NextTopLoader color="#3b82f6" height={4} showSpinner={false} />
          <NavigationErrorBoundary>
            <SidebarWrapper>{children}</SidebarWrapper>
          </NavigationErrorBoundary>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
