import React from "react";

const Loading = ({ type = "page" }) => {
  if (type === "card") {
    return (
      <div className="bg-white rounded-lg p-6 card-shadow animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full animate-shimmer"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded animate-shimmer mb-2"></div>
            <div className="h-3 bg-slate-200 rounded animate-shimmer w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-white rounded-lg p-6 card-shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded animate-shimmer mb-4 w-1/4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-shimmer"></div>
                <div className="h-3 bg-slate-200 rounded animate-shimmer w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 animate-pulse mb-4">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-shimmer w-32 mx-auto"></div>
          <div className="h-3 bg-slate-200 rounded animate-shimmer w-24 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;