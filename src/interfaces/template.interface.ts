export interface LinkItem {
    text: string
    url: string
}

export interface ProfileInfo {
    name: string
    username: string
    bio: string
    avatar: string
    location: string
}

export interface ButtonStyle {
    backgroundColor?: string
    textColor: string
    buttonColor: string
    buttonTextColor: string
    accentColor?: string
    fontFamily: string
    buttonStyle: "rounded" | "pill" | "square" | "outline"
    buttonBorder: boolean
    buttonEffect: "flat" | "3d" | "glass" | "neon" | "shadow" | "minimal"
    backgroundImage?: string
    overlay?: boolean
}

export interface TemplateConfig {
    id: string
    name: string
    profile: ProfileInfo
    links: LinkItem[]
    style: ButtonStyle
}


export interface TemplateCardProps {
    template: TemplateConfig & {
        corner_config?: {
            type?: "sharp" | "round" | "rounded"
            fillColor?: string
            strokeColor?: string
            shadowSize?: "hard" | "soft"
            shadowColor?: string
            opacity?: number
        }
        font_config?: {
            name?: string
            fillColor?: string
        }
        wallpaper_config?: {
            // Your wallpaper config type
        }
        isPremium?: boolean
        name?: string
    }
    onClick: () => void
    isSelected?: boolean
}