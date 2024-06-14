import SettingsContent from "../_components/settings-content";
import { currentUser } from "@/auth";

export default async function DashboardSettingsAvailability() {
  const user = await currentUser();
  return <SettingsContent calAccessToken={user.calAccessToken} />;
}
