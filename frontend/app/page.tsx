import NdaGenerator from "@/components/NdaGenerator";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Générateur d&apos;Accord de Confidentialité Mutuel
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Complétez le formulaire pour générer votre accord personnalisé
        </p>
      </header>
      <NdaGenerator />
    </div>
  );
}
