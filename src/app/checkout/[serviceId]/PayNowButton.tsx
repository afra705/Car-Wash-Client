"use client";

import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PayNowButtonProps = {
  serviceId: string;
  amount: string;
  disabled?: boolean;
  className?: string;
};

export default function PayNowButton({
  serviceId,
  amount,
  disabled = false,
  className,
}: PayNowButtonProps) {
  const handlePayNow = () => {
    // TODO: connect the real checkout flow once a payment provider
    // (Stripe, SSLCommerz, etc.) and the bookings API are available.
    toast.info("Online payment is coming soon", {
      description: `Please call +880170678-5160 to complete your ${amount} booking for this service.`,
    });
  };

  return (
    <Button
      type="button"
      onClick={handlePayNow}
      disabled={disabled}
      data-service-id={serviceId}
      className={cn(
        "h-12 w-full gap-2 bg-[#FACC15] text-base font-semibold text-[#122048] hover:bg-[#eab308]",
        className
      )}
    >
      <CreditCard className="size-4" />
      Pay Now · {amount}
      <Lock className="ml-auto size-3.5 opacity-60" />
    </Button>
  );
}
