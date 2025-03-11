import { auth } from "@/auth";
import { SubscriptionSettings } from "./components/subscription-settings";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <SubscriptionSettings session={session} />
        {/* Add other settings sections here */}
      </div>
    </div>
  );
} 