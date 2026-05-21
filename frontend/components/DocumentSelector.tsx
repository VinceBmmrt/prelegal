"use client";

import { useState } from "react";
import { catalogFr, CatalogEntry, docTypeKey } from "@/lib/catalog";
import DocumentGenerator from "./DocumentGenerator";

export default function DocumentSelector() {
  const [selected, setSelected] = useState<CatalogEntry | null>(null);

  if (selected) {
    return (
      <div className="flex flex-col h-screen">
        <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSelected(null)}
            className="text-sm font-medium hover:opacity-70 transition-opacity flex-shrink-0"
            style={{ color: "#209dd7" }}
          >
            ← Choisir un autre document
          </button>
          <div className="min-w-0">
            <h1
              className="text-xl font-semibold truncate"
              style={{ color: "#032147" }}
            >
              {selected.name}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
              Discutez avec l&apos;assistant pour remplir votre document
            </p>
          </div>
        </header>
        <DocumentGenerator
          documentType={docTypeKey(selected.filename)}
          documentName={selected.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-2xl font-semibold" style={{ color: "#032147" }}>
          Choisissez votre document juridique
        </h1>
        <p className="text-sm mt-1" style={{ color: "#888888" }}>
          Sélectionnez le type de document à rédiger. Notre assistant IA vous guidera étape par étape.
        </p>
      </header>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {catalogFr.map((doc) => (
          <button
            key={doc.filename}
            onClick={() => setSelected(doc)}
            className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:border-[#209dd7] hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#209dd7]"
          >
            <h2
              className="text-base font-semibold mb-2 leading-tight"
              style={{ color: "#032147" }}
            >
              {doc.name}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
              {doc.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
