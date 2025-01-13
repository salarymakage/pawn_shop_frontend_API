import { useEffect, useState } from "react";

export default function DisplayOrders() {
  const [orders, setOrders] = useState<any[]>([]); // Store all orders
  const [responseMessage, setResponseMessage] = useState(""); // Message to display
  const [searchInput, setSearchInput] = useState(""); // User input for search

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setResponseMessage("You are not logged in. Please log in.");
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchInput) {
        if (!isNaN(searchInput)) {
          queryParams.append("cus_id", searchInput);
        } else if (/\d/.test(searchInput)) {
          queryParams.append("phone_number", searchInput);
        } else {
          queryParams.append("cus_name", searchInput);
        }
      }

      const response = await fetch(
        `http://127.0.0.1:8000/staff/order?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data.result || []);
        setResponseMessage("Orders fetched successfully.");
      } else {
        const errorData = await response.json();
        setResponseMessage(errorData.detail || "Error fetching orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setResponseMessage("Failed to connect to the server.");
    }
  };

  return (
    <section id="display_orders" className="p-6">
      <div className="container mx-auto">
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">ទិញ &លក់: រុករកអតិថិជន</h2>

          {/* Search Input and Submit Button */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 border border-gray-300 p-2 rounded"
              placeholder="រុករកតាម លេខសំគាល់អតិថិជន, ឈ្មោះអតិថិជន, លេខទូរសព្ទ"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>

          {/* Orders Table */}
          {orders.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="border border-gray-300 p-2">លេខសំគាល់</th>
                <th className="border border-gray-300 p-2">ឈ្មោះ</th>
                <th className="border border-gray-300 p-2">ទំងន់</th>
                <th className="border border-gray-300 p-2">តំលៃលក់</th>
                <th className="border border-gray-300 p-2">ចំនួន</th>
                <th className="border border-gray-300 p-2">ឈ្នួល</th>
                <th className="border border-gray-300 p-2">ប្រាក់កក់</th>
                <th className="border border-gray-300 p-2">តំលៃទិញចូលវិញ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, orderIndex) =>
                order.products.map((product, productIndex) => (
                  <tr key={`${orderIndex}-${productIndex}`}>
                    {/* Render Product Data */}
                    <td className="border border-gray-300 p-2 text-center">
                      {product.prod_id}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.prod_name}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.order_weight}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.product_sell_price}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.order_amount}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.product_labor_cost}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.product_buy_price}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.product_buy_price}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          ) : (
            <p className="text-center text-gray-700 mt-4">No orders found.</p>
          )}

          {/* Response Message */}
          {responseMessage && (
            <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded">
              <p>{responseMessage}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
