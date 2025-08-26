import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, title = "Dashboard", showSearch = false, searchValue, onSearchChange }) => {
  return (
    <header className="bg-white border-b border-slate-200 card-shadow">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">
                {title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="hidden sm:block">
                <SearchBar
                  value={searchValue}
                  onChange={onSearchChange}
                  placeholder="Search employees..."
                  className="w-64"
                />
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ApperIcon name="Bell" size={18} />
              </Button>
              
              <Button variant="ghost" size="sm">
                <ApperIcon name="Settings" size={18} />
              </Button>
            </div>
          </div>
        </div>
        
        {showSearch && (
          <div className="sm:hidden pb-4">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search employees..."
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;