import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, auth } from "@/lib/auth";

async function loginAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=CredentialsSignin");
    }

    throw error;
  }
}

export default async function LoginPage() {
  const session = await auth();

  if (session?.user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="container flex min-h-screen items-center justify-center">
      <form action={loginAction} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access the protected dashboard.</p>
        </div>
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </main>
  );
}
