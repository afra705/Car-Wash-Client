"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type BookingBtnProps = {
  serviceId: string;
};

export default function BookingBtn({
  serviceId,
}: BookingBtnProps) {
  return (
    <Link
      href={`/checkout/${serviceId}`}
      className={cn(
        buttonVariants({ size: "lg" }),
        "h-11 flex-1 gap-2 bg-[#FACC15] text-[#122048] hover:bg-[#eab308]"
      )}
    >
      Book This Service
    </Link>
  );
}