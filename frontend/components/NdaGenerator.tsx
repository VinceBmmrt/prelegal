"use client";

import { useRef, useState } from "react";
import { defaultFormData, NdaFormData } from "@/lib/types";
import NdaForm from "./NdaForm";
import NdaPreview from "./NdaPreview";

export default function NdaGenerator() {
  const [formData, setFormData] = useState<NdaFormData>(defaultFormData);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
      {/* Form panel */}
      <aside className="w-96 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          <NdaForm formData={formData} onChange={setFormData} />
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
