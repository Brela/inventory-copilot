import React, { useContext } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import { OrdersContext } from "./contexts/OrdersContext.jsx";
import { AuthContext } from "./contexts/AuthContext.jsx";
import Home from "./pages/InventoryCopilot/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OrderedDeliveredPopup from "./containers/Inventory/modals/OrderedDeliveredPopup.jsx";
import { Toaster } from "react-hot-toast";
import { InventoryProvider } from "./contexts/InventoryContext.jsx";
import { OrdersProvider } from "./contexts/OrdersContext.jsx";

export default function AppRouterContent() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDemo = params.get("demo") === "true";

  return (
    <>
      <InventoryProvider>
        <OrdersProvider>
          <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </>
        </OrdersProvider>
      </InventoryProvider>
    </>
  );
}
