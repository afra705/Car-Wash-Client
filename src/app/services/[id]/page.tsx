import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Droplets,
  MapPin,
  Tag,
} from "lucide-react";

import { getServiceById } from "@/app/all-api/services";
import type { TService } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ServiceDetailsProps = {
  params: Promise<{ id: string }>;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-600",
};

const formatPrice = (price: number) => {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "—";
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value?: string) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export async function generateMetadata({
  params,
}: ServiceDetailsProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const service = await getServiceById(id);

    if (!service) {
      return { title: "Service Not Found | Car Washing System" };
    }

    return {
      title: `${service.serviceName} | Car Washing System`,
      description:
        service.description ||
        `Book ${service.serviceName} at our ${service.branch} branch.`,
    };
  } catch {
    return { title: "Service Details | Car Washing System" };
  }
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsProps) {
  const { id } = await params;

  let service: TService | null = null;
  let hasError = false;

  try {
    service = await getServiceById(id);
  } catch {
    hasError = true;
  }

  if (!service && !hasError) {
    notFound();
  }

  if (hasError) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="size-6 text-red-500" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#122048]">
            Could not load this service
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Make sure the API server is running and try again.
          </p>
        </div>

        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "gap-2"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to services
        </Link>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const status = String(service.status ?? "pending");
  const statusClass =
    STATUS_STYLES[status.toLowerCase()] ?? "bg-blue-100 text-blue-700";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-12 md:py-12">
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#122048]"
      >
        <ArrowLeft className="size-4" />
        Back to all services
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {service.image ? (
            <img
              src={service.image}
              alt={service.serviceName || "Car wash service"}
              className="h-72 w-full object-cover sm:h-96 lg:h-full lg:min-h-[420px]"
            />
          ) : (
            <div className="flex h-72 w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#122048] to-[#1b2e63] text-white/80 sm:h-96 lg:h-full lg:min-h-[420px]">
              <Droplets className="size-14" />
              <span className="text-sm font-medium uppercase tracking-widest">
                Cleanify
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#FACC15] text-[#122048] hover:bg-[#FACC15]">
              <Tag className="size-3" />
              {service.category || "Car Wash"}
            </Badge>

            <Badge
              className={`${statusClass} border-transparent capitalize`}
            >
              <CheckCircle2 className="size-3" />
              {status}
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight text-[#122048] sm:text-4xl">
            {service.serviceName || "Untitled service"}
          </h1>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold text-[#122048]">
              {formatPrice(service.price)}
            </span>
            <span className="pb-1 text-sm text-gray-500">/ service</span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
            {service.description ||
              "This professional car wash service is handled by our trained team. Contact us for more details or to schedule a booking."}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#122048]/5">
                <Building2 className="size-4 text-[#122048]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Branch
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-700">
                  {service.branch || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#122048]/5">
                <MapPin className="size-4 text-[#122048]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Location
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-700">
                  {service.location || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#122048]/5">
                <CalendarDays className="size-4 text-[#122048]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Added on
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-700">
                  {formatDate(service.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signin"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 flex-1 gap-2 bg-[#FACC15] text-[#122048] hover:bg-[#eab308]"
              )}
            >
              Book This Service
            </Link>

            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 flex-1 gap-2"
              )}
            >
              Browse More Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
