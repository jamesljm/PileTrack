"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@piletrack/shared";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api-client";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      await api.post("/auth/forgot-password", data);
      setSent(true);
    } catch (err: any) {
      setError(err?.data?.error?.message ?? "Failed to send reset email.");
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-sm text-muted-foreground">If an account with that email exists, we have sent password reset instructions.</p>
        <Button asChild variant="outline"><Link href="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to Sign In</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a password reset link</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm"><Link href="/login" className="text-primary hover:underline"><ArrowLeft className="inline mr-1 h-3 w-3" />Back to Sign In</Link></p>
    </div>
  );
}
