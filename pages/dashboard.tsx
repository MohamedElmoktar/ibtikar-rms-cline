import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "../lib/hooks/useTranslation";
import Layout from "../components/Layout/Layout";
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  ChartBarIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");
  const [stats, setStats] = useState({
    references: 0,
    clients: 0,
    technologies: 0,
    countries: 0,
  });
  const [recentReferences, setRecentReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch("/api/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent references
      const referencesResponse = await fetch("/api/references?limit=4");
      if (referencesResponse.ok) {
        const referencesData = await referencesResponse.json();
        setRecentReferences(referencesData.references || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t("welcome")}, {session.user?.firstName}{" "}
                {session.user?.lastName}!
              </h1>
              <p className="text-blue-100 text-lg">{t("overview")}</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-200">
                  {tCommon("time.updatedOn")}
                </p>
                <p className="text-white font-medium">
                  {new Date().toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {session.user?.firstName?.[0]}
                  {session.user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">
                  {tCommon("navigation.references")}
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {loading ? "..." : stats.references}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {t("stats.totalReferences")}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">
                  {tCommon("navigation.clients")}
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {loading ? "..." : stats.clients}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {t("stats.totalClients")}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  {tCommon("navigation.technologies")}
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {loading ? "..." : stats.technologies}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  {t("stats.totalTechnologies")}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <CpuChipIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">
                  {tCommon("navigation.countries")}
                </p>
                <p className="text-3xl font-bold text-orange-900">
                  {loading ? "..." : stats.countries}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {t("stats.totalCountries")}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent References */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {t("stats.recentActivity")}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/references")}
                >
                  {tCommon("actions.view")}
                </Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentReferences.length > 0 ? (
                <div className="space-y-4">
                  {recentReferences.map((reference: any) => (
                    <div
                      key={reference._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/references/${reference._id}`)
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {reference.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {reference.client?.name} •{" "}
                            {new Date(reference.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                      </div>
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{tCommon("messages.noData")}</p>
                  <Button
                    onClick={() => router.push("/references/new")}
                    className="mt-4"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    {tCommon("actions.create")}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t("quickActions.addReference")}
              </h2>
              <div className="space-y-4">
                <Button
                  onClick={() => router.push("/references/new")}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-3" />
                  {t("quickActions.addReference")}
                </Button>
                <Button
                  onClick={() => router.push("/clients/new")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                  {t("quickActions.addClient")}
                </Button>
                <Button
                  onClick={() => router.push("/clients")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ChartBarIcon className="h-5 w-5 mr-3" />
                  {tCommon("actions.view")} {tCommon("navigation.clients")}
                </Button>
                <Button
                  onClick={() => router.push("/settings")}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <CpuChipIcon className="h-5 w-5 mr-3" />
                  {tCommon("navigation.settings")}
                </Button>
              </div>
            </Card>

            {/* IBTIKAR Branding */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">IB</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {tCommon("branding.company")}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  🇲🇷 {tCommon("branding.tagline")}
                </p>
                <div className="text-xs text-gray-500">Version 1.0.0 • RMS</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dashboard"])),
    },
  };
}

export default Dashboard;
