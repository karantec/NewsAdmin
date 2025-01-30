import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing the icons

const NewsTable = ({ newsEntries, onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto mt-8">
      <div className="card p-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Posted Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Display dummy news entries */}
            {newsEntries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500">
                  No news entries available.
                </td>
              </tr>
            ) : (
              newsEntries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.title || "Dummy Title"}</td>
                  <td>{entry.category || "Dummy Category"}</td>
                  <td>{entry.postedTime || "2025-01-01T12:00"}</td>
                  <td className="flex space-x-2 justify-center">
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsTable;
