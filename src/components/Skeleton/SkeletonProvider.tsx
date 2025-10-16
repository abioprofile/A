import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Skeleton from "./Skeleton";

interface SkeletonContextValue {
  loading: boolean;
  show: () => void;
  hide: () => void;
  setLoading: (v: boolean) => void;
}

const SkeletonContext = createContext<SkeletonContextValue | undefined>(undefined);

export const SkeletonProvider: React.FC<{ children: ReactNode; overlay?: boolean }> = ({ children, overlay = true }) => {
  const [loading, setLoading] = useState(false);

  const show = useCallback(() => setLoading(true), []);
  const hide = useCallback(() => setLoading(false), []);
  const setLoadingCb = useCallback((v: boolean) => setLoading(v), []);

  return (
    <SkeletonContext.Provider value={{ loading, show, hide, setLoading: setLoadingCb }}>
      {children}
      {overlay && loading && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-6"
          style={{ background: "rgba(0,0,0,0.04)", backdropFilter: "blur(2px)" }}
        >
          <div className="max-w-5xl w-full">
            {/* example overlay skeleton composition */}
            <div className="bg-white rounded-lg p-6 space-y-4 shadow">
              <div className="flex items-center justify-between">
                <Skeleton variant="rect" width={140} height={18} />
                <Skeleton variant="rect" width={60} height={18} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>

              <div className="mt-4">
                <Skeleton variant="table-row" count={3} />
              </div>
            </div>
          </div>
        </div>
      )}
    </SkeletonContext.Provider>
  );
};

export const useSkeletonContext = () => {
  const ctx = useContext(SkeletonContext);
  if (!ctx) throw new Error("useSkeletonContext must be used inside SkeletonProvider");
  return ctx;
};
