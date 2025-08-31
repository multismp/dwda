import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getTitle, getTitleIcon, generateRandomTiers } from "@/lib/auth";
import { X, Plus } from "lucide-react";
import type { Player } from "@/types/player";
import { categories } from "@/types/player";

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  player?: Player | null;
}

export default function PlayerModal({ isOpen, onClose, player }: PlayerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    points: 0,
    region: "NA",
  });

  const [playerTiers, setPlayerTiers] = useState<Record<string, string>>({});
  const [newTierCategory, setNewTierCategory] = useState<string>("");
  const [newTierValue, setNewTierValue] = useState<string>("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        points: player.points,
        region: player.region,
      });
      setPlayerTiers(player.tiers || {});
    } else {
      setFormData({
        name: "",
        points: 0,
        region: "NA",
      });
      setPlayerTiers({});
    }
    setNewTierCategory("");
    setNewTierValue("");
  }, [player, isOpen]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/players", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      onClose();
      toast({
        title: "Success",
        description: "Player added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add player",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/players/${player!.id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      onClose();
      toast({
        title: "Success",
        description: "Player updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update player",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || formData.points < 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    const playerData = {
      name: formData.name.trim(),
      points: formData.points,
      region: formData.region,
      title: getTitle(formData.points),
      titleIcon: getTitleIcon(formData.points),
      tiers: playerTiers,
    };

    if (player) {
      updateMutation.mutate(playerData);
    } else {
      createMutation.mutate(playerData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const tierOptions = ['HT1', 'HT2', 'HT3', 'HT4', 'HT5', 'LT1', 'LT2', 'LT3', 'LT4', 'LT5'];
  const availableCategories = Object.keys(categories).filter(cat => !playerTiers[cat]);

  const addTier = () => {
    if (newTierCategory && newTierValue) {
      setPlayerTiers(prev => ({
        ...prev,
        [newTierCategory]: newTierValue
      }));
      setNewTierCategory("");
      setNewTierValue("");
    }
  };

  const removeTier = (category: string) => {
    setPlayerTiers(prev => {
      const newTiers = { ...prev };
      delete newTiers[category];
      return newTiers;
    });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {player ? "Edit Player" : "Add Player"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="player-name" className="text-foreground">Player Name</Label>
            <Input
              id="player-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter player name"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-player-name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="player-points" className="text-foreground">Points</Label>
            <Input
              id="player-points"
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
              placeholder="Enter points"
              min="0"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-player-points"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="player-region" className="text-foreground">Region</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
              <SelectTrigger className="bg-input border-border focus:ring-ring" data-testid="select-player-region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="NA">North America</SelectItem>
                <SelectItem value="EU">Europe</SelectItem>
                <SelectItem value="AS">Asia</SelectItem>
                <SelectItem value="OCE">Oceania</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tier Management */}
          <div>
            <Label className="text-foreground">Tiers</Label>
            
            {/* Current Tiers */}
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted rounded-lg min-h-[60px]">
              {Object.entries(playerTiers).length > 0 ? (
                Object.entries(playerTiers).map(([category, tier]) => (
                  <Badge
                    key={category}
                    variant="outline"
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md tier-badge ${getTierColor(tier)}`}
                  >
                    <i className={`${getCategoryIcon(category)} text-xs`} />
                    <span className="text-xs font-medium">{tier}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTier(category)}
                      data-testid={`button-remove-tier-${category}`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tiers assigned</span>
              )}
            </div>
            
            {/* Add New Tier */}
            {availableCategories.length > 0 && (
              <div className="flex gap-2">
                <Select value={newTierCategory} onValueChange={setNewTierCategory}>
                  <SelectTrigger className="bg-input border-border focus:ring-ring flex-1" data-testid="select-tier-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {availableCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center space-x-2">
                          <i className={`${getCategoryIcon(cat)} text-xs`} />
                          <span>{categories[cat as keyof typeof categories].name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={newTierValue} onValueChange={setNewTierValue}>
                  <SelectTrigger className="bg-input border-border focus:ring-ring w-24" data-testid="select-tier-value">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {tierOptions.map(tier => (
                      <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addTier}
                  disabled={!newTierCategory || !newTierValue}
                  data-testid="button-add-tier"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 flex-1"
              data-testid="button-player-submit"
            >
              {isLoading ? "Saving..." : (player ? "Update Player" : "Add Player")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              data-testid="button-player-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
