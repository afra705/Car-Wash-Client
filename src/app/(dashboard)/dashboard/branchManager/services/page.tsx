
/* eslint-disable react-hooks/preserve-manual-memoization */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, Droplets, Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { createService, getServices } from "@/app/all-api/services";
import type { TService, TServiceStatus } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";

type TServiceForm = {
  serviceName: string;
  category: string;
  branch: string;
  location: string;
  price: string;
  description: string;
  image: string;
  status: TServiceStatus;
};

const EMPTY_FORM: TServiceForm = {
  serviceName: "",
  category: "",
  branch: "Dhaka",
  location: "",
  price: "",
  image: "",
  description: "",
  status: "active",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  inactive: "bg-gray-100 text-gray-600",
};

const LOAD_ERROR_MESSAGE =
  "Could not load services. Make sure the API server is running and try again.";

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
    month: "short",
    day: "numeric",
  });
};

const AddServices = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [services, setServices] = useState<TService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<TServiceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // Load services
  const loadServices = useCallback(
    async (showLoader = true) => {
      if (!user?.email) return;

      if (showLoader) setLoading(true);
      setError(null);

      try {
        const data = await getServices(user.email);
        setServices(data);
      } catch {
        setError(LOAD_ERROR_MESSAGE);
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [user?.email]
  );

  // Initial services load
  useEffect(() => {
    if (!user?.email) return;

    let cancelled = false;

    const loadInitialServices = async () => {
      try {
        const data = await getServices(user.email);

        if (!cancelled) {
          setServices(data);
        }
      } catch {
        if (!cancelled) {
          setError(LOAD_ERROR_MESSAGE);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialServices();

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  // Open dialog
  const handleOpenDialog = () => {
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);

    if (!open) {
      setForm(EMPTY_FORM);
    }
  };

  // Update form
  const updateForm = <K extends keyof TServiceForm>(
    field: K,
    value: TServiceForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit service
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const price = Number(form.price);

    if (!form.serviceName.trim() || !form.category.trim()) {
      toast.error("Service name and category are required.");
      return;
    }

    if (!form.branch) {
      toast.error("Please select a branch.");
      return;
    }

    if (!Number.isFinite(price) || price < 0 || !form.price.trim()) {
      toast.error("Please enter a valid price.");
      return;
    }

    setSaving(true);

    try {
      await createService({
        serviceName: form.serviceName.trim(),
        category: form.category.trim(),
        branch: form.branch,
        location: form.location.trim(),
        image: form.image.trim(),
        price,
        description: form.description.trim(),
        status: form.status,
        createdAt: new Date().toISOString(),
        createdBy: user?.email ?? "",
      });

      toast.success("Service added successfully.");

      setIsDialogOpen(false);
      setForm(EMPTY_FORM);

      await loadServices(false);
    } catch {
      toast.error("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#122048]">
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the car wash services offered to your customers.
          </p>
        </div>

        <Button
          onClick={handleOpenDialog}
          className="h-10 gap-2 rounded-lg bg-[#122048] px-4 text-white hover:bg-[#122048]/90"
        >
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {/* Services table */}
      <Card className="bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-[#122048]">
              All Services
            </CardTitle>

            <Badge variant="outline" className="text-gray-600">
              {services.length}{" "}
              {services.length === 1 ? "service" : "services"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="px-4 font-semibold">
                    Service
                  </TableHead>
                  <TableHead className="font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold">
                    Branch
                  </TableHead>
                  <TableHead className="font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="size-6 text-red-500" />
              </div>

              <p className="max-w-sm text-sm text-gray-600">
                {error}
              </p>

              <Button
                variant="outline"
                onClick={() => void loadServices()}
                className="mt-1 gap-2"
              >
                <RefreshCw className="size-3.5" />
                Try again
              </Button>
            </div>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#122048]/5">
                <Droplets className="size-7 text-[#122048]" />
              </div>

              <div>
                <p className="text-lg font-semibold text-[#122048]">
                  No Services Added Yet
                </p>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  There are no services available. Add your first
                  car wash service to get started.
                </p>
              </div>

              <Button
                onClick={handleOpenDialog}
                className="mt-2 gap-2 bg-[#122048] text-white hover:bg-[#122048]/90"
              >
                <Plus className="size-4" />
                Add Your First Service
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="px-4 font-semibold">
                    Image
                  </TableHead>
                  <TableHead className="font-semibold">
                    Service
                  </TableHead>
                  <TableHead className="font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="font-semibold">
                    Branch
                  </TableHead>
                  <TableHead className="font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold">
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services.map((service, index) => {
                  const status = String(service.status ?? "pending");

                  const statusClass =
                    STATUS_STYLES[status.toLowerCase()] ??
                    "bg-blue-100 text-blue-700";

                  return (
                    <TableRow
                      key={service._id ?? index}
                      className="hover:bg-gray-50/70"
                    >
                      {/* Image */}
                      <TableCell className="px-4">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.serviceName || "Service"}
                            className="h-12 w-16 rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </TableCell>

                      {/* Service */}
                      <TableCell className="max-w-[220px] whitespace-normal">
                        <p className="font-medium text-[#122048]">
                          {service.serviceName || "Untitled service"}
                        </p>

                        {service.description && (
                          <p
                            className="mt-0.5 truncate text-xs text-gray-500"
                            title={service.description}
                          >
                            {service.description}
                          </p>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-gray-600">
                        {service.category || "—"}
                      </TableCell>

                      {/* Branch */}
                      <TableCell className="text-gray-600">
                        {service.branch || "—"}
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-medium text-gray-700">
                        {formatPrice(service.price)}
                      </TableCell>

                      {/* Location */}
                      <TableCell className="text-gray-600">
                        {service.location || "—"}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={`${statusClass} border-transparent capitalize`}
                        >
                          {status}
                        </Badge>
                      </TableCell>

                      {/* Created */}
                      <TableCell className="text-gray-500">
                        {formatDate(service.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add service dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="!bg-white !opacity-100 !backdrop-blur-none border border-gray-200 shadow-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#122048]">
              Add Service
            </DialogTitle>

            <DialogDescription>
              Fill in the details below to add a new car wash service.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Service name */}
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="service-name">
                  Service name <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="service-name"
                  value={form.serviceName}
                  onChange={(event) =>
                    updateForm("serviceName", event.target.value)
                  }
                  placeholder="e.g. Premium Exterior Wash"
                  required
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="service-category">
                  Category <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="service-category"
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  placeholder="e.g. Exterior Wash"
                  required
                />
              </div>

              {/* Branch - Default Dhaka */}
              <div className="grid gap-2">
                <Label htmlFor="service-branch">
                  Branch
                </Label>

                <Input
                  id="service-branch"
                  value={form.branch}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label htmlFor="service-price">
                  Price <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="service-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    updateForm("price", event.target.value)
                  }
                  placeholder="e.g. 25.00"
                  required
                />
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="service-location">
                  Location
                </Label>

                <Input
                  id="service-location"
                  value={form.location}
                  onChange={(event) =>
                    updateForm("location", event.target.value)
                  }
                  placeholder="e.g. Gulshan Branch"
                />
              </div>

              {/* Image */}
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="service-image">
                  Service Image URL
                </Label>

                <Input
                  id="service-image"
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    updateForm("image", event.target.value)
                  }
                  placeholder="https://example.com/service-image.jpg"
                />

                {form.image && (
                  <div className="mt-2">
                    <img
                      src={form.image}
                      alt="Service preview"
                      className="h-32 w-full rounded-lg border object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="grid gap-2">
                <Label htmlFor="service-status">
                  Status
                </Label>

                <NativeSelect
                  id="service-status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as TServiceStatus
                    )
                  }
                  className="w-full"
                >
                  <NativeSelectOption value="active">
                    Active
                  </NativeSelectOption>

                  <NativeSelectOption value="pending">
                    Pending
                  </NativeSelectOption>

                  <NativeSelectOption value="inactive">
                    Inactive
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              {/* Description */}
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="service-description">
                  Description
                </Label>

                <Textarea
                  id="service-description"
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  placeholder="Briefly describe what this service includes..."
                  rows={3}
                />
              </div>
            </div>

            {/* Dialog footer */}
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="gap-2 bg-[#122048] text-white hover:bg-[#122048]/90"
              >
                {saving && (
                  <Loader2 className="size-4 animate-spin" />
                )}

                {saving ? "Adding..." : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddServices;
