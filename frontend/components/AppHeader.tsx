"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header
      className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between"
      style={{ minHeight: "52px" }}
    >
      <div className="flex items-center gap-2.5">
        <span className="text-lg font-bold tracking-tight" style={{ color: "#032147" }}>
          Prelegal
        </span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white uppercase tracking-wide"
          style={{ backgroundColor: "#ecad0a" }}
        >
          Bêta
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{ color: "#888888" }}>
            {user.email}
          </span>
          <button
            onClick={logout}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "#209dd7" }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
