import React, {useState, useContext, useEffect} from 'react';
import LecturerDashboardLayout from '../components/LecturerDashboardLayout';
import {getUploadedMaterials, deleteMaterial} from '../services/apiService';
import {Link} from 'react-router-dom';
import {SearchContext} from '../context/SearchContext';

const LecturerDashboard = () => {
  const [uploadedMaterials, setUploadedMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {searchQuery} = useContext(SearchContext);

  const fetchMaterials = async () => {
    try {
      const materials = await getUploadedMaterials();
      setUploadedMaterials(materials);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load uploaded materials.');
      setLoading(false);
      console.error('Error fetching uploaded materials:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async materialId => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const response = await deleteMaterial(materialId);
        console.log(response.message);
        fetchMaterials();
      } catch (err) {
        console.error('Error deleting material:', err);
        alert('Failed to delete material.');
      }
    }
  };

  const filteredMaterials = uploadedMaterials.filter(material =>
    `${material.title} ${material.description || ''} ${
      material.category_name || ''
    }`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <LecturerDashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-2">
          Lecturer Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          View and manage your uploaded learning materials.
        </p>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading materials...
          </p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredMaterials.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Uploaded</th>
                    <th className="px-6 py-4 font-medium">File</th>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map(material => (
                    <tr
                      key={material.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                      <td className="px-6 py-4">{material.title}</td>
                      <td className="px-6 py-4">{material.category_name}</td>
                      <td className="px-6 py-4">
                        {new Date(material.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`http://localhost:5000${material.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline">
                          View File
                        </a>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {material.description || '—'}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Link
                          to={`/lecturer-dashboard/edit-material/${material.id}`}
                          className="inline-block px-4 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="inline-block px-4 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-full transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-6">
            You haven't uploaded any materials yet.
          </p>
        )}
      </div>
    </LecturerDashboardLayout>
  );
};

export default LecturerDashboard;
