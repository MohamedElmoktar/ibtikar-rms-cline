import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Button from "../../components/ui/Button";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">IBTIKAR</h1>
                <p className="text-blue-100 text-sm">
                  Reference Management System
                </p>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Gérez vos références
                <br />
                <span className="text-blue-200">en toute simplicité</span>
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Organisez, suivez et gérez efficacement toutes vos références
                clients, technologies et projets dans une plateforme centralisée
                et moderne.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Gestion centralisée des références</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Interface moderne et intuitive</span>
              </div>
              <div className="flex items-center space-x-3 text-blue-100">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span>Rapports et analytics détaillés</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IBTIKAR</h1>
                <p className="text-gray-500 text-xs">RMS</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
            <p className="mt-2 text-sm text-gray-600">
              Accédez à votre espace de gestion des références
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="text-sm text-red-600">{error}</div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="w-full py-3 text-base font-medium"
                  size="lg"
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">
                    Besoin d'aide ?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Contactez l'administrateur pour obtenir un accès ou en cas de
                  problème de connexion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default SignIn;
