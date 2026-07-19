"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CampusDiscovery } from "./campus-discovery";

export function CampusDiscoveryWrapper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLocationChange = (lat: number, lng: number, radiusKm: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", lat.toString());
    params.set("lng", lng.toString());
    params.set("radiusKm", radiusKm.toString());
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return <CampusDiscovery onLocationChange={handleLocationChange} />;
}
