"use client";

import { useState, useEffect } from "react";

interface ProductDetail {
  prod_name: string;
  order_weight: number;
  order_amount: number;
  product_sell_price: number;
  product_labor_cost: number;
  product_buy_price: number;
  
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
  const [customerName, setCustomerName] = useState("");

  // const [cusID, setCusID] = useState("");


  // Add a new product row
  const addProduct = () => {
    console.log("Adding a new product row");
    setOrderProductDetail((prev) => [
      ...prev,
      {
        prod_name: "",
        order_weight: 0,
        order_amount: 0,
        product_sell_price: 0,
        product_labor_cost: 0,
        product_buy_price: 0,
      },
    ]);
  };
  
  const deleteRow = (index: number) => {
    setOrderProductDetail((prev) => prev.filter((_, i) => i !== index));
  };
  
  // Calculate Total Price
  const calculateTotalPrice = (): number => {
    return orderProductDetail.reduce((total, product) => {
      return total + product.product_labor_cost + product.order_amount * product.product_sell_price;
    }, 0);
  };

  // Cancel Order
  const cancelOrder = () => {
    // Clear all fields and reset
    setCusName("");
    setAddress("");
    setPhoneNumber("");
    setInvoiceNumber("");
    setOrderDate("");
    setOrderDeposit(0);
    setOrderProductDetail([]);
    setResponseMessage("Order has been canceled.");
  };

  // Print Invoice
  const printInvoice = () => {
    // window.print();
    // setResponseMessage("Invoice is being printed.");
  };


  // Handle form submission
  const handleSubmit = async () => {
    // Check if required fields are empty
    if (!customerId.trim() || !customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      setResponseMessage("Please fill in all required fields.");
      return;
    }
  
    // Check if at least one product is added and all products have required fields
    if (
      orderProductDetail.length === 0 ||
      orderProductDetail.some(
        (product) =>
          !product.prod_name.trim() ||
          product.order_weight <= 0 ||
          product.order_amount <= 0 ||
          product.product_sell_price <= 0
      )
    ) {
      setResponseMessage("Please add at least one valid product with all fields filled.");
      return;
    }
  
    const payload = {
      cus_id: customerId,
      cus_name: customerName,
      address: address,
      phone_number: phoneNumber,
      invoice_number: invoiceNumber || "N/A",
      order_date: orderDate || "N/A",
      order_deposit: orderDeposit,
      order_product_detail: orderProductDetail,
    };
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setResponseMessage("Authentication failed. Please log in.");
        return;
      }
  
      const response = await fetch("http://127.0.0.1:8000/staff/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const successData = await response.json();
        setResponseMessage(successData.message || "Order saved successfully!");
        // Reset form
        setCustomerId("");
        setCustomerName("");
        setAddress("");
        setPhoneNumber("");
        setInvoiceNumber("");
        setOrderDate("");
        setOrderDeposit(0);
        setOrderProductDetail([]);
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.message || "Failed to save order. Please try again.");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server. Please check your connection.");
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
        {/* Left Section: Customer Information */}
        <div className="w-2/6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ព័ត៌មានអតិថិជន</h2>
          <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="id" className="block text-gray-700 mb-2">
              លេខសំគាល់អតិថិជន:
            </label>
            <input
              type="number" // Ensures only numbers can be input
              id="id"
              value={customerId} // Use a separate state for ID
              onChange={(e) => setCustomerId(e.target.value)} // Update customerId state
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="បញ្ចូលលេខសំគាល់អតិថិជន"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerName" className="block text-gray-700 mb-2">
              ឈ្មោះអតិថិជន:
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName} // Use a separate state for Name
              onChange={(e) => setCustomerName(e.target.value)} // Update customerName state
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="បញ្ចូលឈ្មោះអតិថិជន"
            />
          </div>


            <div className="form-group">
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                លេខទូរស័ព្ទ:
              </label>
              <input
                type="text"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="បញ្ចូលលេខទូរស័ព្ទ"
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
                placeholder="បញ្ចូលអាសយដ្ឋាន"
              />
            </div>
          </div>
        </div>

        {/* Right Section: Product Information */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">ព័ត៌មានផលិតផល</h2>
          <div className="form-group flex gap-4">
          {/* Invoice Number */}
          <div className="flex-1">
            <label htmlFor="invoiceNumber" className="block text-gray-700 mb-2">
              លេខវិក្កយបត្រ:
            </label>
            <input
              type="text"
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="លេខវិក្កយបត្រ"
            />
          </div>

          {/* Order Date */}
          <div className="flex-1">
            <label htmlFor="orderDate" className="block text-gray-700 mb-2">
              ថ្ងៃបញ្ជាទិញ:
            </label>
            <input
              type="date"
              id="orderDate"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

          
        <div className="flex justify-center items-center h-20">
          <button
            onClick={addProduct}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            បន្ថែមផលិតផល
          </button>
        </div>

          {/* <button
            onClick={removeProduct}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
          >
            លប់ចោលផលិតផល
          </button> */}
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border border-gray-300 p-2">ឈ្មោះផលិតផល</th>
                <th className="border border-gray-300 p-2">ទំងន់</th>
                <th className="border border-gray-300 p-2">ចំនួន</th>
                <th className="border border-gray-300 p-2">តំលៃលក់</th>
                <th className="border border-gray-300 p-2">ឈ្នួល</th>
                <th className="border border-gray-300 p-2">តំលៃទិញ</th>
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
                      placeholder="ឈ្មោះ"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.order_weight}
                      onChange={(e) => updateProduct(index, "order_weight", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.order_amount}
                      onChange={(e) => updateProduct(index, "order_amount", parseInt(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.product_sell_price}
                      onChange={(e) => updateProduct(index, "product_sell_price", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.product_labor_cost}
                      onChange={(e) => updateProduct(index, "product_labor_cost", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      value={product.product_buy_price}
                      onChange={(e) => updateProduct(index, "product_buy_price", parseFloat(e.target.value))}
                      className="w-full p-1 bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => deleteRow(index)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      លប់
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>



          <div className="form-group flex gap-4 mt-4">
  {/* Total Price */}
  <div className="flex-1">
    <label htmlFor="totalPrice" className="block text-gray-700 mb-2">
      តម្លៃសរុប:
    </label>
    <input
      type="number"
      id="totalPrice"
      value={calculateTotalPrice()}
      readOnly
      className="w-full border border-gray-300 p-2 rounded bg-gray-100"
    />
  </div>

  {/* Order Deposit */}
  <div className="flex-1">
    <label htmlFor="orderDeposit" className="block text-gray-700 mb-2">
      កក់/បង់សរុប:
    </label>
    <input
      type="number"
      id="orderDeposit"
      value={orderDeposit}
      onChange={(e) => setOrderDeposit(parseFloat(e.target.value))}
      className="w-full border border-gray-300 p-2 rounded"
    />
  </div>
</div>


<div className="flex justify-center gap-4 mt-6">
  <button
    onClick={handleSubmit}
    className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-blue-600 shadow-md"
  >
    កត់ត្រាទុក
  </button>

  <button
    onClick={printInvoice}
    className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-green-600 shadow-md"
  >
    បោះពុម្ពវិក្កយបត្រ
  </button>

  <button
    onClick={cancelOrder}
    className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-red-600 shadow-md"
  >
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
