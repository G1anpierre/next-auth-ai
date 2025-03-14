"use client";

import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useState } from "react";
import { formatDate } from "@/utils/format-date";
import { useGetSubscription } from "@/hooks/useGetSubscription";
import { Pricing } from "@/components/price/pricing";
import { Session } from "next-auth";

export function SubscriptionSettings({ session }: { session: Session | null }) {

  const [actionLoading, setActionLoading] = useState(false);
  const { subscription, fetchSubscription, loading } = useGetSubscription();
 

  const handleManageSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch('/api/stripe/subscription', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error managing subscription:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubscription = async (action: string) => {
    try {
      setActionLoading(true);
      await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: action }),
      });
      await fetchSubscription();
    } catch (error) {
      console.error(`Error ${action} subscription:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Subscription</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Subscription</h2>
        </CardHeader>
        <CardBody>
          <Pricing session={session} />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Subscription</h2>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-default-500">Plan</span>
            <span className="font-semibold">{subscription.productName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-500">Status</span>
            <Chip
              color={subscription.status === 'active' ? 'success' : 'warning'}
              variant="flat"
            >
              {subscription.status}
            </Chip>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-500">Billing Period</span>
            <span>
              {subscription.intervalCount} {subscription.interval}
              {subscription.intervalCount > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-500">Current Period End</span>
            <span>{formatDate(new Date(subscription.currentPeriodEnd * 1000))}</span>
          </div>
          {subscription.cancelAtPeriodEnd && (
            <div className="mt-2 p-3 bg-danger-50 dark:bg-danger-500/20 rounded-lg">
              <p className="text-danger text-sm">
                Your subscription will be canceled at the end of the current billing period.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          {subscription.cancelAtPeriodEnd ? (
            <Button
              color="primary"
              variant="flat"
              isLoading={actionLoading}
              onPress={() => handleSubscription('resume')}
            >
              Resume Subscription
            </Button>
          ) : (
            <Button
              color="danger"
              variant="flat"
              isLoading={actionLoading}
              onPress={() => handleSubscription('cancel')}
            >
              Cancel Subscription
            </Button>
          )}
          <Button
            color="primary"
            isLoading={actionLoading}
            onPress={handleManageSubscription}
          >
            Manage Subscription
          </Button>
        </div>
      </CardBody>
    </Card>
  );
} 