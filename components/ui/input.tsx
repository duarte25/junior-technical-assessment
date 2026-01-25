import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // bg-white: garante que o fundo do input seja branco mesmo que o container seja azul clarinho
        // text-[#102a43]: texto no seu azul marinho profundo (quase preto, mas com personalidade)
        "flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-all",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-slate-400 text-[#102a43]", 
        // focus-visible:ring-[#1848a0]: borda de foco com o seu azul vibrante
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1848a0]/20 focus-visible:border-[#1848a0]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
