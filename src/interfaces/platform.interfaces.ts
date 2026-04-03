export interface PlatformInterface {
    id:string
    name: string
    icon: string
    color?: string
    type?: "social" | "streaming"
}