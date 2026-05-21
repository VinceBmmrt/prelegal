"use client";

import { useRef, useState } from "react";
import { defaultFormData, NdaFormData } from "@/lib/types";
import ChatPanel from "./ChatPanel";
import NdaPreview from "./NdaPreview";

export default function NdaGenerator() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  function handleFieldsUpdate(update: Partial<NdaFormData>) {
    setFormData((prev) => {
      const prevAny = prev as unknown as Record<string, unknown>;
      const next = { ...prevAny };
      for (const [key, val] of Object.entries(update)) {
        if (val != null && typeof val === "object" && !Array.isArray(val)) {
          next[key] = { ...(prevAny[key] as object), ...(val as object) };
        } else {
          next[key] = val;
        }
      }
      return next as unknown as NdaFormData;
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

      pdf.save("accord-de-confidentialite-mutuel.pdf");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-65px)]">
      {/* Chat panel */}
      <aside className="w-96 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
        <ChatPanel formData={formData} onFieldsUpdate={handleFieldsUpdate} />
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
        <NdaPreview formData={formData} ref={previewRef} />
      </div>
    </div>
  );
}
