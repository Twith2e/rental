import { LoginForm } from "@/components/auth/login-form";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <LoginForm />
    </AuthPageLayout>
  );
}
