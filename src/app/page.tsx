import { getAppSettings } from "@/lib/settings";
import { HomeClient } from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getAppSettings();
  return <HomeClient supervisores={settings.supervisores} turnos={settings.turnos} />;
}
