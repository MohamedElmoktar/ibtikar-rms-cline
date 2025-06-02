import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../lib/utils";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const ReferencesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [references, setReferences] = useState([]);
  const [clients, setClients] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    if (session) {
      fetchReferences();
      fetchFilterData();
    }
  }, [
    session,
    currentPage,
    searchQuery,
    selectedClient,
    selectedTechnology,
    selectedCountry,
    selectedStatus,
  ]);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
      });

      if (selectedClient) params.append("client", selectedClient);
      if (selectedTechnology) params.append("technology", selectedTechnology);
      if (selectedCountry) params.append("country", selectedCountry);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/references?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReferences(data.references || []);
        setPagination(data.pagination || { total: 0, pages: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch references:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      // Fetch clients
      const clientsResponse = await fetch("/api/clients");
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData.clients || []);
      }

      // Fetch technologies
      const techResponse = await fetch("/api/technologies");
      if (techResponse.ok) {
        const techData = await techResponse.json();
        setTechnologies(techData.technologies || []);
      }

      // Fetch countries
      const countriesResponse = await fetch("/api/countries");
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json();
        setCountries(countriesData.countries || []);
      }
    } catch (error) {
      console.error("Failed to fetch filter data:", error);
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

  const statuses = ["Actif", "Terminé", "En pause", "Annulé"];

  const handleCreateReference = () => {
    router.push("/references/new");
  };

  const handleViewReference = (id: string) => {
    router.push(`/references/${id}`);
  };

  const handleEditReference = (id: string) => {
    router.push(`/references/${id}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Terminé":
        return "bg-blue-100 text-blue-800";
      case "En pause":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Actif":
        return CheckCircleIcon;
      case "Terminé":
        return CheckCircleIcon;
      case "En pause":
        return ClockIcon;
      case "Annulé":
        return XCircleIcon;
      default:
        return ClockIcon;
    }
  };

  const ReferenceCard = ({ reference }: { reference: any }) => {
    const StatusIcon = getStatusIcon(reference.status);

    return (
      <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {reference.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    reference.status
                  )}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {reference.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleViewReference(reference._id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Voir"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEditReference(reference._id)}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Modifier"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {reference.client && (
            <div className="flex items-center text-sm text-gray-600">
              <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>Client: {reference.client.name}</span>
            </div>
          )}

          {reference.technologies && reference.technologies.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <CpuChipIcon className="h-4 w-4 mr-2 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {reference.technologies.slice(0, 3).map((tech: any) => (
                  <span
                    key={tech._id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tech.name}
                  </span>
                ))}
                {reference.technologies.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{reference.technologies.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          )}

          {reference.country && (
            <div className="flex items-center text-sm text-gray-600">
              <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {reference.country.flag} {reference.country.name}
              </span>
            </div>
          )}

          {(reference.startDate || reference.endDate) && (
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>
                {reference.startDate &&
                  new Date(reference.startDate).toLocaleDateString("fr-FR")}
                {reference.startDate && reference.endDate && " - "}
                {reference.endDate &&
                  new Date(reference.endDate).toLocaleDateString("fr-FR")}
              </span>
            </div>
          )}
        </div>

        {reference.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {reference.description}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Créé le {new Date(reference.createdAt).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </Card>
    );
  };

  const ReferenceListItem = ({ reference }: { reference: any }) => {
    const StatusIcon = getStatusIcon(reference.status);

    return (
      <Card className="p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {reference.title}
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    reference.status
                  )}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {reference.status}
                </span>
              </div>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                {reference.client && <span>{reference.client.name}</span>}
                {reference.country && (
                  <span>
                    {reference.country.flag} {reference.country.name}
                  </span>
                )}
                {reference.technologies &&
                  reference.technologies.length > 0 && (
                    <span>{reference.technologies.length} technologies</span>
                  )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewReference(reference._id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEditReference(reference._id)}
              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Références
            </h1>
            <p className="text-gray-600">
              Gérez votre portfolio de projets et réalisations
            </p>
          </div>
          <Button onClick={handleCreateReference} className="flex items-center">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvelle Référence
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des références..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Client Filter */}
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les clients</option>
                {clients.map((client: any) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <ViewColumnsIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Références
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pagination.total || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    references.filter((ref: any) => ref.status === "Actif")
                      .length
                  }
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CpuChipIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Technologies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {technologies.length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* References Grid/List */}
        {!loading && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {references.map((reference: any) =>
              viewMode === "grid" ? (
                <ReferenceCard key={reference._id} reference={reference} />
              ) : (
                <ReferenceListItem key={reference._id} reference={reference} />
              )
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && references.length === 0 && (
          <Card className="p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune référence trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre première référence.
            </p>
            <Button onClick={handleCreateReference}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Créer une référence
            </Button>
          </Card>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, pagination.total || 0)} sur{" "}
              {pagination.total || 0} références
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700">
                {currentPage} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReferencesPage;
