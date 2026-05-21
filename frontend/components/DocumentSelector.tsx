"use client";

import { catalogFr, docTypeKey } from "@/lib/catalog";

interface Props {
  onBack: () => void;
  onSelect: (documentType: string, documentName: string) => void;
}

export default function DocumentSelector({ onBack, onSelect }: Props) {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="text-sm font-medium hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: "#209dd7" }}
          >
            ← Retour
          </button>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#032147" }}>
              Choisissez votre document juridique
            </h1>
            <p className="text-sm" style={{ color: "#888888" }}>
              Notre assistant IA vous guidera étape par étape.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogFr.map((doc) => (
            <button
              key={doc.filename}
              onClick={() => onSelect(docTypeKey(doc.filename), doc.name)}
              className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-[#209dd7] hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#209dd7]"
            >
              <h2
                className="text-sm font-semibold mb-2 leading-tight"
                style={{ color: "#032147" }}
              >
                {doc.name}
              </h2>
              <p className="text-xs leading-relaxed" style={{ color: "#888888" }}>
                {doc.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
