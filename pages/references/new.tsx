import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  CalendarIcon,
  LinkIcon,
  PaperClipIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import FileUpload from "../../components/ui/FileUpload";

const NewReferencePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [clients, setClients] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    technologies: [] as string[],
    country: "",
    status: "Actif",
    startDate: "",
    endDate: "",
    projectUrl: "",
    githubUrl: "",
    features: [""],
    challenges: "",
    results: "",
    testimonial: {
      content: "",
      author: "",
      position: "",
    },
  });

  useEffect(() => {
    if (session) {
      fetchFormData();
    }
  }, [session]);

  const fetchFormData = async () => {
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
      console.error("Failed to fetch form data:", error);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("testimonial.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        testimonial: {
          ...prev.testimonial,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTechnologyChange = (techId: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter((id) => id !== techId)
        : [...prev.technologies, techId],
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleFilesChange = (newFiles: any[]) => {
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const referenceData = {
        ...formData,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        files: uploadedFiles.map((file) => ({
          originalName: file.originalName,
          fileName: file.fileName,
          filePath: file.filePath,
          size: file.size,
          mimetype: file.mimetype,
        })),
      };

      const response = await fetch("/api/references", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(referenceData),
      });

      if (response.ok) {
        router.push("/references");
      } else {
        console.error("Failed to create reference");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
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
              Nouvelle Référence
            </h1>
            <p className="text-gray-600">
              Ajoutez un nouveau projet à votre portfolio IBTIKAR
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du projet *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom du projet"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée du projet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un client</option>
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
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map((country: any) => (
                    <option key={country._id} value={country._id}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Technologies */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CpuChipIcon className="h-5 w-5 mr-2 text-purple-600" />
              Technologies utilisées
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {technologies.map((tech: any) => (
                <label
                  key={tech._id}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.technologies.includes(tech._id)}
                    onChange={() => handleTechnologyChange(tech._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {tech.name}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
              Chronologie du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Links */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Liens du projet
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du projet
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://projet.example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repository GitHub
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
          </Card>

          {/* File Upload */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <PaperClipIcon className="h-5 w-5 mr-2 text-orange-600" />
              Fichiers et documents
            </h2>

            <FileUpload
              onFilesChange={handleFilesChange}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
              isUploading={isUploading}
              maxFileSize={10}
              acceptedTypes={[
                ".pdf",
                ".doc",
                ".docx",
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".zip",
                ".rar",
              ]}
              multiple={true}
            />
          </Card>

          {/* Features */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CheckIcon className="h-5 w-5 mr-2 text-green-600" />
              Fonctionnalités clés
            </h2>

            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Fonctionnalité ${index + 1}`}
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFeature}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Ajouter une fonctionnalité
              </Button>
            </div>
          </Card>

          {/* Additional Details */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-600" />
              Détails supplémentaires
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Défis rencontrés
                </label>
                <textarea
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez les principaux défis et comment ils ont été surmontés..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résultats obtenus
                </label>
                <textarea
                  name="results"
                  value={formData.results}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez les résultats et l'impact du projet..."
                />
              </div>
            </div>
          </Card>

          {/* Testimonial */}
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-yellow-600" />
              Témoignage client (optionnel)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenu du témoignage
                </label>
                <textarea
                  name="testimonial.content"
                  value={formData.testimonial.content}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Le témoignage du client..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    name="testimonial.author"
                    value={formData.testimonial.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la personne"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poste
                  </label>
                  <input
                    type="text"
                    name="testimonial.position"
                    value={formData.testimonial.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Poste dans l'entreprise"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <Card className="p-6">
            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.client}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Création...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Créer la référence
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default NewReferencePage;
