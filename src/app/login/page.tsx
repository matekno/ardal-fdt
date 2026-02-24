import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/LoginCard";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  const params = await searchParams;
  const isUnauthorized = params.error === "unauthorized";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-6">
      <LoginCard isUnauthorized={isUnauthorized} />
    </div>
  );
}
