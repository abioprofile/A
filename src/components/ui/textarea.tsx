import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-sm lg:placeholder:text-[16px] max-[320px]:text-sm px-5 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full lg:w-[454px] border-[#7140EB80] min-w-0 bg-transparent text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm py-3 text-[16px] shadow-xs rounded-[10px] border",
        "focus-visible:border-[#7140EB] focus-visible:ring-[#7140EB]/50 focus-visible:ring-[1px]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
