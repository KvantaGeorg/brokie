import { Bike, Bus, CalendarCheck, Home, PartyPopper, PiggyBank, Receipt, ShoppingCart, Tv, type LucideIcon } from "lucide-react";
import type { SpendCategory } from "@/data/transactions";
import type { ChallengeId } from "@/data/challenges";

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

export const CHALLENGE_ICONS: Record<ChallengeId, LucideIcon> = {
  "goal-add": PiggyBank,
  "check-budget": CalendarCheck,
  "delivery-budget": Bike,
};
