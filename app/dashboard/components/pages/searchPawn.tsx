export default function SearchPawn() {
    return (
      <section id="search_pawn" className="p-6">
        <div className="container mx-auto flex flex-wrap gap-6">
          {/* Left Section */}
          <div className="w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">ការរុករកព័ត៌មានអតិថិជនបញ្ចាំ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="form-group">
                <label htmlFor="customerID" className="block text-gray-700 mb-2">
                  លេខសំគាល់អតិថិជន:
                </label>
                <input
                  type="text"
                  id="customerID"
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerName" className="block text-gray-700 mb-2">
                  ឈ្មោះ:
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  លេខទូរសព្ទ:
                </label>
                <input
                  type="number"
                  id="phone"
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>
  
            <h2 className="text-xl font-bold mb-4">ព័ត៌មានផលិតផល</h2>
            <table className="w-full border-collapse border border-gray-300 mb-6">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="border border-gray-300 p-2">លេខសំគាល់</th>
                  <th className="border border-gray-300 p-2">ឈ្មោះ</th>
                  <th className="border border-gray-300 p-2">ទំងន់</th>
                  <th className="border border-gray-300 p-2">តំលៃបញ្ចាំ</th>
                  <th className="border border-gray-300 p-2">ចំនួន</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-2">P001</td>
                  <td className="border border-gray-300 p-2">A</td>
                  <td className="border border-gray-300 p-2">100</td>
                  <td className="border border-gray-300 p-2">10</td>
                  <td className="border border-gray-300 p-2">90</td>
                </tr>
                <tr className="bg-gray-200">
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                  <td className="border border-gray-300 p-2">&nbsp;</td>
                </tr>
              </tbody>
            </table>
  
            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                កត់ត្រាទុក
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                លប់ចោល
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }
  