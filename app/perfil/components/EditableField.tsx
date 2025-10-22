'use client'

export default function EditableField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded-md px-2 py-1 text-sm"
      aria-label="Editar valor"
    />
  )
}
