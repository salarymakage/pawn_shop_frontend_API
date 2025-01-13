"use client";

import { useState, useEffect } from "react";

interface ProductDetail {
  prod_name: string;
  pawn_weight: number;
  pawn_amount: number;
  pawn_unit_price: number;
}

export default function BuySellRecord() {
  const [cusName, setCusName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderDeposit, setOrderDeposit] = useState<number>(0);
  const [orderProductDetail, setOrderProductDetail] = useState<ProductDetail[]>([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [customerId, setCustomerId] = useState("");

  // Add a new product row
  const addProduct = () => {
    setOrderProductDetail((prev) => [
      ...prev,
      {
        prod_name: "",
        pawn_weight: 0,
        pawn_amount: 0,
        pawn_unit_price: 0,
      },
    ]);
  };

  // Delete a product row
  const deleteRow = (index: number) => {
    setOrderProductDetail((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculate Total Price
  const calculateTotalPrice = (): number => {
    return orderProductDetail.reduce((total, product) => {
      return total + product.pawn_amount * product.pawn_unit_price;
    }, 0);
  };

  // Cancel Order
  const cancelOrder = () => {
    setCusName("");
    setAddress("");
    setPhoneNumber("");
    setInvoiceNumber("");
    setOrderDate("");
    setOrderDeposit(0);
    setOrderProductDetail([]);
    setResponseMessage("Order has been canceled.");
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!customerId.trim() || !cusName.trim() || !phoneNumber.trim() || !address.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
  
    if (
      orderProductDetail.length === 0 ||
      orderProductDetail.some(
        (product) =>
          !product.prod_name.trim() ||
          product.pawn_weight <= 0 ||
          product.pawn_amount <= 0 ||
          product.pawn_unit_price <= 0
      )
    ) {
      alert("Please add at least one valid product with all fields filled.");
      return;
    }
  
    const payload = {
      cus_id: parseInt(customerId),
      cus_name: cusName,
      address: address,
      phone_number: phoneNumber,
      pawn_deposit: orderDeposit,
      pawn_date: orderDate || "N/A",
      pawn_expire_date: "2025-01-20",
      pawn_product_detail: orderProductDetail,
    };
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication failed. Please log in.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/staff/pawn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Pawn record created successfully!");
        cancelOrder();
      } else {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
  
        // Convert error object to a readable string
        const errorMessage = errorData.detail || JSON.stringify(errorData, null, 2);
        alert(`Failed to create pawn record: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
  
      // Show a clear error message in case of network failure
      alert(`Failed to connect to the server. Error: ${error.message || error}`);
    }
  };
  
  

  useEffect(() => {
    if (orderProductDetail.length === 0) {
      addProduct();
    }
  }, []);

  const updateProduct = (index: number, field: string, value: string | number) => {
    setOrderProductDetail((prev) =>
      prev.map((product, i) =>
        i === index
          ? {
              ...product,
              [field]: value,
            }
          : product
      )
    );
  };

  return (
    <section id="buy_sell" className="p-6">
      <h1 className="text-2xl font-bold mb-6">កត់ត្រាការទិញ & លក់</h1>
      <div className="container mx-auto flex gap-6">
        {/* Customer Information */}
        <div className="w-2/6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ព័ត៌មានអតិថិជន</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="customerId" className="block text-gray-700 mb-2">
                លេខសំគាល់អតិថិជន:
              </label>
              <input
                type="text"
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cusName" className="block text-gray-700 mb-2">
                ឈ្មោះអតិថិជន:
              </label>
              <input
                type="text"
                id="cusName"
                value={cusName}
                onChange={(e) => setCusName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
                លេខទូរសព្ទ:
              </label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="block text-gray-700 mb-2">
                អាសយដ្ឋាន:
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ព័ត៌មានផលិតផល</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border border-gray-300 p-2">ឈ្មោះផលិតផល</th>
                <th className="border border-gray-300 p-2">ទំងន់</th>
                <th className="border border-gray-300 p-2">ចំនួន</th>
                <th className="border border-gray-300 p-2">តំលៃបញ្ចាំ</th>
                <th className="border border-gray-300 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orderProductDetail.map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={product.prod_name}
                      onChange={(e) => updateProduct(index, "prod_name", e.target.value)}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.pawn_weight}
                      onChange={(e) => updateProduct(index, "pawn_weight", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.pawn_amount}
                      onChange={(e) => updateProduct(index, "pawn_amount", parseInt(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.pawn_unit_price}
                      onChange={(e) => updateProduct(index, "pawn_unit_price", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => deleteRow(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      លប់
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addProduct} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            បន្ថែមផលិតផល
          </button>
          <div className="mt-6">
            <p>តម្លៃសរុប: {calculateTotalPrice()} Riels</p>
          </div>
          <div className="mt-4 flex gap-4">
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
              កត់ត្រាទុក
            </button>
            <button onClick={cancelOrder} className="bg-gray-500 text-white px-4 py-2 rounded">
              លប់ចោល
            </button>
          </div>
        </div>
      </div>
      {responseMessage && (
        <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
          <p>{responseMessage}</p>
        </div>
      )}
    </section>
  );
}
