const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Try to load dotenv, but don't fail if it's not available
try {
  require("dotenv").config({ path: ".env.local" });
} catch (error) {
  console.log("📝 Note: dotenv not found, using direct environment variables");
}

// Define schemas directly in the seed script to avoid import issues
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 3,
    },
    flag: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const technologySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Database", "Mobile", "DevOps", "Other"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const referenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    technologies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technology",
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "in_progress", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      type: Number,
      min: 0,
    },
    teamSize: {
      type: Number,
      min: 1,
    },
    clientSatisfaction: {
      type: Number,
      min: 0,
      max: 10,
    },
    documents: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create models
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Country =
  mongoose.models.Country || mongoose.model("Country", countrySchema);
const Technology =
  mongoose.models.Technology || mongoose.model("Technology", technologySchema);
const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
const Reference =
  mongoose.models.Reference || mongoose.model("Reference", referenceSchema);

// Sample data
const countriesData = [
  { name: "Maroc", code: "MA", flag: "🇲🇦" },
  { name: "France", code: "FR", flag: "🇫🇷" },
  { name: "Espagne", code: "ES", flag: "🇪🇸" },
  { name: "Allemagne", code: "DE", flag: "🇩🇪" },
  { name: "Italie", code: "IT", flag: "🇮🇹" },
  { name: "Royaume-Uni", code: "GB", flag: "🇬🇧" },
  { name: "États-Unis", code: "US", flag: "🇺🇸" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Tunisie", code: "TN", flag: "🇹🇳" },
  { name: "Algérie", code: "DZ", flag: "🇩🇿" },
  { name: "Sénégal", code: "SN", flag: "🇸🇳" },
  { name: "Côte d'Ivoire", code: "CI", flag: "🇨🇮" },
  { name: "Mauritanie", code: "MR", flag: "🇲🇷" },
];

const technologiesData = [
  // Frontend
  {
    name: "React",
    category: "Frontend",
    description:
      "Bibliothèque JavaScript pour construire des interfaces utilisateur",
  },
  {
    name: "Vue.js",
    category: "Frontend",
    description: "Framework JavaScript progressif pour construire des UI",
  },
  {
    name: "Angular",
    category: "Frontend",
    description: "Plateforme de développement pour créer des applications web",
  },
  {
    name: "Next.js",
    category: "Frontend",
    description: "Framework React pour la production",
  },
  {
    name: "Svelte",
    category: "Frontend",
    description: "Framework de compilation pour créer des interfaces web",
  },

  // Backend
  {
    name: "Node.js",
    category: "Backend",
    description: "Environnement d'exécution JavaScript côté serveur",
  },
  {
    name: "Express.js",
    category: "Backend",
    description: "Framework web minimaliste pour Node.js",
  },
  {
    name: "NestJS",
    category: "Backend",
    description: "Framework Node.js pour créer des applications côté serveur",
  },
  {
    name: "Laravel",
    category: "Backend",
    description: "Framework PHP pour le développement web",
  },
  {
    name: "Django",
    category: "Backend",
    description: "Framework web Python de haut niveau",
  },
  {
    name: "FastAPI",
    category: "Backend",
    description: "Framework Python moderne et rapide pour créer des APIs",
  },
  {
    name: "Spring Boot",
    category: "Backend",
    description: "Framework Java pour créer des applications",
  },

  // Database
  {
    name: "MongoDB",
    category: "Database",
    description: "Base de données NoSQL orientée documents",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    description: "Système de gestion de base de données relationnelle",
  },
  {
    name: "MySQL",
    category: "Database",
    description: "Système de gestion de base de données relationnelle",
  },
  {
    name: "Redis",
    category: "Database",
    description: "Base de données en mémoire pour le cache et les messages",
  },

  // Mobile
  {
    name: "React Native",
    category: "Mobile",
    description: "Framework pour créer des applications mobiles natives",
  },
  {
    name: "Flutter",
    category: "Mobile",
    description: "SDK de Google pour créer des applications mobiles",
  },
  {
    name: "Ionic",
    category: "Mobile",
    description: "Framework pour créer des applications mobiles hybrides",
  },

  // DevOps
  {
    name: "Docker",
    category: "DevOps",
    description: "Plateforme de conteneurisation",
  },
  {
    name: "Kubernetes",
    category: "DevOps",
    description: "Système d'orchestration de conteneurs",
  },
  { name: "AWS", category: "DevOps", description: "Services cloud d'Amazon" },
  {
    name: "Azure",
    category: "DevOps",
    description: "Plateforme cloud de Microsoft",
  },
  {
    name: "Jenkins",
    category: "DevOps",
    description: "Serveur d'automatisation open source",
  },
];

const clientsData = [
  {
    name: "Bank Al-Maghrib",
    industry: "Finance",
    email: "contact@bam.ma",
    phone: "+212 5 37 57 41 04",
    address: "277, Avenue Mohammed V, Rabat",
    website: "https://www.bam.ma",
    contactPerson: "Mohamed Benchaaboun",
    notes:
      "Banque centrale du Maroc, client stratégique pour les projets fintech",
  },
  {
    name: "Société Générale Maroc",
    industry: "Finance",
    email: "info@sgmaroc.com",
    phone: "+212 5 22 43 88 88",
    address: "55, Boulevard Abdelmoumen, Casablanca",
    website: "https://www.sgmaroc.com",
    contactPerson: "Khalid Nasr",
    notes:
      "Filiale marocaine de Société Générale, projets de digitalisation bancaire",
  },
  {
    name: "ONCF",
    industry: "Transport",
    email: "contact@oncf.ma",
    phone: "+212 8 90 20 30 40",
    address: "8, Bis Rue Abderrahmane El Ghafiki, Rabat",
    website: "https://www.oncf.ma",
    contactPerson: "Mohamed Rabie Khlie",
    notes: "Office National des Chemins de Fer, projets de modernisation IT",
  },
  {
    name: "Maroc Telecom",
    industry: "Télécommunications",
    email: "contact@iam.ma",
    phone: "+212 8 01 00 12 34",
    address: "Avenue Annakhil, Hay Riad, Rabat",
    website: "https://www.iam.ma",
    contactPerson: "Abdeslam Ahizoune",
    notes: "Leader des télécoms au Maroc, projets d'infrastructure réseau",
  },
  {
    name: "TechCorp Solutions",
    industry: "Technologie",
    email: "hello@techcorp.fr",
    phone: "+33 1 42 86 83 00",
    address: "15 Rue de la Paix, Paris",
    website: "https://www.techcorp.fr",
    contactPerson: "Marie Dubois",
    notes: "Startup française spécialisée en IA et machine learning",
  },
  {
    name: "EduTech Institute",
    industry: "Éducation",
    email: "contact@edutech.org",
    phone: "+1 555 123 4567",
    address: "123 Innovation Drive, San Francisco",
    website: "https://www.edutech.org",
    contactPerson: "John Smith",
    notes: "Institut de formation en ligne, plateforme d'e-learning",
  },
  {
    name: "Digital Services SARL",
    industry: "Services Numériques",
    email: "info@digitalservices.ma",
    phone: "+212 5 22 77 88 99",
    address: "Twin Center, Tour A, Casablanca",
    website: "https://www.digitalservices.ma",
    contactPerson: "Aicha Benali",
    notes: "Agence de transformation digitale pour PME",
  },
  {
    name: "HealthCare Plus",
    industry: "Santé",
    email: "contact@healthcareplus.com",
    phone: "+212 5 37 65 43 21",
    address: "Quartier des Hôpitaux, Rabat",
    website: "https://www.healthcareplus.com",
    contactPerson: "Dr. Youssef Alami",
    notes: "Réseau de cliniques privées, digitalisation des dossiers médicaux",
  },
  {
    name: "IBTIKAR TECHNOLOGIES",
    industry: "Technologie",
    email: "contact@ibtikar.mr",
    phone: "+222 45 29 84 73",
    address: "Nouakchott, Mauritanie",
    website: "https://www.ibtikar.mr",
    contactPerson: "Mohamed Hadoueni",
    notes: "Société de développement logiciel et conseil IT en Mauritanie",
  },
];

const usersData = [
  {
    username: "admin",
    email: "admin@ibtikar.com",
    password: "admin123",
    role: "Admin",
    firstName: "Ahmed",
    lastName: "Benali",
    isActive: true,
  },
  {
    username: "user",
    email: "user@ibtikar.com",
    password: "user123",
    role: "User",
    firstName: "Fatima",
    lastName: "Zahra",
    isActive: true,
  },
  {
    username: "manager",
    email: "manager@ibtikar.com",
    password: "manager123",
    role: "Admin",
    firstName: "Mohamed",
    lastName: "Alaoui",
    isActive: true,
  },
];

// Sample references data
const referencesData = [
  {
    title: "Système de Gestion Bancaire Core Banking",
    description:
      "Développement d'un système de gestion bancaire complet avec gestion des comptes, transactions, et reporting en temps réel. Interface web responsive et API REST sécurisée.",
    status: "active",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-12-15"),
    budget: 250000,
    teamSize: 8,
    clientSatisfaction: 9.2,
    notes:
      "Projet stratégique de modernisation du système legacy. Migration de données complexe réussie.",
    documents: ["specifications.pdf", "architecture.pdf", "user-manual.pdf"],
  },
  {
    title: "Application Mobile E-commerce",
    description:
      "Création d'une application mobile native iOS/Android pour plateforme e-commerce avec paiement intégré, géolocalisation et notifications push.",
    status: "completed",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-08-30"),
    budget: 85000,
    teamSize: 5,
    clientSatisfaction: 8.8,
    notes:
      "Livraison dans les délais. Performance excellente avec 50k+ téléchargements en 3 mois.",
    documents: ["app-design.pdf", "technical-specs.pdf"],
  },
  {
    title: "Plateforme de Formation en Ligne",
    description:
      "Développement d'une plateforme LMS complète avec gestion des cours, évaluations, certificats et analytics pour suivi des apprenants.",
    status: "in_progress",
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-02-28"),
    budget: 120000,
    teamSize: 6,
    clientSatisfaction: 8.5,
    notes:
      "Phase 1 terminée (gestion des utilisateurs). Phase 2 en cours (système de cours).",
    documents: ["functional-requirements.pdf", "ui-mockups.pdf"],
  },
  {
    title: "API Management System",
    description:
      "Mise en place d'un système de gestion d'APIs avec gateway, authentification, monitoring, rate limiting et documentation automatique.",
    status: "active",
    startDate: new Date("2024-04-15"),
    endDate: new Date("2024-11-30"),
    budget: 95000,
    teamSize: 4,
    clientSatisfaction: 9.0,
    notes:
      "Solution scalable déployée sur AWS. Monitoring en temps réel opérationnel.",
    documents: ["api-documentation.pdf", "deployment-guide.pdf"],
  },
  {
    title: "Système de Réservation de Trains",
    description:
      "Modernisation du système de réservation en ligne avec nouvelle interface, paiement mobile et intégration temps réel avec les horaires.",
    status: "completed",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-05-15"),
    budget: 180000,
    teamSize: 10,
    clientSatisfaction: 9.5,
    notes:
      "Augmentation de 40% des réservations en ligne. Excellent feedback utilisateurs.",
    documents: [
      "project-summary.pdf",
      "performance-report.pdf",
      "user-feedback.pdf",
    ],
  },
  {
    title: "Infrastructure Réseau 5G",
    description:
      "Déploiement et configuration d'infrastructure réseau 5G avec monitoring, optimisation automatique et gestion centralisée.",
    status: "active",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2025-01-31"),
    budget: 500000,
    teamSize: 12,
    clientSatisfaction: 8.7,
    notes:
      "Déploiement en cours dans 15 villes. Phase pilote réussie à Casablanca.",
    documents: ["network-architecture.pdf", "deployment-plan.pdf"],
  },
  {
    title: "Dossier Médical Électronique",
    description:
      "Digitalisation complète des dossiers médicaux avec système de partage sécurisé entre professionnels de santé et patients.",
    status: "in_progress",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-12-31"),
    budget: 75000,
    teamSize: 5,
    clientSatisfaction: 8.3,
    notes:
      "Conformité RGPD assurée. Tests utilisateurs en cours dans 3 cliniques pilotes.",
    documents: ["security-audit.pdf", "compliance-report.pdf"],
  },
  {
    title: "Site Web Corporate IBTIKAR",
    description:
      "Développement du site web vitrine de IBTIKAR TECHNOLOGIES avec portfolio, présentation des services et interface d'administration.",
    status: "completed",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-15"),
    budget: 45000,
    teamSize: 3,
    clientSatisfaction: 9.8,
    notes:
      "Projet interne réalisé avec succès. SEO optimisé et performances excellentes.",
    documents: ["website-specs.pdf", "seo-report.pdf"],
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB Atlas
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb+srv://mhadoueni:WX5xzFOeQO1bxPWV@sablettes.2h0sm.mongodb.net/ibtikar-rms?retryWrites=true&w=majority";

    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await Country.deleteMany({});
    await Technology.deleteMany({});
    await Client.deleteMany({});
    await Reference.deleteMany({});

    // Seed Countries
    console.log("🌍 Seeding countries...");
    const countries = await Country.insertMany(countriesData);
    console.log(`✅ Created ${countries.length} countries`);

    // Seed Technologies
    console.log("💻 Seeding technologies...");
    const technologies = await Technology.insertMany(technologiesData);
    console.log(`✅ Created ${technologies.length} technologies`);

    // Seed Users
    console.log("👥 Seeding users...");
    const users = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      await user.save();
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Seed Clients
    console.log("🏢 Seeding clients...");
    const clients = [];
    for (const clientData of clientsData) {
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];
      const client = new Client({
        ...clientData,
        country: randomCountry._id,
        createdBy: users[0]._id, // Created by admin user
      });
      await client.save();
      clients.push(client);
    }
    console.log(`✅ Created ${clients.length} clients`);

    // Seed References
    console.log("📝 Seeding references...");
    const references = [];
    for (let i = 0; i < referencesData.length; i++) {
      const refData = referencesData[i];
      const randomClient = clients[i % clients.length];
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

      // Select random technologies for each reference
      const numTechs = Math.floor(Math.random() * 5) + 2; // 2-6 technologies
      const selectedTechs = [];
      for (let j = 0; j < numTechs; j++) {
        const randomTech =
          technologies[Math.floor(Math.random() * technologies.length)];
        if (!selectedTechs.includes(randomTech._id)) {
          selectedTechs.push(randomTech._id);
        }
      }

      const reference = new Reference({
        ...refData,
        client: randomClient._id,
        country: randomCountry._id,
        technologies: selectedTechs,
        createdBy: users[Math.floor(Math.random() * users.length)]._id,
      });
      await reference.save();
      references.push(reference);
    }
    console.log(`✅ Created ${references.length} references`);

    // Print summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🌍 Countries: ${countries.length}`);
    console.log(`   💻 Technologies: ${technologies.length}`);
    console.log(`   🏢 Clients: ${clients.length}`);
    console.log(`   📝 References: ${references.length}`);

    console.log("\n🔐 Login credentials:");
    console.log("   Admin: admin@ibtikar.com / admin123");
    console.log("   Manager: manager@ibtikar.com / manager123");
    console.log("   User: user@ibtikar.com / user123");

    console.log("\n☁️ Database migrated to MongoDB Atlas cluster:");
    console.log("   Cluster: sablettes.2h0sm.mongodb.net");
    console.log("   Database: ibtikar-rms");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB Atlas");
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
