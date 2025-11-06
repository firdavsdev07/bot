// src/routes/tabRoutes.ts

import DailySummary from "../pages/dailySummary";
import Clients from "../pages/clients";
import Debtors from "../pages/debtors";
import Collection from "../pages/collection";
import Expenses from "../pages/expenses";

export const tabRoutes = [
  { path: "/summary", label: "Hisobot", component: DailySummary },
  { path: "/clients", label: "Mijozlar", component: Clients },
  { path: "/debtors", label: "Qarzdorlar", component: Debtors },
  { path: "/collected", label: "To'lovlar", component: Collection },
  { path: "/expenses", label: "Harajatlar", component: Expenses },
];
