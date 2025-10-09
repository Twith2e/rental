"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname() || "";

  // Helper to determine active state for base routes and nested paths
  const isActiveHref = useMemo(
    () => (href: string) => pathname === href || pathname.startsWith(href + "/"),
    [pathname]
  );

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={isActiveHref(item.href)}
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
