import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your furniture preferences and personal information.
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
