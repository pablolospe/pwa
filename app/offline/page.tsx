'use client'

import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#4ade80] text-center">
      <h1 className="text-2xl font-bold mb-4">Sin conexión</h1>
      <p className="mb-6">No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Reintentar
      </Link>
    </div>
  )
}
