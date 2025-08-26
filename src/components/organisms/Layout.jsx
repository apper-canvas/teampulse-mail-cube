import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../App";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  return (
<div className="flex h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} authContext={authContext} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet context={{ onMenuClick: handleMenuClick }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;