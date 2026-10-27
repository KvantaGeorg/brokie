import { createContext, useContext } from "react";

/* Full-screen layers inside the demo phone, opened from any screen. */
export type Sheet = { kind: "wrapped" } | { kind: "savings"; amount?: number } | { kind: "afford" };

export const SheetContext = createContext<(sheet: Sheet) => void>(() => {});
export const useOpenSheet = () => useContext(SheetContext);
