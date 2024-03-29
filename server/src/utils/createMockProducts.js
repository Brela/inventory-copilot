export const createMockProducts = (userID = "000") => {
  return [
    {
      sku: userID.slice(-3) + "001",
      brand: "Dell",
      productName: "Inspiron 5000",
      description: "15.6-inch laptop with Intel Core i5",
      inStock: 40,
      shipper: "FastShip",
      reorderAt: 35,
      orderQty: 15,
      unitPrice: 600,
    },
    {
      sku: userID.slice(-3) + "002",
      brand: "HP",
      productName: "Pavilion",
      description: "14-inch laptop with Intel Core i7",
      inStock: 80,
      shipper: "SpeedyDelivery",
      reorderAt: 77,
      orderQty: 10,
      unitPrice: 750,
    },
    {
      sku: userID.slice(-3) + "003",
      brand: "Lenovo",
      productName: "ThinkPad",
      description: "13-inch business laptop",
      inStock: 102,
      shipper: "Express",
      reorderAt: 97,
      orderQty: 30,
      unitPrice: 700,
    },

    {
      sku: userID.slice(-3) + "004",
      brand: "Apple",
      productName: "iPhone 13",
      description: "Latest Apple iPhone with Face ID",
      inStock: 152,
      shipper: "AirDelivery",
      reorderAt: 150,
      orderQty: 10,
      unitPrice: 999,
    },
    {
      sku: userID.slice(-3) + "005",
      brand: "Samsung",
      productName: "Galaxy S21",
      description: "Samsung flagship smartphone",
      inStock: 50,
      shipper: "Gamer's Ship",
      reorderAt: 47,
      orderQty: 15,
      unitPrice: 850,
    },
    {
      sku: userID.slice(-3) + "006",
      brand: "Google",
      productName: "Pixel 6",
      description: "Google's latest smartphone",
      inStock: 75,
      shipper: "TechExpress",
      reorderAt: 70,
      orderQty: 20,
      unitPrice: 799,
    },
    {
      sku: userID.slice(-3) + "007",
      brand: "Apple",
      productName: "Pixel 6",
      description: "Apple's latest smartphone",
      inStock: 75,
      shipper: "TechExpress",
      reorderAt: 70,
      orderQty: 20,
      unitPrice: 1099,
    },
  ];
};
