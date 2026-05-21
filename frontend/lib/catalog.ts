export interface CatalogEntry {
  name: string;
  description: string;
  filename: string;
}

/** Derives the backend document_type key from a catalog filename. */
export function docTypeKey(filename: string): string {
  return filename.replace("fr/", "").replace(".md", "");
}

export const catalogFr: CatalogEntry[] = [
  {
    name: "Accord de Confidentialité Mutuel",
    description:
      "NDA mutuel standard couvrant les obligations réciproques de confidentialité entre deux parties, adapté pour le droit français.",
    filename: "fr/Accord-de-Confidentialite-Mutuel.md",
  },
  {
    name: "Accord de Confidentialité Mutuel – Page de Couverture",
    description:
      "Page de couverture de l'Accord de Confidentialité Mutuel. À compléter avec les informations des parties et les conditions commerciales.",
    filename: "fr/Accord-de-Confidentialite-Mutuel-Page-de-Couverture.md",
  },
  {
    name: "Contrat de Service Cloud (CSC)",
    description:
      "Contrat standard pour la vente et l'achat de logiciels cloud et de produits SaaS, adapté pour le droit français.",
    filename: "fr/Contrat-de-Service-Cloud.md",
  },
  {
    name: "Accord sur les Niveaux de Service (ANS)",
    description:
      "Accord standard sur les niveaux de service conçu pour être utilisé avec le Contrat de Service Cloud.",
    filename: "fr/Accord-sur-les-Niveaux-de-Service.md",
  },
  {
    name: "Accord de Traitement des Données (ATD)",
    description:
      "Accord standard de traitement des données régissant le traitement des données personnelles, conforme au RGPD.",
    filename: "fr/Accord-de-Traitement-des-Donnees.md",
  },
  {
    name: "Accord Partenaire Design",
    description:
      "Accord standard pour les partenariats design en phase précoce, adapté pour le droit français.",
    filename: "fr/Accord-Partenaire-Design.md",
  },
  {
    name: "Contrat de Services Professionnels (CSP)",
    description:
      "Contrat standard pour les prestations de services professionnels, adapté pour le droit français.",
    filename: "fr/Contrat-de-Services-Professionnels.md",
  },
  {
    name: "Accord de Partenariat",
    description:
      "Accord de partenariat standard pour les entreprises technologiques (référence, revendeur ou co-vente).",
    filename: "fr/Accord-de-Partenariat.md",
  },
  {
    name: "Accord de Confidentialité – Données de Santé",
    description:
      "Accord de sous-traitance pour les données de santé, conforme au RGPD et au Code de la santé publique.",
    filename: "fr/Accord-de-Confidentialite-Donnees-de-Sante.md",
  },
  {
    name: "Contrat de Licence Logiciel",
    description:
      "Contrat standard pour l'octroi de licences logicielles à des clients, adapté pour le droit français.",
    filename: "fr/Contrat-de-Licence-Logiciel.md",
  },
  {
    name: "Accord Pilote",
    description:
      "Accord à court terme permettant d'évaluer un produit ou service avant de s'engager dans un contrat commercial complet.",
    filename: "fr/Accord-Pilote.md",
  },
  {
    name: "Avenant Intelligence Artificielle",
    description:
      "Avenant couvrant les conditions spécifiques à l'IA, adapté pour le droit français et le RGPD.",
    filename: "fr/Avenant-IA.md",
  },
];
