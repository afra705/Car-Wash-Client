import type { TService, TServiceInput } from "@/app/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function getServices(
  email: string
): Promise<TService[]> {
  const res = await fetch(
    `${API_BASE_URL}/services?email=${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch services");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}


export async function getPublicServices(): Promise<TService[]> {
  const res = await fetch(`${API_BASE_URL}/services/public`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch services");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getServiceById(id: string): Promise<TService | null> {
  const res = await fetch(
    `${API_BASE_URL}/services/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 400 || res.status === 404) {
    return null;
  }

  if (!res.ok) throw new Error("Failed to fetch service");

  return res.json();
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
