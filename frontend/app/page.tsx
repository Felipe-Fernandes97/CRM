export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao CRM
        </h1>
        <p className="text-lg text-gray-600">
          Sistema de CRM desenvolvido com React, Next.js e TypeScript
        </p>
        <div className="mt-8">
          <a
            href="/api/health"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Testar Conexão com API
          </a>
        </div>
      </div>
    </div>
  );
}
