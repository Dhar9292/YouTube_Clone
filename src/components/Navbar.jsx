import React, { useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce"; 
import Avatar from "react-avatar";
import { AiOutlineMenu, AiOutlineBell } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { IoMdMic } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import logo from "../../public/logo.png";
import profile from "../../public/profile.jpg";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length > 0) navigate(`/search/${query}`);
    }, 500),
    [navigate] // Added dependency
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const searchQueryHandler = (event) => {
    if (
      (event?.key === "Enter" || event === "searchButton") &&
      searchQuery?.length > 0
    ) {
      debouncedSearch.cancel();
      navigate(`/search/${searchQuery}`);
       setSearchQuery("");
      setShowMobileSearch(false); // Close mobile search
    }
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    setSearchQuery(""); // Reset search query when toggling
  };

  return (
    <div className="flex justify-between items-center fixed top-0 w-full bg-white px-4 py-2 md:px-6">
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden absolute top-0 left-0 right-0 bg-white p-2 flex items-center z-50">
          <button 
            onClick={toggleMobileSearch}
            className="mr-2 p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <div className="flex flex-1 items-center">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-400 rounded-l-full outline-none"
              value={searchQuery}
              onChange={handleSearch}
              onKeyUp={(e) => {
                if (e.key === "Enter") searchQueryHandler(e);
              }}
            />
            <button
              className="px-4 py-2 border border-gray-400 bg-gray-100 rounded-r-full"
              onClick={() => searchQueryHandler("searchButton")}
            >
              <CiSearch size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Regular Header Content */}
      {!showMobileSearch && (
        <>
          <div className="flex items-center space-x-2 md:space-x-4">
            <AiOutlineMenu className="text-xl cursor-pointer" />
            <img src={logo} alt="Logo" className="w-20 md:w-28 cursor-pointer" />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 items-center">
            <div className="w-full px-4 py-2 border border-gray-400 rounded-l-full">
              <input
                type="text"
                placeholder="Search"
                className="w-full outline-none"
                onChange={handleSearch}
                onKeyUp={searchQueryHandler}
                value={searchQuery}
              />
            </div>
            <button
              className="px-4 py-2 border border-gray-400 bg-gray-100 rounded-r-full"
              onClick={() => searchQueryHandler("searchButton")}
            >
              <CiSearch size={24} />
            </button>
            <IoMdMic
              size={36}
              className="ml-2 md:ml-3 border border-gray-600 rounded-full p-2 cursor-pointer hover:bg-gray-200 duration-200"
            />
          </div>

          {/* Mobile Icons */}
          <CiSearch 
            size={24} 
            className="md:hidden cursor-pointer mx-2" 
            onClick={toggleMobileSearch} 
          />

          <div className="flex items-center space-x-3 md:space-x-5">
            <RiVideoAddLine className="text-xl md:text-2xl" />
            <AiOutlineBell className="text-xl md:text-2xl" />
            <Avatar 
              src={profile} 
              size={48} 
              round={true}
              className="hidden md:block"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;