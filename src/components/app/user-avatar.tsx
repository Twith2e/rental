import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/app/context/user-context";
import { LogOut, MoreHorizontal, User } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserAvatar() {
  const { user, loading } = useUser();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full px-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => router.push("/")}
        >
          <User className="mr-2 h-4 w-4" />
          Sign up / Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2 overflow-hidden">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-muted-foreground">{user.email}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
