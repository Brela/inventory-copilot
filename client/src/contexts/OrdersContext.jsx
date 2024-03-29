import { createContext, useState, useEffect } from "react";
import { getOrdersList } from "../api/ordersAPI";
import React from "react";

export const OrdersContext = createContext({
  orders: [],
  activeOrders: [],
  reloadOrders: () => {},
  deliveriesOn: false,
  useSelectedOnlyOn: false,
  displayOrderedDeliveredPopup: false,
  setDisplayOrderedDeliveredPopup: () => {},
  setDeliveriesOn: () => {},
  setUseSelectedOnlyOn: () => {},
  orderedDeliveryPopupContent: [],
  setOrderedDeliveryPopupContent: [],
});

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [deliveriesOn, setDeliveriesOn] = useState(false);
  const [useSelectedOnlyOn, setUseSelectedOnlyOn] = useState(false);
  const [displayOrderedDeliveredPopup, setDisplayOrderedDeliveredPopup] =
    useState(false);
  const [orderedDeliveryPopupContent, setOrderedDeliveryPopupContent] =
    useState([]);

  const reloadOrders = async () => {
    try {
      const ordData = await getOrdersList();
      setOrders(ordData);
    } catch (error) {
      console.error("Error fetching orders list:", error);
    }
  };

  useEffect(() => {
    reloadOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const onlyActive = orders.filter((item) => item.orderStatus === "active");
      setActiveOrders(onlyActive);
    }
  }, [orders]);

  // -----------------------------------

  const value = {
    orders,
    activeOrders,
    reloadOrders,
    deliveriesOn,
    setDeliveriesOn,
    useSelectedOnlyOn,
    setUseSelectedOnlyOn,
    displayOrderedDeliveredPopup,
    setDisplayOrderedDeliveredPopup,
    orderedDeliveryPopupContent,
    setOrderedDeliveryPopupContent,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};
