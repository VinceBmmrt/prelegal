"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/AppHeader";
import HomeView, { type SavedDocument } from "@/components/HomeView";
import DocumentSelector from "@/components/DocumentSelector";
import DocumentGenerator from "@/components/DocumentGenerator";

type View = "home" | "select" | "create";

interface ActiveDoc {
  documentType: string;
  documentName: string;
  initialFields?: Record<string, unknown>;
}

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>("home");
  const [activeDoc, setActiveDoc] = useState<ActiveDoc | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/signin");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-sm animate-pulse" style={{ color: "#888888" }}>
          Chargement…
        </span>
      </div>
    );
  }

  if (!user) return null;

  function openDocument(doc: SavedDocument) {
    setActiveDoc({
      documentType: doc.document_type,
      documentName: doc.document_name,
      initialFields: doc.fields,
    });
    setView("create");
  }

  function selectDocType(documentType: string, documentName: string) {
    setActiveDoc({ documentType, documentName });
    setView("create");
  }

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />

      {view === "home" && (
        <HomeView
          onNewDocument={() => setView("select")}
          onOpenDocument={openDocument}
        />
      )}

      {view === "select" && (
        <DocumentSelector
          onBack={() => setView("home")}
          onSelect={selectDocType}
        />
      )}

      {view === "create" && activeDoc && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Document sub-header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
            <button
              onClick={() => setView("home")}
              className="text-sm font-medium hover:opacity-70 transition-opacity flex-shrink-0"
              style={{ color: "#209dd7" }}
            >
              ← Mes documents
            </button>
            <div className="min-w-0">
              <h2
                className="text-base font-semibold truncate"
                style={{ color: "#032147" }}
              >
                {activeDoc.documentName}
              </h2>
              <p className="text-xs" style={{ color: "#888888" }}>
                Discutez avec l&apos;assistant pour remplir votre document
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <DocumentGenerator
              documentType={activeDoc.documentType}
              documentName={activeDoc.documentName}
              initialFields={activeDoc.initialFields}
              onBack={() => setView("home")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
