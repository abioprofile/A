import { useMemo } from "react";
import { useSkeletonContext } from "../components/skeleton/SkeletonProvider";

export const useSkeleton = () => {
  const ctx = useSkeletonContext();
  return useMemo(
    () => ({
      loading: ctx.loading,
      show: ctx.show,
      hide: ctx.hide,
      setLoading: ctx.setLoading
    }),
    [ctx]
  );
};
