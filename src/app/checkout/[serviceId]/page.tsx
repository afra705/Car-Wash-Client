import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  Lock,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Tag,
  User,
  type LucideIcon,
} from "lucide-react";

import { getServiceById } from "@/app/all-api/services";
import type { TService } from "@/app/types";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PayNowButton from "./PayNowButton";

type CheckoutPageProps = {
  params: Promise<{ serviceId: string }>;
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-600",
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  user: "Customer",
  branchManager: "Branch Manager",
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

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <Icon className="size-4 text-[#122048]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

function MessageCard({
  icon: Icon,
  iconClassName,
  title,
  message,
  action,
}: {
  icon: LucideIcon;
  iconClassName: string;
  title: string;
  message: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full",
          iconClassName
        )}
      >
        <Icon className="size-6" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-[#122048]">{title}</h1>
        <p className="mt-1 max-w-md text-sm text-gray-500">{message}</p>
      </div>

      {action}
    </div>
  );
}

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { serviceId } = await params;

  try {
    const service = await getServiceById(serviceId);

    if (!service) {
      return { title: "Checkout | Car Washing System" };
    }

    return {
      title: `Checkout · ${service.serviceName} | Car Washing System`,
      description: `Review your details and pay for ${service.serviceName} at our ${service.branch} branch.`,
    };
  } catch {
    return { title: "Checkout | Car Washing System" };
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { serviceId } = await params;

  let service: TService | null = null;
  let hasError = false;

  try {
    service = await getServiceById(serviceId);
  } catch {
    hasError = true;
  }

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  const user = session?.user ?? null;

  if (hasError) {
    return (
      <MessageCard
        icon={AlertCircle}
        iconClassName="bg-red-50 text-red-500"
        title="Could not load this service"
        message="Something went wrong while preparing your checkout. Make sure the API server is running and try again."
        action={
          <Link
            href={`/checkout/${serviceId}`}
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            <RefreshCw className="size-4" />
            Try again
          </Link>
        }
      />
    );
  }

  if (!service) {
    return (
      <MessageCard
        icon={Droplets}
        iconClassName="bg-[#122048]/5 text-[#122048]"
        title="Service not found"
        message="This service may have been removed or is no longer available. Please pick another service to continue."
        action={
          <Link
            href="/services"
            className={cn(buttonVariants(), "gap-2 bg-[#FACC15] text-[#122048] hover:bg-[#eab308]")}
          >
            <ArrowLeft className="size-4" />
            Browse services
          </Link>
        }
      />
    );
  }

  const status = String(service.status ?? "pending");
  const isInactive = status.toLowerCase() === "inactive";
  const statusClass =
    STATUS_STYLES[status.toLowerCase()] ?? "bg-blue-100 text-blue-700";
  const priceLabel = formatPrice(service.price);
  const isSignedIn = Boolean(user);
  const roleLabel = user?.role ? ROLE_LABELS[user.role] ?? user.role : null;
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";
  const place = service.location || service.branch || "our branch";

  const nextSteps = [
    {
      icon: CreditCard,
      title: "Complete your payment",
      description:
        "Confirm the amount below and pay securely to lock in this service.",
    },
    {
      icon: Mail,
      title: "Receive your confirmation",
      description: `A booking confirmation and receipt will be sent to ${
        user?.email ?? "your email address"
      }.`,
    },
    {
      icon: Clock,
      title: "Visit the branch",
      description: `Head to ${place} at your booking time and our team will handle the rest.`,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-12 md:py-12">
      <Link
        href={`/services/${serviceId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#122048]"
      >
        <ArrowLeft className="size-4" />
        Back to service details
      </Link>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#122048]/60">
            <ShieldCheck className="size-4" />
            Secure checkout
          </div>

          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#122048] sm:text-4xl">
            Review &amp; pay
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Please check your service and account details below, then confirm
            your booking with a payment.
          </p>
        </div>

        <ol className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <li className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-green-700">
            <CheckCircle2 className="size-3.5" />
            Review
          </li>
          <li className="flex items-center gap-1.5 rounded-full border border-[#122048]/15 bg-white px-3 py-1.5 text-[#122048]">
            <CreditCard className="size-3.5" />
            Payment
          </li>
          <li className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-400">
            <ShieldCheck className="size-3.5" />
            Confirmation
          </li>
        </ol>
      </div>

      {!isSignedIn && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              You&apos;re not signed in
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-amber-800">
              Sign in so we can attach this booking to your account and send
              your receipt. Your service details below will stay the same.
            </p>
          </div>
        </div>
      )}

      {isInactive && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-gray-400" />
          <div>
            <p className="text-sm font-semibold text-[#122048]">
              This service is not accepting bookings right now
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
              The branch has paused this service. You can still review the
              details or choose another service.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[#122048]">
                Service details
              </h2>

              <Badge
                className={cn(
                  statusClass,
                  "border-transparent capitalize"
                )}
              >
                <CheckCircle2 className="size-3" />
                {status}
              </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl border border-gray-100 sm:w-44">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.serviceName || "Car wash service"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#122048] to-[#1b2e63] text-white/80">
                    <Droplets className="size-8" />
                    <span className="text-[10px] font-medium uppercase tracking-widest">
                      Cleanify
                    </span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Badge className="bg-[#FACC15] text-[#122048] hover:bg-[#FACC15]">
                  <Tag className="size-3" />
                  {service.category || "Car Wash"}
                </Badge>

                <h3 className="mt-2 text-xl font-bold leading-snug text-[#122048]">
                  {service.serviceName || "Untitled service"}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {service.description ||
                    "This professional car wash service is handled by our trained team."}
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-2xl font-bold text-[#122048]">
                    {priceLabel}
                  </span>
                  <span className="pb-0.5 text-xs text-gray-500">
                    / service
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
              <InfoTile
                icon={Building2}
                label="Branch"
                value={service.branch || "—"}
              />
              <InfoTile
                icon={MapPin}
                label="Location"
                value={service.location || "—"}
              />
              <InfoTile
                icon={CalendarDays}
                label="Added on"
                value={formatDate(service.createdAt)}
              />
              <InfoTile icon={Tag} label="Category" value={service.category || "—"} />
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[#122048]">
              What happens next
            </h2>

            <ol className="mt-4 space-y-4">
              {nextSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={step.title} className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#122048]/5 text-sm font-semibold text-[#122048]">
                      <Icon className="size-4" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#122048]">
                        {index + 1}. {step.title}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[#122048]">
              Your details
            </h2>

            {user ? (
              <div className="mt-4 flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#122048] text-base font-semibold text-[#FACC15]">
                  {initial}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {user.name || "Customer"}
                  </p>

                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-gray-500">
                    <Mail className="size-3.5 shrink-0" />
                    {user.email}
                  </p>

                  {roleLabel && (
                    <Badge
                      variant="outline"
                      className="mt-2 border-[#122048]/15 text-[#122048]"
                    >
                      <User className="size-3" />
                      {roleLabel}
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <p className="text-sm leading-relaxed text-gray-500">
                  Sign in to attach this booking to your account and keep track
                  of it from your dashboard.
                </p>

                <Link
                  href="/signin"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "mt-4 h-10 w-full gap-2"
                  )}
                >
                  <User className="size-4" />
                  Sign in to continue
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-[#122048]">
              Order summary
            </h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Service</dt>
                <dd className="text-right font-medium text-gray-800">
                  {service.serviceName || "—"}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Branch</dt>
                <dd className="text-right font-medium text-gray-800">
                  {service.branch || "—"}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="text-gray-500">Price</dt>
                <dd className="text-right font-medium text-gray-800">
                  {priceLabel}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-dashed border-gray-200 pt-3">
                <dt className="font-semibold text-[#122048]">
                  Total due today
                </dt>
                <dd className="text-lg font-bold text-[#122048]">
                  {priceLabel}
                </dd>
              </div>
            </dl>

            {isInactive ? (
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-relaxed text-amber-800">
                This service is not accepting new bookings right now, so payment
                is disabled. Please choose another service.
              </div>
            ) : isSignedIn ? (
              <PayNowButton
                serviceId={String(service._id)}
                amount={priceLabel}
                className="mt-5"
              />
            ) : (
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-5 h-12 w-full gap-2 bg-[#FACC15] text-base font-semibold text-[#122048] hover:bg-[#eab308]"
                )}
              >
                <Lock className="size-4" />
                Sign in to pay {priceLabel}
              </Link>
            )}

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-gray-500">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#122048]" />
              Your booking is confirmed only after the payment succeeds. You
              will be able to review everything before you pay.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
