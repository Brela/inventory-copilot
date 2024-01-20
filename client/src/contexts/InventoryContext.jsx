import { createContext, useContext, useState, useEffect } from "react";
import { getInventoryList } from "../api/inventoryAPI";
import { useTempInStock } from "../hooks/useTempStock";

import { AuthContext } from "./AuthContext";

export const InventoryContext = createContext({
  userData: {},
  inventory: [],
  reloadInventory: () => {},
  startUsage: () => {},
  stopUsage: () => {},
  resetInventory: () => {},
  useSelectedOnlyOn: false,
  setUseSelectedOnlyOn: () => {},
  isUsingStock: false,
  tempInStock: {},
  setTempInStock: () => {},
  selectedItems: [],
  setSelectedItems: () => {},
  toggleSelectedItem: () => {},
  isLoading: false,
  needStatsUpdate: false,
  setNeedStatsUpdate: () => {},
});

export const InventoryProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [inventory, setInventory] = useState([]);
  const [isUsingStock, setIsUsingStock] = useState(false);
  const [selectedItems, setSelectedItems] = useState(() => {
    // Load saved items from local storage if they exist
    const savedItems = localStorage.getItem("selectedItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tempInStock, setTempInStock] = useState({});
  // this is for demo controls to set the "Use Selected (products) Only" on or off
  const [useSelectedOnlyOn, setUseSelectedOnlyOn] = useState(false);

  const { isLoggedIn, userId } = useContext(AuthContext);
  const [needStatsUpdate, setNeedStatsUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryData = await getInventoryList();
        setInventory(inventoryData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const reloadInventory = async (newInventory) => {
    setIsLoading(true);

    if (newInventory) {
      setInventory(newInventory);
    } else {
      try {
        const data = await getInventoryList();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory list:", error);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    reloadInventory();
  }, [isLoggedIn, userId]);

  // call the tempInStock hook that takes care of decreasing the inventory
  useTempInStock(
    inventory,
    isUsingStock,
    setIsUsingStock,
    tempInStock,
    setTempInStock,
    useSelectedOnlyOn,
    selectedItems,
  );
  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  // -----------------------  toggle selected items ---------------------
  const getInventoryIndex = (itemId) => {
    return inventory.findIndex((item) => item.id === itemId);
  };

  const toggleSelectedItem = (item) => {
    console.log("here");
  };

  // --------------------- demo controls -------------------

  const startUsage = () => {
    setIsUsingStock(true);
  };

  const stopUsage = () => {
    setIsUsingStock(false);
  };

  const resetInventory = () => {
    reloadInventory();
  };
  // -----------------------------------

  const value = {
    userData,
    inventory,
    reloadInventory,
    startUsage,
    stopUsage,
    resetInventory,
    useSelectedOnlyOn,
    setUseSelectedOnlyOn,
    isUsingStock,
    tempInStock,
    setTempInStock,
    selectedItems: Array.from(selectedItems),
    setSelectedItems,
    toggleSelectedItem,
    isLoading,
    needStatsUpdate,
    setNeedStatsUpdate,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
