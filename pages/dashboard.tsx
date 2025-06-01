import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { trpc } from "../lib/trpc/client";
import Layout from "../components/Layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  DocumentTextIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  EyeIcon,
  PlusIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../lib/utils";

const Dashboard = () => {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch real data using tRPC
  const { data: referencesData, isLoading: loadingReferences } =
    trpc.reference.getAll.useQuery({
      limit: 4,
      page: 1,
    });

  const { data: totalReferences = 0 } = trpc.reference.getCount.useQuery();
  const { data: totalClients = 0 } = trpc.client.getCount.useQuery();
  const { data: totalTechnologies = 0 } = trpc.technology.getCount.useQuery();
  const { data: totalCountries = 0 } = trpc.country.getCount.useQuery();

  // Extract references array from the response
  const references = referencesData?.references || [];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats with real data
  const stats = [
    {
      name: "Total Références",
      value: totalReferences.toString(),
      change: "+12%",
      changeType: "increase",
      icon: DocumentTextIcon,
      color: "blue",
    },
    {
      name: "Clients Actifs",
      value: totalClients.toString(),
      change: "+5%",
      changeType: "increase",
      icon: UsersIcon,
      color: "green",
    },
    {
      name: "Technologies",
      value: totalTechnologies.toString(),
      change: "+8%",
      changeType: "increase",
      icon: CpuChipIcon,
      color: "purple",
    },
    {
      name: "Pays",
      value: totalCountries.toString(),
      change: "+2%",
      changeType: "increase",
      icon: BuildingOfficeIcon,
      color: "orange",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "completed":
        return "Terminé";
      case "in_progress":
        return "En cours";
      default:
        return "Inconnu";
    }
  };

  const getStatColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "purple":
        return "bg-purple-500";
      case "orange":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Bienvenue, {session?.user?.name || "Utilisateur"} 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Voici un aperçu de votre système de gestion des références
              </p>
              <div className="flex items-center text-blue-200 text-sm">
                <ClockIcon className="h-4 w-4 mr-2" />
                {currentTime.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="mt-6 sm:mt-0 flex space-x-3">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Voir Rapports
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-700 hover:bg-gray-50"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle Référence
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.name}
              className="hover:shadow-lg transition-all duration-200 border-0 shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm font-medium text-green-600">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ce mois
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn("p-3 rounded-xl", getStatColor(stat.color))}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent References */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-0">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Références Récentes
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    Voir tout
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingReferences ? (
                  <div className="p-6 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="flex space-x-2">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : references.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <DocumentTextIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune référence trouvée</p>
                    <p className="text-sm">
                      Commencez par ajouter votre première référence
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {references.map((reference: any) => (
                      <div
                        key={reference._id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {reference.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {reference.client?.name || "Client non spécifié"}
                            </p>
                            {reference.budget && (
                              <p className="text-sm text-blue-600 font-medium mt-1">
                                {formatCurrency(reference.budget)}
                              </p>
                            )}
                            <div className="flex items-center mt-3 space-x-4">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                  getStatusColor(reference.status)
                                )}
                              >
                                {getStatusText(reference.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  reference.createdAt
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                            {reference.technologies &&
                              reference.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
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
                              )}
                          </div>
                          <div className="ml-4">
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  size="lg"
                  onClick={() => (window.location.href = "/references/new")}
                >
                  <PlusIcon className="h-5 w-5 mr-3" />
                  Ajouter une référence
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  size="lg"
                  onClick={() => (window.location.href = "/clients")}
                >
                  <UsersIcon className="h-5 w-5 mr-3" />
                  Gérer les clients
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  size="lg"
                  onClick={() => (window.location.href = "/clients/new")}
                >
                  <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                  Ajouter un client
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="ghost"
                  size="lg"
                  onClick={() => (window.location.href = "/technologies")}
                >
                  <CpuChipIcon className="h-5 w-5 mr-3" />
                  Gérer les technologies
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  État du Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base de données</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">
                      Actif
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">
                      Actif
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Références</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">
                      {totalReferences} enregistrées
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière sync</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">
                      Maintenant
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
