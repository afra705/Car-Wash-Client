import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Droplets,
  MapPin,
} from "lucide-react";

import type { TService } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

const ServiceCard = ({ service }: { service: TService }) => {
  const href = `/services/${service._id}`;

  return (
    <Card className="group h-full gap-0 overflow-hidden bg-white pt-0 ring-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={href}
        className="relative block h-52 w-full overflow-hidden bg-gray-100"
      >
        {service.image ? (
          <img
            src={service.image}
            alt={service.serviceName || "Car wash service"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#122048] to-[#1b2e63] text-white/80">
            <Droplets className="size-10" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Cleanify
            </span>
          </div>
        )}

        <Badge className="absolute left-3 top-3 bg-[#FACC15] text-[#122048] shadow-sm hover:bg-[#FACC15]">
          {service.category || "Car Wash"}
        </Badge>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-3 pt-5">
        <div>
          <Link href={href}>
            <h3 className="line-clamp-1 text-lg font-semibold text-[#122048] transition-colors group-hover:text-[#1b2e63]">
              {service.serviceName || "Untitled service"}
            </h3>
          </Link>

          <p className="mt-1.5 line-clamp-2 min-h-10 text-sm text-gray-500">
            {service.description ||
              "Professional car wash and detailing service handled by our expert team."}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
          {service.branch && (
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#122048]" />
              {service.branch}
            </span>
          )}

          {service.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-[#122048]" />
              {service.location}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="mt-1 flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Starting at
          </p>
          <p className="text-lg font-bold text-[#122048]">
            {formatPrice(service.price)}
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#122048] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1b2e63]"
        >
          View Details
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
