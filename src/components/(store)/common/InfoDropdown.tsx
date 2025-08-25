'use client';

import { useState } from 'react';

interface InfoDropdownProps {
  title: string; // The title for the dropdown (e.g., "Size", "Care", "")
  info: string; // The product info to display within the dropdown
}

const InfoDropdown: React.FC<InfoDropdownProps> = ({ title, info }) => {
  // State to control whether the dropdown content is visible or not
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Toggles the visibility of the dropdown content
  const toggleInfo = () => {
    setIsInfoOpen((prev) => !prev);
  };

  return (
    <div
      className="my-4 p-4 bg-white border-b cursor-pointer"
      onClick={toggleInfo} // Toggle dropdown visibility on container click
    >
      <div className="flex items-center justify-between">
        {/* Dropdown Title */}
        <h3 className="uppercase text-sm lg:text-lg font-semibold text-center text-gray-800">
          {title} {/* Display the dynamic title passed via props */}
        </h3>

        {/* Button to show/hide the dropdown */}
        <button
          className="flex items-center justify-center text-xs lg:text-xl font-semibold text-black rounded-full hover:bg-gray-100 transition-all duration-300 p-2"
          aria-hidden="true" // Hide the button's icon from screen readers (for accessibility)
        >
          {/* Show "-" when the dropdown is open, and "+" when it's closed */}
          {isInfoOpen ? (
            <span className="text-xs lg:text-lg">-</span>
          ) : (
            <span className="text-xs lg:text-lg">+</span>
          )}
        </button>
      </div>

      {/* Info content with a smooth transition */}
      <div
        className={`mt-3 overflow-hidden transition-all duration-500 ease-in-out ${
          isInfoOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {/* Display the product info */}
        <p className="text-xs lg:text-sm font-light text-gray-800">{info}</p>
      </div>
    </div>
  );
};

export default InfoDropdown;
