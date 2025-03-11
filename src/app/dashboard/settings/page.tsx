import { SubscriptionSettings } from "./components/subscription-settings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <SubscriptionSettings />
        {/* Add other settings sections here */}
      </div>
    </div>
  );
} 