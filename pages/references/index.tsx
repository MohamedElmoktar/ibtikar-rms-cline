import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { trpc } from "../../lib/trpc/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  TagIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { cn } from "../../lib/utils";

const References = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    "active" | "completed" | "in_progress" | ""
  >("");
  const [clientId, setClientId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch references with filters
  const { data, isLoading, refetch } = trpc.reference.getAll.useQuery({
    page,
    limit: 12,
    search: search || undefined,
    status: status || undefined,
    clientId: clientId || undefined,
    countryId: countryId || undefined,
  });

  // Fetch filter options
  const { data: clientsData } = trpc.client.getAll.useQuery({ limit: 100 });
  const { data: countriesData } = trpc.country.getAll.useQuery({ limit: 100 });

  const references = data?.references || [];
  const pagination = data?.pagination;
  const clients = clientsData?.clients || [];
  const countries = countriesData?.countries || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setClientId("");
    setCountryId("");
    setPage(1);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "active":
        return <ClockIcon className="h-4 w-4" />;
      case "in_progress":
        return <ChartBarIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "active":
        return "Actif";
      case "in_progress":
        return "En cours";
      default:
        return "Inconnu";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout title="Références">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Références</h1>
            <p className="text-gray-600 mt-1">
              Gérez tous vos projets et références clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Liste
              </button>
            </div>
            <Link href="/references/new">
              <Button size="lg">
                <PlusIcon className="w-5 h-5 mr-2" />
                Nouvelle Référence
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pagination?.total || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      references.filter((r: any) => r.status === "completed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      references.filter(
                        (r: any) =>
                          r.status === "in_progress" || r.status === "active"
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Budget Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      references.reduce(
                        (sum: number, r: any) => sum + (r.budget || 0),
                        0
                      )
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Titre, description, technologies..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="completed">Terminé</option>
                    <option value="in_progress">En cours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les clients</option>
                    {clients.map((client: any) => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les pays</option>
                    {countries.map((country: any) => (
                      <option key={country._id} value={country._id}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">
                  <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
                  Rechercher
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des références...</p>
            </div>
          </div>
        ) : references.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {references.map((reference: any) => (
                  <Card
                    key={reference._id}
                    className="hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {reference.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {reference.description}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ml-3",
                            getStatusColor(reference.status)
                          )}
                        >
                          {getStatusIcon(reference.status)}
                          <span className="ml-1">
                            {getStatusText(reference.status)}
                          </span>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">
                            {reference.client?.name || "Client non spécifié"}
                          </span>
                        </div>

                        {reference.country && (
                          <div className="flex items-center text-sm text-gray-600">
                            <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {reference.country.flag} {reference.country.name}
                            </span>
                          </div>
                        )}

                        {reference.budget && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium text-green-600">
                              {formatCurrency(reference.budget)}
                            </span>
                          </div>
                        )}

                        {reference.startDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{formatDate(reference.startDate)}</span>
                          </div>
                        )}

                        {reference.teamSize && (
                          <div className="flex items-center text-sm text-gray-600">
                            <UsersIcon className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{reference.teamSize} membres</span>
                          </div>
                        )}

                        {reference.technologies &&
                          reference.technologies.length > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <div className="flex flex-wrap gap-1">
                                {reference.technologies
                                  .slice(0, 3)
                                  .map((tech: any) => (
                                    <span
                                      key={tech._id}
                                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                    >
                                      {tech.name}
                                    </span>
                                  ))}
                                {reference.technologies.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                    +{reference.technologies.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <Link href={`/references/${reference._id}`}>
                            <Button size="sm" variant="outline">
                              <EyeIcon className="w-4 h-4 mr-1" />
                              Voir
                            </Button>
                          </Link>
                          <Link href={`/references/${reference._id}/edit`}>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                          </Link>
                        </div>
                        {reference.clientSatisfaction && (
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-1">
                              Satisfaction:
                            </span>
                            <span className="text-sm font-medium text-yellow-600">
                              {reference.clientSatisfaction}/10
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Référence
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {references.map((reference: any) => (
                          <tr key={reference._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {reference.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {reference.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {reference.client?.name || "Non spécifié"}
                                </div>
                                <div className="text-gray-500">
                                  {reference.country?.flag}{" "}
                                  {reference.country?.name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                  getStatusColor(reference.status)
                                )}
                              >
                                {getStatusIcon(reference.status)}
                                <span className="ml-1">
                                  {getStatusText(reference.status)}
                                </span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {reference.budget
                                ? formatCurrency(reference.budget)
                                : "Non spécifié"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {reference.startDate
                                ? formatDate(reference.startDate)
                                : "Non spécifié"}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Link href={`/references/${reference._id}`}>
                                  <Button size="sm" variant="outline">
                                    <EyeIcon className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/references/${reference._id}/edit`}
                                >
                                  <Button size="sm" variant="outline">
                                    <PencilIcon className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <Card>
                <CardContent className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Affichage de{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      à{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      sur{" "}
                      <span className="font-medium">{pagination.total}</span>{" "}
                      résultat(s)
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                      >
                        Précédent
                      </Button>
                      {Array.from(
                        { length: Math.min(pagination.pages, 5) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === page ? "primary" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= pagination.pages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucune référence trouvée
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Aucune référence ne correspond à vos critères de recherche.
                  Essayez de modifier vos filtres ou créez une nouvelle
                  référence.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={clearFilters}>
                    Effacer les filtres
                  </Button>
                  <Link href="/references/new">
                    <Button>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Nouvelle Référence
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default References;
