export interface NdaParty {
  nom: string;
  titre: string;
  societe: string;
  adresse: string;
  date: string;
}

export interface NdaFormData {
  objet: string;
  dateEntreeEnVigueur: string;
  dureeNda: "fixed" | "until_terminated";
  dureeNdaYears: number;
  dureeConfidentialite: "fixed" | "perpetual";
  dureeConfidentialiteYears: number;
  modifications: string;
  partie1: NdaParty;
  partie2: NdaParty;
}

export const defaultFormData: NdaFormData = {
  objet:
    "Évaluer l'opportunité d'entrer dans une relation commerciale avec l'autre partie.",
  dateEntreeEnVigueur: new Date().toISOString().split("T")[0],
  dureeNda: "fixed",
  dureeNdaYears: 1,
  dureeConfidentialite: "fixed",
  dureeConfidentialiteYears: 1,
  modifications: "",
  partie1: { nom: "", titre: "", societe: "", adresse: "", date: "" },
  partie2: { nom: "", titre: "", societe: "", adresse: "", date: "" },
};
