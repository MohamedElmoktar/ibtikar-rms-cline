import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import {
  PlusIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const ClientsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    if (session) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clients");
      if (response.ok) {
        const data = await response.json();
        console.log("Clients data:", data); // Debug log
        setClients(data.clients || []);
      } else {
        console.error("Failed to fetch clients:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        const response = await fetch(`/api/clients/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchClients(); // Reload clients after deletion
        } else {
          console.error("Failed to delete client");
        }
      } catch (error) {
        console.error("Failed to delete client:", error);
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

  // Get unique industries
  const industries = [
    ...new Set(clients.map((client: any) => client.industry).filter(Boolean)),
  ];

  // Filter clients
  const filteredClients = clients.filter((client: any) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry =
      selectedIndustry === "" || client.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const getIndustryColor = (industry: string) => {
    const colors = {
      Technologie: "bg-blue-100 text-blue-800",
      "E-commerce": "bg-green-100 text-green-800",
      Santé: "bg-red-100 text-red-800",
      Finance: "bg-yellow-100 text-yellow-800",
      Éducation: "bg-purple-100 text-purple-800",
      Immobilier: "bg-indigo-100 text-indigo-800",
      Agriculture: "bg-green-100 text-green-800",
      Transport: "bg-gray-100 text-gray-800",
      Autre: "bg-gray-100 text-gray-800",
    };
    return (
      colors[industry as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600">
              Gérez votre portefeuille clients IBTIKAR
            </p>
          </div>
          <Button
            onClick={() => router.push("/clients/new")}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouveau client
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
                  placeholder="Rechercher des clients..."
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
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Toutes les industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
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
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.length}
                </p>
              </div>
            </div>
          </Card>
          {industries.slice(0, 3).map((industry) => (
            <Card key={industry} className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {industry}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      clients.filter(
                        (client: any) => client.industry === industry
                      ).length
                    }
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Clients List */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client: any) => (
              <Card
                key={client._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {client.name}
                      </h3>
                      {client.company && (
                        <p className="text-sm text-gray-600">
                          {client.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/clients/${client._id}`)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/clients/${client._id}/edit`)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {client.industry && (
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndustryColor(
                        client.industry
                      )}`}
                    >
                      {client.industry}
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Site web
                      </a>
                    </div>
                  )}
                </div>

                {client.description && (
                  <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                    {client.description}
                  </p>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Ajouté le{" "}
                  {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {clients.length === 0 ? "Aucun client" : "Aucun client trouvé"}
            </h3>
            <p className="text-gray-600 mb-6">
              {clients.length === 0
                ? "Commencez par ajouter votre premier client."
                : searchTerm || selectedIndustry
                ? "Aucun client ne correspond à vos critères de recherche."
                : "Aucun client disponible."}
            </p>
            <Button
              onClick={() => router.push("/clients/new")}
              className="flex items-center mx-auto"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un client
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
              🇲🇷 Portfolio clients de confiance
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};


export default ClientsPage;
