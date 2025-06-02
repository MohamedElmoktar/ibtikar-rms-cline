import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Layout from "../../components/Layout/Layout";
import {
  PlusIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const TechnologiesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (session) {
      fetchTechnologies();
    }
  }, [session]);

  const fetchTechnologies = async () => {
    try {
      const response = await fetch("/api/technologies");
      if (response.ok) {
        const data = await response.json();
        setTechnologies(data.technologies || []);
      }
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette technologie ?")) {
      try {
        const response = await fetch(`/api/technologies/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchTechnologies();
        }
      } catch (error) {
        console.error("Failed to delete technology:", error);
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

  // Get unique categories
  const categories = [
    ...new Set(technologies.map((tech: any) => tech.category)),
  ];

  // Filter technologies
  const filteredTechnologies = technologies.filter((tech: any) => {
    const matchesSearch =
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-800",
      Backend: "bg-green-100 text-green-800",
      Database: "bg-purple-100 text-purple-800",
      Mobile: "bg-pink-100 text-pink-800",
      DevOps: "bg-orange-100 text-orange-800",
      Design: "bg-indigo-100 text-indigo-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Technologies</h1>
            <p className="text-gray-600">
              Gérez les technologies utilisées par IBTIKAR
            </p>
          </div>
          <Button
            onClick={() => router.push("/technologies/new")}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle technologie
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {technologies.length}
                </p>
              </div>
            </div>
          </Card>
          {categories.slice(0, 3).map((category) => (
            <Card key={category} className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CpuChipIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {category}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      technologies.filter(
                        (tech: any) => tech.category === category
                      ).length
                    }
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Technologies Grid */}
        {filteredTechnologies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechnologies.map((tech: any) => (
              <Card
                key={tech._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CpuChipIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tech.name}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                          tech.category
                        )}`}
                      >
                        {tech.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/technologies/${tech._id}/edit`)
                      }
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tech._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {tech.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {tech.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Ajouté le{" "}
                    {new Date(tech.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  {tech.version && (
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      v{tech.version}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CpuChipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune technologie trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory
                ? "Aucune technologie ne correspond à vos critères de recherche."
                : "Commencez par ajouter une nouvelle technologie."}
            </p>
            <Button
              onClick={() => router.push("/technologies/new")}
              className="flex items-center mx-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter une technologie
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
              🇲🇷 Stack technologique de pointe
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
      ...(await serverSideTranslations(locale, ["common", "technologies"])),
    },
  };
}

export default TechnologiesPage;
