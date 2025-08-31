import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Plus, Box } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/auth";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import PlayerCard from "@/components/PlayerCard";
import AdminModal from "@/components/AdminModal";
import PlayerModal from "@/components/PlayerModal";
import ConfigModal from "@/components/ConfigModal";
import { getConfig } from "@/lib/config";
import type { Player, Category } from "@/types/player";

export default function Rankings() {
  const [isAdmin, setIsAdmin] = useState(isAdminAuthenticated());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCategory, setCurrentCategory] = useState<Category>("overall");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [config, setConfig] = useState(getConfig());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: players = [], isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (playerId: string) => {
      const res = await apiRequest("DELETE", `/api/players/${playerId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Success",
        description: "Player deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete player",
        variant: "destructive",
      });
    },
  });

  const filteredPlayers = useMemo(() => {
    if (!players) return [];
    
    return players
      .filter((player: Player) => {
        const matchesSearch = searchQuery === "" || 
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a: Player, b: Player) => b.points - a.points);
  }, [players, searchQuery, currentCategory]);

  const handleAdminLogin = () => {
    setIsAdminModalOpen(true);
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setAdminAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminAuthenticated(false);
    setIsPlayerModalOpen(false);
    setEditingPlayer(null);
    toast({
      title: "Logged out",
      description: "Admin session ended",
    });
  };

  const handleConfigClick = () => {
    setIsConfigModalOpen(true);
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setIsPlayerModalOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handleDeletePlayer = (playerId: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      deleteMutation.mutate(playerId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header isAdmin={isAdmin} onAdminClick={handleAdminLogin} onLogout={handleLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading players...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isAdmin={isAdmin} onAdminClick={handleAdminLogin} onLogout={handleLogout} onConfigClick={handleConfigClick} />
      <CategoryNav currentCategory={currentCategory} onCategoryChange={setCurrentCategory} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border pl-10 pr-4 py-2 w-full sm:w-80 focus:ring-ring"
              data-testid="input-search-players"
            />
          </div>
          {isAdmin && (
            <Button
              onClick={handleAddPlayer}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-add-player"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          )}
        </div>

        {/* Server Info Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                <Box className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{config.serverName}</h2>
                <p className="text-muted-foreground">Competitive Minecraft PvP Server</p>
              </div>
            </div>
            <Card className="bg-card px-6 py-3 rounded-lg border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Server IP</p>
                <p className="text-lg font-bold text-primary" data-testid="text-server-ip">{config.serverIP}</p>
              </div>
            </Card>
          </div>
        </Card>

        {/* Rankings Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid gap-6" data-testid="rankings-grid">
            {filteredPlayers.map((player: Player, index: number) => (
              <PlayerCard
                key={player.id}
                player={player}
                position={index + 1}
                isAdmin={isAdmin}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" data-testid="no-results">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No players found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </main>

      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <PlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => {
          setIsPlayerModalOpen(false);
          setEditingPlayer(null);
        }}
        player={editingPlayer}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}
