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
}>;
}

export interface WallpaperConfig {
    type: 'fill' | 'gradient' | 'image';
    image: {
        url: string;
        publicId: string;
    };
    backgroundColor: Array<{
        color: string;
        amount: number;
    }>;
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