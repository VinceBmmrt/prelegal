import { NdaFormData, NdaParty } from "@/lib/types";

interface Props {
  formData: NdaFormData;
  onChange: (data: NdaFormData) => void;
}

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function PartyFields({
  label,
  party,
  onChange,
}: {
  label: string;
  party: NdaParty;
  onChange: (p: NdaParty) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
        {label}
      </h3>
      <Field label="Nom">
        <input
          type="text"
          value={party.nom}
          placeholder="Nom Prénom"
          onChange={(e) => onChange({ ...party, nom: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Titre">
        <input
          type="text"
          value={party.titre}
          placeholder="ex : Directeur Général"
          onChange={(e) => onChange({ ...party, titre: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Société">
        <input
          type="text"
          value={party.societe}
          placeholder="Nom de la société"
          onChange={(e) => onChange({ ...party, societe: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Adresse de notification">
        <input
          type="text"
          value={party.adresse}
          placeholder="Adresse e-mail ou postale"
          onChange={(e) => onChange({ ...party, adresse: e.target.value })}
          className={inputClass}
        />
      </Field>
      <Field label="Date de signature">
        <input
          type="date"
          value={party.date}
          onChange={(e) => onChange({ ...party, date: e.target.value })}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

export default function NdaForm({ formData, onChange }: Props) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <section>
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
          Informations de l&apos;accord
        </h2>
        <div className="space-y-4">
          <Field label="Objet de l'accord">
            <textarea
              rows={3}
              value={formData.objet}
              onChange={(e) => onChange({ ...formData, objet: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Date d'entrée en vigueur">
            <input
              type="date"
              value={formData.dateEntreeEnVigueur}
              onChange={(e) =>
                onChange({ ...formData, dateEntreeEnVigueur: e.target.value })
              }
              className={inputClass}
            />
          </Field>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Durée de l&apos;ACNM
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dureeNda"
                  value="fixed"
                  checked={formData.dureeNda === "fixed"}
                  onChange={() => onChange({ ...formData, dureeNda: "fixed" })}
                />
                Expire après
                <input
                  type="number"
                  min={1}
                  value={formData.dureeNdaYears}
                  disabled={formData.dureeNda !== "fixed"}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      dureeNdaYears: Math.max(1, +e.target.value),
                    })
                  }
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                />
                an(s) à compter de la date d&apos;entrée en vigueur
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dureeNda"
                  value="until_terminated"
                  checked={formData.dureeNda === "until_terminated"}
                  onChange={() =>
                    onChange({ ...formData, dureeNda: "until_terminated" })
                  }
                />
                Se poursuit jusqu&apos;à résiliation
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Durée de confidentialité
            </legend>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dureeConf"
                  value="fixed"
                  checked={formData.dureeConfidentialite === "fixed"}
                  onChange={() =>
                    onChange({ ...formData, dureeConfidentialite: "fixed" })
                  }
                />
                Pendant
                <input
                  type="number"
                  min={1}
                  value={formData.dureeConfidentialiteYears}
                  disabled={formData.dureeConfidentialite !== "fixed"}
                  onChange={(e) =>
                    onChange({
                      ...formData,
                      dureeConfidentialiteYears: Math.max(1, +e.target.value),
                    })
                  }
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                />
                an(s) à compter de la date d&apos;entrée en vigueur
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="dureeConf"
                  value="perpetual"
                  checked={formData.dureeConfidentialite === "perpetual"}
                  onChange={() =>
                    onChange({ ...formData, dureeConfidentialite: "perpetual" })
                  }
                />
                À perpétuité
              </label>
            </div>
          </fieldset>

          <Field label="Modifications de l'ACNM (optionnel)">
            <textarea
              rows={3}
              value={formData.modifications}
              placeholder="Toute modification apportée à l'ACNM standard…"
              onChange={(e) =>
                onChange({ ...formData, modifications: e.target.value })
              }
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <hr className="border-gray-200" />

      <section>
        <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
          Parties
        </h2>
        <div className="space-y-6">
          <PartyFields
            label="Partie 1"
            party={formData.partie1}
            onChange={(p) => onChange({ ...formData, partie1: p })}
          />
          <PartyFields
            label="Partie 2"
            party={formData.partie2}
            onChange={(p) => onChange({ ...formData, partie2: p })}
          />
        </div>
      </section>
    </form>
  );
}
