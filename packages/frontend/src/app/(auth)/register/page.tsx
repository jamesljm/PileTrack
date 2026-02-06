import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Register for a PileTrack account</p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
