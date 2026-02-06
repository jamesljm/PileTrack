import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your credentials to access PileTrack</p>
      </div>
      <LoginForm />
      <div className="text-center text-sm space-y-2">
        <p>
          <Link href="/forgot-password" className="text-primary hover:underline">Forgot your password?</Link>
        </p>
        <p className="text-muted-foreground">
          Do not have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
