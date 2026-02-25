/** UI state for button/corner styling (preview); maps to CornerConfig for API. */
export interface ButtonStyle {
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  opacity: number;
  boxShadow: string;
  shadowColor?: string;
}

export interface CornerConfig {
    type: 'sharp' | 'round' | 'curved';
    opacity: number;
    fillColor: string;
    shadowSize: string;
    shadowColor: string;
    strokeColor: string;
}

export interface FontConfig {
    name: string;
    fillColor: string;
    strokeColor: string;
}

export interface ImageWallpaperConfig {
  type: 'image';
  image: File;
}

export interface FillGradientWallpaperConfig {
    type: 'fill' | 'gradient';
  backgroundColor: Array<{
    color: string;
    amount: number;
}> | string;
}

export interface WallpaperConfig {
    type: 'fill' | 'gradient' | 'image';
    image?: {
        url: string;
        publicId: string;
    };
    // backgroundColor: Array<{
    //     color: string;
    //     amount: number;
    // }>;
    backgroundColor?: string;
}

export interface AppearancePayload {
    id: string;
    userId: string;
    profileId: string;
    selected_theme: string | null;
    font_config: FontConfig;
    corner_config: CornerConfig;
    wallpaper_config: WallpaperConfig;
    createdAt: string;
    updatedAt: string;
}

export interface AppearanceResponse {
    success: boolean;
    message: string;
    data: AppearancePayload;
    statusCode: number;
}