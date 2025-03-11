"use client";

import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/utils/format-date";
import { formatCurrency } from "@/utils/format-currency";

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

export function SubscriptionSettings() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/stripe/subscription');
      const data = await response.json();
      setSubscription(data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

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

  const handleCancelSubscription = async () => {
    try {
      setActionLoading(true);
      await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });
      await fetchSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResumeSubscription = async () => {
    try {
      setActionLoading(true);
      await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'resume' }),
      });
      await fetchSubscription();
    } catch (error) {
      console.error('Error resuming subscription:', error);
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
          <p className="text-default-500">You don't have an active subscription.</p>
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
            <span className="text-default-500">Price</span>
            <span className="font-semibold">
              {formatCurrency(subscription.amount / 100, subscription.currency)} / {subscription.interval}
            </span>
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
              onPress={handleResumeSubscription}
            >
              Resume Subscription
            </Button>
          ) : (
            <Button
              color="danger"
              variant="flat"
              isLoading={actionLoading}
              onPress={handleCancelSubscription}
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