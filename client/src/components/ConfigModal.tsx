import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { loadConfig, saveConfig, type SiteConfig } from "@/lib/config";
import { Settings } from "lucide-react";

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [config, setConfig] = useState<SiteConfig>({
    serverIP: '',
    serverName: '',
    siteName: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const currentConfig = loadConfig();
      setConfig(currentConfig);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.serverIP.trim() || !config.serverName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    saveConfig(config);
    onClose();
    
    toast({
      title: "Success",
      description: "Configuration saved successfully",
    });
    
    // Refresh the page to apply changes
    window.location.reload();
  };

  const resetToDefaults = () => {
    setConfig({
      serverIP: 'mcpvp.club',
      serverName: 'PvP Club',
      siteName: 'StarTiers'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Website Configuration</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="server-ip" className="text-foreground">Server IP *</Label>
            <Input
              id="server-ip"
              type="text"
              value={config.serverIP}
              onChange={(e) => setConfig({ ...config, serverIP: e.target.value })}
              placeholder="Enter server IP"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-server-ip"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="server-name" className="text-foreground">Server Name *</Label>
            <Input
              id="server-name"
              type="text"
              value={config.serverName}
              onChange={(e) => setConfig({ ...config, serverName: e.target.value })}
              placeholder="Enter server name"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-server-name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="site-name" className="text-foreground">Site Name</Label>
            <Input
              id="site-name"
              type="text"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              placeholder="Enter site name"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-site-name"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 flex-1"
              data-testid="button-config-save"
            >
              Save Configuration
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={resetToDefaults}
              data-testid="button-config-reset"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-testid="button-config-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}