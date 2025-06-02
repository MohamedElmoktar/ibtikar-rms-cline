import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout/Layout";
import {
  PlusIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const CountriesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session) {
      fetchCountries();
    }
  }, [session]);

  const fetchCountries = async () => {
    try {
      const response = await fetch("/api/countries");
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce pays ?")) {
      try {
        const response = await fetch(`/api/countries/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchCountries();
        }
      } catch (error) {
        console.error("Failed to delete country:", error);
      }
    }
  };

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  // Filter countries
  const filteredCountries = countries.filter(
    (country: any) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pays</h1>
            <p className="text-gray-600">
              Gérez les pays pour les projets IBTIKAR
            </p>
          </div>
          <Button
            onClick={() => router.push("/countries/new")}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau pays
          </Button>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des pays..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pays</p>
                <p className="text-2xl font-bold text-gray-900">
                  {countries.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">🇲🇷</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mauritanie</p>
                <p className="text-2xl font-bold text-gray-900">Base</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  International
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {countries.length - 1}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Countries Grid */}
        {filteredCountries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCountries.map((country: any) => (
              <Card
                key={country._id}
                className="p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {country.name}
                      </h3>
                      {country.code && (
                        <p className="text-sm text-gray-500">{country.code}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() =>
                        router.push(`/countries/${country._id}/edit`)
                      }
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(country._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Ajouté le{" "}
                  {new Date(country.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun pays trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Aucun pays ne correspond à votre recherche."
                : "Commencez par ajouter un nouveau pays."}
            </p>
            <Button
              onClick={() => router.push("/countries/new")}
              className="flex items-center mx-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un pays
            </Button>
          </Card>
        )}

        {/* IBTIKAR Branding */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-lg">IB</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">
              IBTIKAR Technologies
            </h3>
            <p className="text-xs text-gray-600">
              🇲🇷 Présence internationale depuis la Mauritanie
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "countries"])),
    },
  };
}

export default CountriesPage;
