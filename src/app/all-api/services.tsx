import type { TService, TServiceInput } from "@/app/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getServices(): Promise<TService[]> {
  const res = await fetch(`${API_BASE_URL}/services`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}

export async function createService(payload: TServiceInput): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to add service");
  }
}
