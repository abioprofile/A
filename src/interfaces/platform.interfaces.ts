import { IconType } from 'react-icons';
import { LucideIcon } from "lucide-react";

export interface PlatformInterface {
    id:string
    name: string
    icon: string | IconType | LucideIcon
    color?: string
    type?: "social" | "streaming"
    isReactIcon?: boolean 
}