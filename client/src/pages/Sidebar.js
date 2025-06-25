import React, {useState} from 'react';
import {HiOutlineDotsVertical} from 'react-icons/hi';
import {FaRegTrashAlt} from 'react-icons/fa';
import {MdOutlineModeEdit} from 'react-icons/md';
import {FiPlus} from 'react-icons/fi';

const Sidebar = ({
  lists,
  selectedList,
  onSelectList,
  onAddList,
  onRenameList,
  onDeleteList,
}) => {
  const [newListName, setNewListName] = useState('');
  const [showOptions, setShowOptions] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim());
      setNewListName('');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleAddList();
    }
  };

  <input
    type="text"
    placeholder="New list name"
    value={newListName}
    onChange={e => setNewListName(e.target.value)}
    onKeyDown={handleKeyDown}
  />;

  const handleRename = oldName => {
    const newName = prompt('Rename list to:', oldName);
    if (newName && newName.trim()) {
      onRenameList(oldName, newName.trim());
    }
    setShowOptions(null);
  };

  return (
    <div className="w-64 p-6 border-r bg-[#f9fafb] dark:bg-[#1c1c1c] dark:border-gray-700 h-full flex flex-col rounded-xl shadow-inner">
      <div className="text-2xl font-bold text-[#31473A] dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 tracking-wide">
        Your Lists
      </div>
      <ul className="space-y-1">
        {lists.map(list => (
          <li key={list.id}>
            {' '}
            <button
              onClick={() => onSelectList(list.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                selectedList === list.id
                  ? 'bg-[#31473A] text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}>
              <span className="text-left flex-1">{list.name}</span>{' '}
              {/* Display list.name */}
              <span
                onClick={e => {
                  e.stopPropagation();
                  setShowOptions(showOptions === list.name ? null : list.name);
                }}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded">
                <HiOutlineDotsVertical size={16} />
              </span>
            </button>
            {/* Options menu */}
            {showOptions === list.name && (
              <div className="relative">
                <div className="absolute right-3 top-full mt-1 w-28 bg-white dark:bg-[#2a2a2a] shadow-lg rounded border border-gray-200 dark:border-gray-600 z-10">
                  <button
                    onClick={() => {
                      handleRename(list.name);
                    }}
                    className="flex items-center px-3 py-2 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <FaRegTrashAlt size={14} className="mr-2" /> Rename
                  </button>
                  <button
                    onClick={() => {
                      onDeleteList(list.name);
                      setShowOptions(null);
                    }}
                    className="flex items-center px-3 py-2 w-full text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <MdOutlineModeEdit size={14} className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={`flex items-center h-10 border rounded-lg transition-all duration-200 ${
            isInputFocused
              ? 'border-[#31473A] ring-1 ring-[#31473A]'
              : 'border-gray-300 dark:border-gray-600'
          }`}>
          <input
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className="flex-1 px-3 text-sm bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none h-full rounded-l-lg"
          />
          <button
            onClick={handleAddList}
            disabled={!newListName.trim()}
            className={`w-10 h-full rounded-r-lg flex items-center justify-center transition-colors ${
              newListName.trim()
                ? 'bg-[#31473A] text-white hover:bg-[#26382e]'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}>
            <FiPlus size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
          Press Enter or click + to create
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
