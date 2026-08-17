import type { City } from "./schema";

export const CITIES: City[] = [
  {
    slug: "hyderabad",
    name: "Hyderabad",
    nameDeva: "हैदराबाद",
    state: "Telangana",
    areas: [
      "Banjara Hills",
      "Jubilee Hills",
      "Gachibowli",
      "Madhapur",
      "Secunderabad",
      "Tolichowki",
      "Charminar",
      "Kukatpally",
    ],
  },
  {
    slug: "delhi",
    name: "Delhi",
    nameDeva: "दिल्ली",
    state: "Delhi",
    areas: [
      "Connaught Place",
      "Hauz Khas",
      "Karol Bagh",
      "Chandni Chowk",
      "Paharganj",
      "Saket",
      "Lajpat Nagar",
      "Dwarka",
    ],
  },
];
