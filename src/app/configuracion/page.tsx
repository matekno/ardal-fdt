import { getAppSettings } from "@/lib/settings";
import { ConfiguracionView } from "./components/ConfiguracionView";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const settings = await getAppSettings();
  return <ConfiguracionView settings={settings} />;
}
