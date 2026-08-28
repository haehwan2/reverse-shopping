import { cookies } from "next/headers";
import { createHmac } from "crypto";

import AdminLogin from "./login";
import AdminDashboard from "./dashboard";

export default async function AdminPage() {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>ADMIN_PASSWORD가 설정되지 않았습니다.</p >
      </main>
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  const correctSession = createHmac("sha256", adminPassword)
    .update("admin-session")
    .digest("hex");

  if (session !== correctSession) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}