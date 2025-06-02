import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout/Layout";
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Button from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const EditCountryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    flag: "",
  });

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

  useEffect(() => {
    if (id && session) {
      fetchCountry();
    }
  }, [id, session]);

  const fetchCountry = async () => {
    try {
      const response = await fetch(`/api/countries/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data.country);
      } else {
        console.error("Failed to fetch country");
        router.push("/countries");
      }
    } catch (error) {
      console.error("Failed to fetch country:", error);
      router.push("/countries");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/countries");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update country");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Une erreur s'est produite");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

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
              Modifier le Pays
            </h1>
            <p className="text-gray-600">
              Modifiez les informations de {formData.name}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
              Informations du pays
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du pays *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="France, Maroc, Sénégal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code pays
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="FR, MA, SN..."
                  maxLength={3}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji drapeau *
                </label>
                <input
                  type="text"
                  name="flag"
                  value={formData.flag}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🇫🇷, 🇲🇦, 🇸🇳..."
                  maxLength={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Copiez l'emoji du drapeau depuis votre clavier ou un site web
                </p>
              </div>
            </div>

            {/* Preview */}
            {(formData.name || formData.flag) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Aperçu :
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{formData.flag || "🏳️"}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formData.name || "Nom du pays"}
                    </p>
                    {formData.code && (
                      <p className="text-sm text-gray-500">{formData.code}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Submit Button */}
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
                disabled={isSubmitting || !formData.name || !formData.flag}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Mettre à jour
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

export default EditCountryPage;
