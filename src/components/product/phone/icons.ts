import { Bike, Bus, CalendarCheck, Coffee, HeartPulse, Home, PartyPopper, PiggyBank, Receipt, ShoppingBag, ShoppingCart, Smartphone, Ticket, TrendingDown, Tv, type LucideIcon } from "lucide-react";
import type { SpendCategory } from "@/data/transactions";
import type { ChallengeId } from "@/data/challenges";
import type { Cat } from "@/data/students";

/* Icons the app uses instead of emoji. CATEGORY_ICONS: the landing page's example month; STUDENT_ICONS: the demo app. */
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
  "focus-budget": TrendingDown,
};

export const STUDENT_ICONS: Record<Cat, LucideIcon> = {
  housing: Home,
  groceries: ShoppingCart,
  eatingOut: Coffee,
  transport: Bus,
  subscriptions: Smartphone,
  fun: Ticket,
  shopping: ShoppingBag,
  care: HeartPulse,
};
