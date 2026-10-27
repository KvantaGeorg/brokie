import { Home, PieChart, Target, User, type LucideIcon } from "lucide-react";

export type PhoneTab = "home" | "spending" | "goals" | "profile";

export const PHONE_TABS: { id: PhoneTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "spending", label: "Spending", icon: PieChart },
  { id: "goals", label: "Goals", icon: Target },
  { id: "profile", label: "Profile", icon: User },
];
