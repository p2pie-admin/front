import { IPhysicalExchanger } from "../../types/exchanger";

// Temporary fallback data used when CMS responses are unavailable.
export const FAKE_PHYSICAL_EXCHANGERS: IPhysicalExchanger[] = [
  {
    id: "fake-1",
    name: "Bosphorus Bureau",
    lat: 41.010737,
    lng: 28.976594,
    contact: "+90 212 000 0001",
    opened: true,
    days_off: ["sunday"],
    updatedAt: "2024-01-15T09:00:00.000Z",
    physical_rates: [
      {
        id: "fake-1-usd",
        currency: { id: "usd", code: "USD", accuracy: "2" },
        buying: 32.5,
        selling: 33.1,
      },
      {
        id: "fake-1-eur",
        currency: { id: "eur", code: "EUR", accuracy: "2" },
        buying: 34.2,
        selling: 35.05,
      },
    ],
  },
  {
    id: "fake-2",
    name: "Galata Exchange",
    lat: 41.024981,
    lng: 28.973093,
    contact: "+90 212 000 0002",
    opened: true,
    days_off: ["saturday"],
    updatedAt: "2024-01-16T09:00:00.000Z",
    physical_rates: [
      {
        id: "fake-2-usd",
        currency: { id: "usd", code: "USD", accuracy: "2" },
        buying: 32.8,
        selling: 33.4,
      },
      {
        id: "fake-2-gbp",
        currency: { id: "gbp", code: "GBP", accuracy: "2" },
        buying: 39.9,
        selling: 40.8,
      },
    ],
  },
  {
    id: "fake-3",
    name: "Kadikoy Currency",
    lat: 40.990921,
    lng: 29.025498,
    contact: "+90 216 000 0003",
    opened: true,
    updatedAt: "2024-01-17T09:00:00.000Z",
    physical_rates: [
      {
        id: "fake-3-usd",
        currency: { id: "usd", code: "USD", accuracy: "2" },
        buying: 32.2,
        selling: 32.9,
      },
      {
        id: "fake-3-rub",
        currency: { id: "rub", code: "RUB", accuracy: "2" },
        buying: 0.33,
        selling: 0.36,
      },
    ],
    days_off: [],
  },
];
