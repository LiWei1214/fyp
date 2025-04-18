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
  const [editingList, setEditingList] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleAddList = () => {
    if (newListName.trim()) {
      //   onAddList(newListName);
      //   setNewListName('');
      // }
      onAddList(newListName.trim()); // Pass the trimmed value
      setNewListName(''); // Clear the input
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
    // ... other props
  />;

  const handleRename = oldName => {
    const newName = prompt('Rename list to:', oldName);
    if (newName && newName.trim()) {
      onRenameList(oldName, newName.trim());
    }
    setShowOptions(null);
  };

  return (
    <div className="w-64 p-4 border-r bg-white h-full flex flex-col">
      <div className="font-semibold text-2x1 mb-2">Private</div>
      <ul className="space-y-1">
        {lists.map(list => (
          <li key={list}>
            <button
              onClick={() => onSelectList(list)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                selectedList === list
                  ? 'bg-[#31473A] text-white'
                  : 'hover:bg-gray-100'
              }`}>
              <span className="text-left flex-1">{list}</span>
              <span
                onClick={e => {
                  e.stopPropagation(); // prevent list selection
                  setShowOptions(showOptions === list ? null : list);
                }}
                className="p-1 hover:bg-black/10 rounded">
                <HiOutlineDotsVertical size={16} />
              </span>
            </button>

            {/* Options menu */}
            {showOptions === list && (
              <div className="relative">
                <div className="absolute right-3 top-full mt-1 w-28 bg-white shadow-lg rounded border z-10">
                  <button
                    onClick={() => {
                      handleRename(list);
                    }}
                    className="flex items-center px-3 py-2 w-full text-sm hover:bg-gray-100">
                    <FaRegTrashAlt size={14} className="mr-2" /> Rename
                  </button>
                  <button
                    onClick={() => {
                      onDeleteList(list);
                      setShowOptions(null);
                    }}
                    className="flex items-center px-3 py-2 w-full text-sm hover:bg-gray-100 text-red-600">
                    <MdOutlineModeEdit size={14} className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-4 border-t">
        <div
          className={`flex items-center border rounded-lg transition-all duration-200 ${
            isInputFocused
              ? 'border-[#31473A] ring-1 ring-[#31473A]'
              : 'border-gray-300'
          }`}>
          <input
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={e => setNewListName(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none rounded-l-lg"
          />
          <button
            onClick={handleAddList}
            disabled={!newListName.trim()}
            className={`px-3 py-2 text-sm rounded-r-lg transition-colors ${
              newListName.trim()
                ? 'bg-[#31473A] text-white hover:bg-[#26382e]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
            <FiPlus size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-1">
          Press Enter or click + to create
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
