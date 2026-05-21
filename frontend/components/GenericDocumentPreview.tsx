"use client";

interface Props {
  fields: Record<string, unknown>;
  documentName: string;
}

export default function GenericDocumentPreview({ fields, documentName }: Props) {
  const entries = Object.entries(fields).filter(
    ([, v]) => v != null && v !== ""
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
      <h1
        className="text-xl font-bold mb-6 pb-4 border-b border-gray-200"
        style={{ color: "#032147" }}
      >
        {documentName}
      </h1>

      {entries.length === 0 ? (
        <p className="text-sm italic" style={{ color: "#888888" }}>
          Commencez la conversation pour remplir les champs du document.
        </p>
      ) : (
        <dl className="space-y-4">
          {entries.map(([key, value]) => (
            <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
              <dt
                className="text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: "#888888" }}
              >
                {formatLabel(key)}
              </dt>
              <dd className="text-sm text-gray-800">
                {typeof value === "object" && value !== null
                  ? renderNested(value as Record<string, unknown>)
                  : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <Disclaimer />
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="mt-8 pt-4 border-t border-gray-200 text-xs italic text-gray-400 text-center">
      Ce document est un projet de rédaction produit par IA. Il doit être soumis à la révision
      d&apos;un professionnel du droit avant toute utilisation.
    </p>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function renderNested(obj: Record<string, unknown>) {
  const entries = Object.entries(obj).filter(([, v]) => v != null && v !== "");
  if (entries.length === 0) return null;
  return (
    <ul className="space-y-1">
      {entries.map(([k, v]) => (
        <li key={k}>
          <span className="font-medium">{formatLabel(k)}</span>:{" "}
          <span>{String(v)}</span>
        </li>
      ))}
    </ul>
  );
}
