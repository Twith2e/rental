"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/app/main-nav";
import { UserAvatar } from "@/components/app/user-avatar";
import { Button } from "@/components/ui/button";
import { Sofa } from "lucide-react";

/**
 * Client-side sidebar wrapper component that handles navigation state
 * This component isolates client-side navigation logic from the server layout
 */
/**
 * SidebarWrapper
 * Enhances visuals with a floating variant, gradient brand header, and subtle separators
 * while preserving the existing layout and behavior.
 */
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Use floating variant to get soft rounded/shadowed container without layout changes */}
      <Sidebar variant="floating" collapsible="offcanvas">
        <SidebarHeader>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start px-2 text-lg font-headline font-semibold tracking-tight
              bg-gradient-to-r from-indigo-50 via-fuchsia-50 to-amber-50
              hover:from-indigo-100 hover:via-fuchsia-100 hover:to-amber-100
              border border-sidebar-border/60 shadow-sm"
          >
            <Sofa className="mr-2 shrink-0 text-indigo-600" />
            <span
              className="group-data-[collapsible=icon]:hidden
                bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-amber-500
                bg-clip-text text-transparent"
            >
              Rental Furnish
            </span>
          </Button>

          {/* Subtle divider under brand for visual rhythm */}
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Light gradient under avatar for a soft, modern feel */}
          <div className="rounded-md p-2 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-sidebar-border/50">
            <UserAvatar />
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}