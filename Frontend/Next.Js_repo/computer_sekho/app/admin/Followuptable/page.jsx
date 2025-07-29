'use client';
import React, { useEffect, useState } from 'react';

const FollowUpTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;  // change to 10 after bd is created

  useEffect(() => {
    const mockData = [
      { id: 1, enquirer: "XXXXXX", student: "AAAAAA", phone: "9812345678", course: "PG DAC", followUpDate: "12-Oct-22", staff: "Ruchita" },
      { id: 2, enquirer: "YYYYYY", student: "BBBBBBBB", phone: "9812345679", course: "PG DBDA", followUpDate: "14-Oct-22", staff: "Ruchita" },
      { id: 3, enquirer: "ZZZZZZ", student: "CCCCCCCC", phone: "9812345680", course: "MSCIT", followUpDate: "14-Oct-22", staff: "Ruchita" },
      { id: 4, enquirer: "PPPPPPPPPPP", student: "QQQQQQQ", phone: "1234567890", course: "JAVA", followUpDate: "13-Oct-22", staff: "Snehal" },
    ];
    setData(mockData);
  }, []);

//   useEffect(() => {
//   fetch('/api/followup') // Replace with your actual API endpoint
//     .then((res) => res.json())
//     .then((data) => setData(data))
//     .catch((err) => console.error(err));
// }, []);                               

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

  const goToBegin = () => setCurrentPage(1);
  const goToEnd = () => setCurrentPage(totalPages);
  const goToNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Follow Up List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-2 border">Enq. ID</th>
              <th className="p-2 border">Enquirer Name</th>
              <th className="p-2 border">Student Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Course</th>
              <th className="p-2 border">Follow-up Date</th>
              <th className="p-2 border">Staff Name</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.enquirer}</td>
                <td className="p-2 border">{item.student}</td>
                <td className="p-2 border">{item.phone}</td>
                <td className="p-2 border">{item.course}</td>
                <td className="p-2 border">{item.followUpDate}</td>
                <td className="p-2 border">{item.staff}</td>
                <td className="p-2 border">
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                    CALL
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end gap-4 mt-4 font-semibold">
        <button
          className={`text-blue-600 hover:underline disabled:text-gray-400`}
          onClick={goToBegin}
          disabled={currentPage === 1}
        >
          Begin
        </button>
        <button
          className={`text-blue-600 hover:underline disabled:text-gray-400`}
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className={`text-blue-600 hover:underline disabled:text-gray-400`}
          onClick={goToPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={`text-blue-600 hover:underline disabled:text-gray-400`}
          onClick={goToEnd}
          disabled={currentPage === totalPages}
        >
          End
        </button>
      </div>
    </div>
  );
};

export default FollowUpTable;
