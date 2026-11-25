import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,

  Droplets,
  RefreshCw,

} from "lucide-react";
import { MapPin } from "lucide-react";
import { getPublicServices } from "@/app/all-api/services";
import type { TService } from "@/app/types";
import ServiceCard from "@/components/services/ServiceCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";


export const metadata: Metadata = {
  title: "Our Services | Car Washing System",
  description:
    "Browse professional car wash and detailing services offered by our branch managers.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let services: TService[] = [];
  let hasError = false;

try {
  const search = await searchParams;

  const urlSearch = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearch.set(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => urlSearch.append(key, item));
    }
  });

  console.log(urlSearch.toString());

  services = await getPublicServices();
} catch {
  hasError = true;
}



  return (
    <div>
      {/* Hero */}
   

      {/* Services */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-12 md:py-14">

{/* Branch Filter UI Only */}
<div className="mb-8 rounded-xl border border-gray-200 bg-white p-4">
  <div className="mb-3 flex items-center gap-2">
    <MapPin className="size-4 text-[#122048]" />
    <h3 className="text-sm font-semibold text-[#122048]">
      Explore by Branch
    </h3>
  </div>

  <div className="flex flex-wrap items-center gap-2">
    {["All Branches", "Dhaka", "Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur", "Mohakhali"].map(
      (branch, index) => (
        <button
          key={branch}
          type="button"
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            index === 0
              ? "border-[#122048] bg-[#122048] text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-[#122048] hover:bg-[#122048]/5 hover:text-[#122048]"
          )}
        >
          {branch}
        </button>
      )
    )}
  </div>
</div>


        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#122048] sm:text-2xl">
              Available Services
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All services are added and managed by our branch managers.
            </p>
          </div>

          {!hasError && (
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
              {services.length}{" "}
              {services.length === 1 ? "service" : "services"}
            </span>
          )}
        </div>

        {hasError ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="size-6 text-red-500" />
            </div>

            <p className="max-w-sm text-sm text-gray-600">
              Could not load services. Make sure the API server is running and
              try again.
            </p>

            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-1 gap-2"
              )}
            >
              <RefreshCw className="size-3.5" />
              Try again
            </Link>
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#122048]/5">
              <Droplets className="size-7 text-[#122048]" />
            </div>

            <div>
              <p className="text-lg font-semibold text-[#122048]">
                No Services Available Yet
              </p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Our branch managers are still preparing their services. Please
                check back soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
