"use client";

import { useEffect, useState } from "react";
import { authHeaders } from "@/lib/auth";

export interface SavedDocument {
  id: number;
  document_type: string;
  document_name: string;
  fields: Record<string, unknown>;
  created_at: string;
}

interface Props {
  onNewDocument: () => void;
  onOpenDocument: (doc: SavedDocument) => void;
}

export default function HomeView({ onNewDocument, onOpenDocument }: Props) {
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/documents", { headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setDocs)
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id: number) {
    fetch(`/api/documents/${id}`, { method: "DELETE", headers: authHeaders() }).then(
      () => setDocs((prev) => prev.filter((d) => d.id !== id))
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero CTA */}
        <div
          className="rounded-2xl p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, #032147 0%, #209dd7 100%)" }}
        >
          <div>
            <h1 className="text-xl font-bold text-white mb-1">
              Rédigez votre prochain document juridique
            </h1>
            <p className="text-sm text-white/70">
              12 modèles de droit français • Guidé par IA • Prêt en quelques minutes
            </p>
          </div>
          <button
            onClick={onNewDocument}
            className="flex-shrink-0 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#ecad0a" }}
          >
            + Nouveau document
          </button>
        </div>

        {/* Document list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: "#032147" }}>
            Mes documents
          </h2>
          {docs.length > 0 && (
            <span className="text-xs" style={{ color: "#888888" }}>
              {docs.length} document{docs.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-gray-400 animate-pulse py-8 text-center">
            Chargement…
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">
              Vous n&apos;avez pas encore de documents sauvegardés.
            </p>
            <button
              onClick={onNewDocument}
              className="text-sm font-semibold hover:underline"
              style={{ color: "#209dd7" }}
            >
              Créer votre premier document →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3
                    className="text-sm font-semibold leading-snug flex-1"
                    style={{ color: "#032147" }}
                  >
                    {doc.document_name}
                  </h3>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                    style={{ color: "#888888" }}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs mb-4" style={{ color: "#888888" }}>
                  {formatDate(doc.created_at)}
                </p>
                <button
                  onClick={() => onOpenDocument(doc)}
                  className="w-full rounded-lg py-2 text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#209dd7" }}
                >
                  Ouvrir
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
