'use client'

export default function AccountCard({
  user,
}: {
  user: { id: string; name: string; email: string; createdAt: string }
}) {
  return (
    <div className="rounded-xl border bg-white/60 backdrop-blur p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Conta</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-3"><span className="text-gray-500">Nome</span><span className="font-medium">{user.name}</span></div>
        <div className="flex justify-between gap-3"><span className="text-gray-500">Email</span><span className="font-medium break-all">{user.email}</span></div>
        <div className="flex justify-between gap-3"><span className="text-gray-500">ID</span><span className="font-mono text-xs">{user.id}</span></div>
        <div className="flex justify-between gap-3"><span className="text-gray-500">Criado em</span><span className="font-medium">{new Date(user.createdAt).toLocaleString('pt-BR')}</span></div>
      </div>
    </div>
  )
}
