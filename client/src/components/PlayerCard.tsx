import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Crown } from "lucide-react";
import MinecraftAvatar from "@/components/MinecraftAvatar";
import type { Player } from "@/types/player";

interface PlayerCardProps {
  player: Player;
  position: number;
  isAdmin: boolean;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

export default function PlayerCard({ player, position, isAdmin, onEdit, onDelete }: PlayerCardProps) {
  const getRankClass = (pos: number) => {
    if (pos === 1) return 'rank-1';
    if (pos === 2) return 'rank-2';
    if (pos === 3) return 'rank-3';
    return 'bg-muted text-foreground';
  };


  const getTierColor = (tier: string) => {
    if (tier.startsWith('HT')) return 'bg-gradient-to-r from-primary/20 to-primary/30 text-primary border-primary/50';
    return 'bg-gradient-to-r from-accent/20 to-accent/30 text-accent border-accent/50';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      vanilla: 'fas fa-cube',
      uhc: 'fas fa-heart',
      pot: 'fas fa-flask',
      sword: 'fas fa-sword',
      axe: 'fas fa-hammer',
      mace: 'fas fa-gavel',
      smp: 'fas fa-mountain',
      nethop: 'fas fa-fire'
    };
    return icons[category] || 'fas fa-trophy';
  };

  return (
    <Card className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Ranking Position */}
          <div className="relative">
            <div className={`w-12 h-12 ${getRankClass(position)} rounded-xl flex items-center justify-center font-bold text-lg`}>
              {position}
            </div>
            {position <= 3 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-2 h-2 text-primary-foreground" />
              </div>
            )}
          </div>
          
          {/* Player Avatar */}
          <MinecraftAvatar 
            playerName={player.name} 
            size={64} 
            className="flex-shrink-0"
          />
          
          {/* Player Info */}
          <div>
            <h3 className="text-xl font-bold text-foreground" data-testid={`text-player-name-${player.id}`}>{player.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <i className={`${player.titleIcon} text-primary text-sm`} />
              <span className="text-sm font-medium text-primary" data-testid={`text-player-title-${player.id}`}>{player.title}</span>
              <span className="text-sm text-muted-foreground" data-testid={`text-player-points-${player.id}`}>({player.points} points)</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-4 h-3 rounded-sm ${player.region === 'NA' ? 'bg-blue-500' : player.region === 'EU' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-muted-foreground" data-testid={`text-player-region-${player.id}`}>{player.region}</span>
            </div>
          </div>
        </div>
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(player)}
              data-testid={`button-edit-player-${player.id}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(player.id)}
              data-testid={`button-delete-player-${player.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Tier Badges */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Tiers</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(player.tiers || {}).map(([category, tier]) => (
            <Badge
              key={category}
              variant="outline"
              className={`flex items-center space-x-1 px-2 py-1 rounded-md tier-badge ${getTierColor(tier)}`}
              data-testid={`badge-tier-${category}-${player.id}`}
            >
              <i className={`${getCategoryIcon(category)} text-xs`} />
              <span className="text-xs font-medium">{tier}</span>
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
