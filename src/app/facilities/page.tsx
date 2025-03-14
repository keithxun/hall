"use client";

import { api } from "~/trpc/react";
import Link from "next/link";

export default function FacilitiesPage() {
  const { data: facilities, isLoading, error } = api.facility.getAll.useQuery();

  if (isLoading) return <p>Loading facilities...</p>;
  if (error) return <p>Error loading facilities: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Facilities Overview</h1>
      <ul className="space-y-4">
        {facilities?.map((facility) => (
          <li
            key={facility.id}
            className="rounded border p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <h2 className="text-xl font-semibold">{facility.name}</h2>
            {facility.location && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Location: {facility.location}
              </p>
            )}
            <Link
              href={`/facilities/${facility.id}`}
              className="mt-2 inline-block text-blue-600 underline hover:text-blue-800"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
