import { Bike, Bus, ClipboardCheck, Eye, Home, PartyPopper, Receipt, ShoppingCart, Tv, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { SpendCategory } from "@/data/transactions";

/* Icons the app uses instead of emoji. */
export const CATEGORY_ICONS: Record<SpendCategory, LucideIcon> = {
  rent: Home,
  groceries: ShoppingCart,
  delivery: Bike,
  transport: Bus,
  subscriptions: Tv,
  goingOut: PartyPopper,
  other: Receipt,
};

export const CHALLENGE_ICONS: Record<string, LucideIcon> = {
  "delivery-10": Bike,
  "no-delivery-3": UtensilsCrossed,
  "bus-not-bolt": Bus,
  "check-in-7": Eye,
  "going-out-20": PartyPopper,
};

export const challengeIcon = (id: string) => CHALLENGE_ICONS[id] ?? ClipboardCheck;
