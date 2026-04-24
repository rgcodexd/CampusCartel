import type { College, Listing } from "../types/models.js";

export const colleges: College[] = [
  { id: "du-north", name: "Delhi University North Campus", city: "Delhi", lat: 28.6889, lng: 77.2093 },
  { id: "iitd", name: "IIT Delhi", city: "Delhi", lat: 28.545, lng: 77.1926 },
  { id: "ipu", name: "IP University", city: "Delhi", lat: 28.5955, lng: 77.0157 },
];

export const listingsSeed: Listing[] = [
  {
    id: "lst-001",
    title: "MacBook Air M1 16GB",
    mode: "buy",
    category: "electronics",
    priceLabel: "INR 55,000",
    college: "IIT Delhi",
    distanceKm: 2.4,
    ownerStudentId: "student_1001",
  },
  {
    id: "lst-002",
    title: "Mechanical Engineering Notes Set",
    mode: "rent",
    category: "books",
    priceLabel: "INR 120/week",
    college: "Delhi University North Campus",
    distanceKm: 1.2,
    ownerStudentId: "student_1002",
  },
  {
    id: "lst-003",
    title: "Trek Hybrid Bicycle",
    mode: "rent",
    category: "mobility",
    priceLabel: "INR 180/day",
    college: "IP University",
    distanceKm: 4.1,
    ownerStudentId: "student_1003",
  },
];
