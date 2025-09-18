"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Sofa, User, ShoppingBag } from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/recommendations", label: "Recommendations", icon: Sofa },
  { href: "/profile", label: "My Profile", icon: User },
];

/**
 * Main navigation component that renders sidebar menu items
 * Uses a hybrid approach for pathname detection to avoid hydration issues
 */
export function MainNav() {
  const [currentPath, setCurrentPath] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag and initial pathname
    setIsClient(true);
    setCurrentPath(window.location.pathname);

    // Listen for route changes
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Fallback to server-side pathname if available
  let pathname = currentPath;
  try {
    if (isClient && typeof window !== "undefined") {
      pathname = window.location.pathname;
    }
  } catch (error) {
    // Fallback to empty string if pathname detection fails
    pathname = "";
  }

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} onClick={() => setCurrentPath(item.href)}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="w-full justify-start"
            >
              <item.icon className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
