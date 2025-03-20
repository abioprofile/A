import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground max-[320px]:text-sm px-5 md:px-10 placeholder:text-muted-foreground placeholder:text-[20px] selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-[#7140EB] flex h-10 lg:h-[59px] w-full lg:w-[454px] min-w-0 rounded-full border bg-[#D9D9D9] py-1 text-[20px] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[#7140EB] focus-visible:ring-[#7140EB]/50 focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
