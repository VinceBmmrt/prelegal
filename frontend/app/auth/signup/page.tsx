"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUp() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      await signup(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold" style={{ color: "#032147" }}>
          Prelegal
        </span>
        <span
          className="ml-2 text-xs px-2 py-0.5 rounded-full text-white font-semibold"
          style={{ backgroundColor: "#ecad0a" }}
        >
          Bêta
        </span>
        <p className="text-sm mt-2" style={{ color: "#888888" }}>
          Rédaction de documents juridiques assistée par IA
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <h1 className="text-xl font-bold mb-1" style={{ color: "#032147" }}>
          Créer un compte
        </h1>
        <p className="text-sm mb-6" style={{ color: "#888888" }}>
          Gratuit — commencez à rédiger en quelques secondes
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="8 caractères minimum"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 transition-colors"
            style={{ backgroundColor: "#753991" }}
          >
            {loading ? "Création du compte…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: "#888888" }}>
          Déjà un compte ?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold hover:underline"
            style={{ color: "#209dd7" }}
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
