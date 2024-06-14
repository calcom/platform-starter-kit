import SettingsContent from "../_components/settings-content";
import { auth } from "@/auth";

export default async function DashboardSettingsAvailability() {
  const sesh = await auth();
  const calAccessToken = sesh.user.calAccessToken;
  return <SettingsContent calAccessToken={calAccessToken} />;
}
