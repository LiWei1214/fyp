import React, {useState, useContext, useEffect, useRef} from 'react';
import DashboardLayout from '../components/DashboardLayout';
import {
  getMaterials,
  getCategories,
  getUserCategories,
  saveUserCategories,
  deleteUserCategory,
} from '../services/apiService';
import {Link} from 'react-router-dom';
import {SearchContext} from '../context/SearchContext';

const OnlineResources = () => {
  const [materials, setMaterials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [newCategoryIds, setNewCategoryIds] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const {searchQuery} = useContext(SearchContext);

  const fetchUserCategoriesAndRefresh = async () => {
    const updatedUserCategories = await getUserCategories();
    setUserCategories(updatedUserCategories);
    setSelectedCategoryIds(updatedUserCategories.map(cat => cat.id));
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [allCategories, selectedCategories] = await Promise.all([
          getCategories(),
          getUserCategories(),
        ]);
        setCategories(allCategories);
        setUserCategories(selectedCategories);
        setSelectedCategoryIds(selectedCategories.map(cat => cat.id));
        setLoading(false);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories.');
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchFilteredMaterials = async () => {
      try {
        setLoading(true);
        const data = await getMaterials(selectedCategoryIds);
        setMaterials(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching materials:', err);
        setError('Failed to load learning materials.');
        setLoading(false);
      }
    };
    fetchFilteredMaterials();
  }, [selectedCategoryIds]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategorySave = async () => {
    try {
      await saveUserCategories(newCategoryIds);
      await fetchUserCategoriesAndRefresh();
      setNewCategoryIds([]);
      setDropdownOpen(false);
    } catch (err) {
      console.error('Error saving user categories:', err);
      setError('Failed to save categories.');
    }
  };

  const handleCategoryFilterClick = id => {
    if (id === 'all') {
      if (selectedCategoryIds.length === userCategories.length) {
        setSelectedCategoryIds([]);
      } else {
        const allIds = userCategories.map(cat => cat.id);
        setSelectedCategoryIds(allIds);
      }
    } else {
      setSelectedCategoryIds(prev =>
        prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id],
      );
    }
  };

  const handleCategoryRemove = async id => {
    try {
      await deleteUserCategory(id);
      await fetchUserCategoriesAndRefresh();
    } catch (err) {
      console.error('Error removing category from DB:', err);
      setError('Failed to remove category.');
    }
  };

  const isSelected = id => newCategoryIds.includes(id);

  const filteredMaterials = materials.filter(material =>
    `${material.title} ${material.description || ''}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-[#1C1C1E] dark:text-white">
            Online Resources
          </h2>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className="p-2 rounded-xl bg-[#ECEFF1] hover:bg-[#E0E0E0] dark:bg-gray-700 dark:hover:bg-gray-600 border border-[#E0E0E0] dark:border-gray-600">
              + Categories
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FAFAFA] dark:bg-gray-800 border border-[#E0E0E0] dark:border-gray-600 rounded-xl shadow-xl z-10">
                <div className="max-h-64 overflow-y-auto p-4 space-y-2">
                  {categories
                    .filter(cat => !userCategories.find(uc => uc.id === cat.id))
                    .map(cat => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-sm text-[#4A4A4A] dark:text-white">
                        <input
                          type="checkbox"
                          checked={isSelected(cat.id)}
                          onChange={() =>
                            setNewCategoryIds(prev =>
                              isSelected(cat.id)
                                ? prev.filter(id => id !== cat.id)
                                : [...prev, cat.id],
                            )
                          }
                        />
                        {cat.name}
                      </label>
                    ))}
                </div>
                {newCategoryIds.length > 0 && (
                  <div className="p-4 border-t border-[#E0E0E0] dark:border-gray-600">
                    <button
                      onClick={handleCategorySave}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold">
                      Save Selected
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilterClick('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
              selectedCategoryIds.length === userCategories.length
                ? 'bg-blue-600 text-white'
                : 'bg-[#FAFAFA] dark:bg-gray-700 border-[#E0E0E0] text-[#1C1C1E] dark:text-white hover:bg-[#ECEFF1]'
            }`}>
            All
          </button>

          {userCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryFilterClick(cat.id)}
              onDoubleClick={() => handleCategoryRemove(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
                selectedCategoryIds.includes(cat.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#FAFAFA] dark:bg-gray-700 border-[#E0E0E0] text-[#1C1C1E] dark:text-white hover:bg-[#ECEFF1]'
              }`}
              title="Double click to remove">
              {cat.name}
            </button>
          ))}
        </div>

        {/* Materials Display */}
        {loading ? (
          <p className="text-[#4A4A4A] dark:text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(material => (
              <div
                key={material.id}
                className="bg-[#FAFAFA] dark:bg-gray-800 border border-[#E0E0E0] dark:border-gray-700 rounded-2xl p-5 shadow hover:shadow-lg transition-all">
                <h3 className="text-xl font-semibold text-[#1C1C1E] dark:text-white mb-2">
                  {material.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] dark:text-gray-400 mb-2">
                  {material.description || 'No description.'}
                </p>
                <p className="text-xs text-[#6E6E6E] dark:text-gray-400 mb-4">
                  Category: {material.category_name || 'N/A'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {material.file_path && (
                    <a
                      href={`http://localhost:5000${material.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      View
                    </a>
                  )}
                  {material.isQuizEnabled ? (
                    <Link
                      to={`/student/quiz/${material.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                      Take Quiz
                    </Link>
                  ) : (
                    <span className="text-xs text-[#888888]italic">
                      No Quiz Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#4A4A4A]  dark:text-gray-400">
            No learning materials available.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OnlineResources;
