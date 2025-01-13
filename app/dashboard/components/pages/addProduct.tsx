"use client";

import { useState, useEffect } from "react";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productAmount, setProductAmount] = useState(0);
  const [searchInput, setSearchInput] = useState(""); // Search by ID or name
  const [responseMessage, setResponseMessage] = useState("");
  const [products, setProducts] = useState([]); // State to store products

  // Fetch all products on page load
  useEffect(() => {
    handleSearch(); // Automatically fetch products
  }, []);



  // Handle form submission to add a product

  const handleSubmit = async () => {
    if (!productName || productPrice <= 0 || productAmount <= 0) {
      setResponseMessage("Please fill out all fields correctly.");
      return;
    }
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      setResponseMessage("Authentication failed. Please log in.");
      return;
    }
  
    const payload = {
      prod_name: productName,
      unit_price: productPrice, // This will be saved as `product_sell_price`
      product_sell_price: productPrice, // Explicitly pass it
      amount: productAmount,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:8000/staff/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        setResponseMessage("Product added successfully!");
        setProductName("");
        setProductPrice(0);
        setProductAmount(0);
  
        // Refresh product list
        handleSearch();
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.detail || "Error adding product.");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server.");
    }
  };
  
  

  
  const handleSearch = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setResponseMessage("You are not logged in. Please log in to continue.");
      return;
    }
  
    try {
      // Dynamically build URL based on `searchInput`
      const url = searchInput
        ? `http://127.0.0.1:8000/staff/products/search/${searchInput}`
        : "http://127.0.0.1:8000/staff/product"; // Default: Fetch all products
  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Normalize response to handle both single object and array
        const result = Array.isArray(data.result) ? data.result : [data.result];
        setProducts(result);
        setResponseMessage("Products retrieved successfully!");
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.detail || "Error retrieving products.");
        setProducts([]); // Clear table if there's an error
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server.");
      setProducts([]); // Clear table on failure
    }
  };
  
  
  // Add a function to handle refreshing the form and table
  const handleRefresh = async () => {
  setProductName("");
  setProductPrice(0);
  setProductAmount(0);
  setSearchInput("");
  await handleSearch(); // Fetch products
};

  

  // ==================================================================================================================================
  

  // Handle delete product by ID or name

  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setResponseMessage("Authentication failed. Please log in.");
      return;
    }
  
    if (!searchInput) {
      setResponseMessage("Please enter a product ID or name to delete.");
      return;
    }
  
    const isNumeric = /^\d+$/.test(searchInput); // Check if input is numeric (ID)
  
    try {
      const url = isNumeric
        ? `http://127.0.0.1:8000/staff/products/${searchInput}` // Delete by ID
        : `http://127.0.0.1:8000/staff/products/name/${searchInput}`; // Delete by Name
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setResponseMessage(
          `Product ${isNumeric ? "ID" : "name"} '${searchInput}' deleted successfully!`
        );
        setSearchInput(""); // Clear the search input
        // Refresh product list after deletion
        handleSearch();
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.detail || "Error deleting product.");
      }
    } catch (error) {
      setResponseMessage("Failed to connect to the server.");
    }
  };
  
  
  
  return (
    <section id="add_product" className="active">
      <div className="container mx-auto p-4 h-full">
        <div className="flex flex-wrap gap-4 h-full">
          {/* Left Section */}
          <div className="w-2/5 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">ព័ត៌មានផលិតផល</h2>
            <div className="flex flex-col">
              {/* Form Inputs */}
              <div className="form-group mb-4">
                <label htmlFor="searchInput" className="block text-gray-700 mb-2">
                  លេខសំគាល់:
                </label>
                <input
                  type="number" // Restrict to numbers only
                  id="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="បញ្ចូលលេខសំគាល់"
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="productName" className="block text-gray-700 mb-2">
                  ឈ្មោះ:
                </label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value); // Directly update the state
                  }}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="បញ្ចូលឈ្មោះផលិតផល"
                />
              </div>


              <div className="form-group mb-4">
                <label
                  htmlFor="productPrice"
                  className="block text-gray-700 mb-2"
                >
                  តំលៃក្នុងមួយឯកតា:
                </label>
                <input
                  type="number"
                  id="productPrice"
                  value={productPrice}
                  onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="0.01"
                  placeholder="Enter unit price"
                />
              </div>
              <div className="form-group mb-4">
                <label
                  htmlFor="productAmount"
                  className="block text-gray-700 mb-2"
                >
                  ចំនួន:
                </label>
                <input
                  type="number"
                  id="productAmount"
                  value={productAmount}
                  onChange={(e) => setProductAmount(parseInt(e.target.value))}
                  className="w-full border border-gray-300 p-2 rounded"
                  min="0"
                  step="1"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4 mt-4">
              <button
                onClick={handleSubmit}
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                កត់ត្រាទុក
              </button>
              <button
                onClick={handleSearch}
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                រុករក
              </button>
              <button
                onClick={handleDelete}
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                លប់ចោល
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">លទ្ធផលពីការរុករក</h2>
            {/* <button
              onClick={handleRefresh}
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              ធ្វើឱ្យស្រស់
            </button> */}

            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="border border-gray-300 p-2">លេខសំគាល់</th>
                  <th className="border border-gray-300 p-2">ឈ្មោះផលិតផល</th>
                  <th className="border border-gray-300 p-2">តំលៃក្នុងមួយឯកតា</th>
                  <th className="border border-gray-300 p-2">ចំនួន</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="bg-gray-100">
                      <td className="border border-gray-300 p-2">{product.id}</td>
                      <td className="border border-gray-300 p-2">{product.name}</td>
                      <td className="border border-gray-300 p-2">{product.price}</td>
                      <td className="border border-gray-300 p-2">{product.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-gray-100">
                    <td colSpan={4} className="border border-gray-300 p-2 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>

        </div>

        {/* Response Message */}
        {responseMessage && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
            <p>{responseMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
