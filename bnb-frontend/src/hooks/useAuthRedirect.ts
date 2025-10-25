import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = (
  isAuthenticated: boolean,
  authLoading: boolean
) => {
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, authLoading]);
};
