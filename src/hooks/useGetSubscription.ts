import { useState, useEffect } from "react";

type Subscription = {
  id: string;
  status: string;
  interval: string;
  intervalCount: number;
  productName: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
};

export const useGetSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
        try {

            const subscription = await fetch("/api/stripe/subscription");
            const data = await subscription.json();
            setSubscription(data.subscription);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching subscription:", error);
            setLoading(false);
        }
    };

    fetchSubscription();
  }, []);

  return { subscription, loading };
};