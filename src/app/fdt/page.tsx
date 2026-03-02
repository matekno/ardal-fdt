import { getAppSettings } from "@/lib/settings";
import { FDTFormWrapper } from "@/components/fdt-form/FDTFormWrapper";

export const dynamic = "force-dynamic";

export default async function FDTPage() {
  const settings = await getAppSettings();
  return <FDTFormWrapper settings={settings} />;
}
