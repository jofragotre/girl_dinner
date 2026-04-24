"use client"

import { deleteItemAction } from "@/app/actions/admin"

export default function DeleteButton({ id, kind, name }: { id: string; kind: string; name: string }) {
  return (
    <form
      action={deleteItemAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"?`)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="kind" value={kind} />
      <button
        type="submit"
        className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#F5E6F0]/30 hover:text-[#FF3D8B] transition-colors px-3 py-1.5 rounded-full border border-[#F5E6F0]/10 hover:border-[#FF3D8B]/30 cursor-pointer"
      >
        delete
      </button>
    </form>
  )
}
