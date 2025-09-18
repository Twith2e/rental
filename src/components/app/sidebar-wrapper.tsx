"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MainNav } from "@/components/app/main-nav";
import { UserAvatar } from "@/components/app/user-avatar";
import { Button } from "@/components/ui/button";
import { Sofa } from "lucide-react";

/**
 * Client-side sidebar wrapper component that handles navigation state
 * This component isolates client-side navigation logic from the server layout
 */
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start px-2 text-lg font-headline font-semibold tracking-tight"
          >
            <Sofa className="mr-2 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">
              Rental Furnish
            </span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserAvatar />
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