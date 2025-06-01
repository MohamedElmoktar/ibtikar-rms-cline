import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="loading-spinner"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );
};

export default Home;
