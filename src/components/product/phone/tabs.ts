import { Home, PieChart, Trophy, User, type LucideIcon } from "lucide-react";

export type PhoneTab = "home" | "spending" | "challenges" | "profile";

export const PHONE_TABS: { id: PhoneTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "spending", label: "Spending", icon: PieChart },
  { id: "challenges", label: "Challenges", icon: Trophy },
  { id: "profile", label: "Profile", icon: User },
];
