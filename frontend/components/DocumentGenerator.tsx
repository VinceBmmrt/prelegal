"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { defaultFormData, NdaFormData } from "@/lib/types";
import ChatPanel from "./ChatPanel";

const NdaPreview = dynamic(() => import("./NdaPreview"), { ssr: false });
const GenericDocumentPreview = dynamic(
  () => import("./GenericDocumentPreview"),
  { ssr: false }
);

const ACNM_TYPE = "Accord-de-Confidentialite-Mutuel";

interface Props {
  documentType: string;
  documentName: string;
}

export default function DocumentGenerator({ documentType, documentName }: Props) {
  const [formData, setFormData] = useState<Record<string, unknown>>(
    documentType === ACNM_TYPE
      ? (defaultFormData as unknown as Record<string, unknown>)
      : {}
  );
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  function handleFieldsUpdate(update: Record<string, unknown>) {
    setFormData((prev) => {
      const next = { ...prev };
      for (const [key, val] of Object.entries(update)) {
        if (val == null) continue;
        if (typeof val === "object" && !Array.isArray(val)) {
          const prevVal = (prev[key] as Record<string, unknown>) ?? {};
          const merged: Record<string, unknown> = { ...prevVal };
          for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
            if (v != null) merged[k] = v;
          }
          next[key] = merged;
        } else {
          next[key] = val;
        }
      }
      return next;
    });
  }

  async function handleDownloadPdf() {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import("jspdf"),
        import("html2canvas").then((m) => m.default),
      ]);

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;

      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -y, pageW, imgH);
        y += pageH;
      }

      const slug = documentName
        .toLowerCase()
        .normalize("NFD")
        // eslint-disable-next-line no-misleading-character-class
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      pdf.save(`${slug}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Chat panel */}
      <aside className="w-96 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <ChatPanel
          formData={formData}
          onFieldsUpdate={handleFieldsUpdate}
          documentType={documentType}
        />
        <div className="flex-shrink-0 px-4 pb-4">
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            style={{ backgroundColor: "#209dd7" }}
          >
            {downloading ? "Génération en cours…" : "Télécharger en PDF"}
          </button>
        </div>
      </aside>

      {/* Preview panel */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
        {documentType === ACNM_TYPE ? (
          <NdaPreview
            formData={formData as unknown as NdaFormData}
            ref={previewRef}
          />
        ) : (
          <GenericDocumentPreview
            fields={formData}
            documentName={documentName}
            ref={previewRef}
          />
        )}
      </div>
    </div>
  );
}
