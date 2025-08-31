import { useState } from "react";
import { User } from "lucide-react";

interface MinecraftAvatarProps {
  playerName: string;
  size?: number;
  className?: string;
}

export default function MinecraftAvatar({ playerName, size = 64, className = "" }: MinecraftAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use Minecraft avatar services
  const avatarUrl = `https://mc-heads.net/avatar/${playerName}/${size}`;
  const fallbackUrl = `https://crafatar.com/avatars/${playerName}?size=${size}&default=MHF_Steve`;

  const handleImageError = () => {
    setImageError(true);
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (imageError) {
    return (
      <div 
        className={`bg-muted rounded-lg border-2 border-border flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        data-testid="minecraft-avatar-fallback"
      >
        <User className="w-1/2 h-1/2 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {loading && (
        <div 
          className="absolute inset-0 bg-muted rounded-lg border-2 border-border flex items-center justify-center animate-pulse"
          data-testid="minecraft-avatar-loading"
        >
          <User className="w-1/2 h-1/2 text-muted-foreground" />
        </div>
      )}
      <img
        src={imageError ? fallbackUrl : avatarUrl}
        alt={`${playerName}'s Minecraft skin`}
        className="w-full h-full rounded-lg border-2 border-border object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: loading ? 'none' : 'block' }}
        data-testid="minecraft-avatar-image"
      />
    </div>
  );
}