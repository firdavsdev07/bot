// src/routes/tabRoutes.ts

import DailySummary from "../pages/dailySummary";
import Clients from "../pages/clients";
import Debtors from "../pages/debtors";
import Expenses from "../pages/expenses";
import Notifications from "../pages/notifications";

import { BarChart3, Users, AlertTriangle, Receipt, Bell } from "lucide-react";

export const tabRoutes = [
  { path: "/summary", label: "Hisobot", icon: BarChart3, component: DailySummary },
  { path: "/clients", label: "Mijozlar", icon: Users, component: Clients },
  { path: "/debtors", label: "Qarzdorlar", icon: AlertTriangle, component: Debtors },
  { path: "/expenses", label: "Harajatlar", icon: Receipt, component: Expenses },
  { path: "/notifications", label: "Xabarlar", icon: Bell, component: Notifications, showBadge: true },
];
