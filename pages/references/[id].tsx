import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CalendarIcon,
  LinkIcon,
  PaperClipIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  UserGroupIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const ViewReferencePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [reference, setReference] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && id) {
      fetchReference();
    }
  }, [session, id]);

  const fetchReference = async () => {
    try {
      const response = await fetch(`/api/references/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReference(data.reference);
      } else {
        console.error("Failed to fetch reference");
      }
    } catch (error) {
      console.error("Fetch error:", error);
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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!reference) {
    return (
      <Layout>
        <div className="text-center py-12">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Référence non trouvée
          </h3>
          <p className="text-gray-600 mb-6">
            Cette référence n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => router.push("/references")}>
            Retour aux références
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800 border-green-200";
      case "Terminé":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "En pause":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Annulé":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const StatusIcon = getStatusIcon(reference.status);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {reference.title}
              </h1>
              <p className="text-gray-600">
                Projet pour {reference.client?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/references/${id}/edit`)}
              className="flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button variant="outline" className="flex items-center">
              <ShareIcon className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card className={`p-4 border-l-4 ${getStatusColor(reference.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Statut: {reference.status}</h3>
                <p className="text-sm opacity-75">
                  Dernière mise à jour:{" "}
                  {new Date(reference.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
            {(reference.startDate || reference.endDate) && (
              <div className="text-right">
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    {reference.startDate &&
                      new Date(reference.startDate).toLocaleDateString("fr-FR")}
                    {reference.startDate && reference.endDate && " - "}
                    {reference.endDate &&
                      new Date(reference.endDate).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Description */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                Description du projet
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {reference.description}
              </p>
            </Card>

            {/* Technologies */}
            {reference.technologies && reference.technologies.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CpuChipIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Technologies utilisées
                </h2>
                <div className="flex flex-wrap gap-2">
                  {reference.technologies.map((tech: any) => (
                    <span
                      key={tech._id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Features */}
            {reference.features && reference.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2 text-green-600" />
                  Fonctionnalités clés
                </h2>
                <ul className="space-y-2">
                  {reference.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Challenges */}
            {reference.challenges && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircleIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Défis rencontrés
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {reference.challenges}
                </p>
              </Card>
            )}

            {/* Results */}
            {reference.results && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <StarIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  Résultats obtenus
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {reference.results}
                </p>
              </Card>
            )}

            {/* Testimonial */}
            {reference.testimonial && reference.testimonial.content && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Témoignage client
                </h2>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-4">
                    "{reference.testimonial.content}"
                  </blockquote>
                  {(reference.testimonial.author ||
                    reference.testimonial.position) && (
                    <footer className="text-right">
                      <div className="text-gray-900 font-semibold">
                        {reference.testimonial.author}
                      </div>
                      {reference.testimonial.position && (
                        <div className="text-gray-600 text-sm">
                          {reference.testimonial.position}
                        </div>
                      )}
                    </footer>
                  )}
                </div>
              </Card>
            )}

            {/* Files */}
            {reference.files && reference.files.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PaperClipIcon className="h-5 w-5 mr-2 text-orange-600" />
                  Fichiers attachés ({reference.files.length})
                </h2>
                <div className="space-y-3">
                  {reference.files.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.originalName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {file.mimetype} •{" "}
                            {new Date(file.uploadDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.filePath, "_blank")}
                        className="flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations du projet
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">
                      {reference.client?.name}
                    </p>
                  </div>
                </div>

                {reference.country && (
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Pays</p>
                      <p className="font-medium text-gray-900">
                        {reference.country.flag} {reference.country.name}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Créé le</p>
                    <p className="font-medium text-gray-900">
                      {new Date(reference.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Project Links */}
            {(reference.projectUrl || reference.githubUrl) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Liens du projet
                </h3>
                <div className="space-y-3">
                  {reference.projectUrl && (
                    <a
                      href={reference.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Voir le projet
                        </p>
                        <p className="text-xs text-blue-600">
                          {reference.projectUrl}
                        </p>
                      </div>
                    </a>
                  )}

                  {reference.githubUrl && (
                    <a
                      href={reference.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <CpuChipIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Code source
                        </p>
                        <p className="text-xs text-gray-600">
                          {reference.githubUrl}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </Card>
            )}

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/references/${id}/edit`)}
                  className="w-full justify-start"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Modifier la référence
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </Card>

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
                  🇲🇷 Excellence mauritanienne
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewReferencePage;
