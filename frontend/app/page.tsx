import NdaGenerator from "@/components/NdaGenerator";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <h1
          className="text-xl font-semibold"
          style={{ color: "#032147" }}
        >
          Accord de Confidentialité Mutuel
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#888888" }}>
          Discutez avec l&apos;assistant pour remplir votre accord
        </p>
      </header>
      <NdaGenerator />
    </div>
  );
}
