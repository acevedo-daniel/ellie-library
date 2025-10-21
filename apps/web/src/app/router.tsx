import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../pages/Layout.js";
import { Dashboard } from "../pages/Dashboard.js";
import { BooksPage } from "../pages/BooksPage.js";
import { MembersPage } from "../pages/MembersPage.js";
import { LoansPage } from "../pages/LoansPage.js";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "books", element: <BooksPage /> },
      { path: "members", element: <MembersPage /> },
      { path: "loans", element: <LoansPage /> },
    ],
  },
]);
