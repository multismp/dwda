import { Button } from "@/components/ui/button";
import { Shield, Trophy, Server, Settings } from "lucide-react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/auth";
import { getConfig } from "@/lib/config";
import { useState, useEffect } from "react";

interface HeaderProps {
  isAdmin: boolean;
  onAdminClick: () => void;
  onLogout: () => void;
  onConfigClick: () => void;
}

export default function Header({ isAdmin, onAdminClick, onLogout, onConfigClick }: HeaderProps) {
  const [config, setConfig] = useState(getConfig());

  useEffect(() => {
    setConfig(getConfig());
  }, []);
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{config.siteName}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-secondary px-3 py-1 rounded-lg">
              <Server className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{config.serverIP}</span>
            </div>
            <Button
              onClick={onConfigClick}
              variant="outline"
              className="bg-secondary hover:bg-secondary/90"
              data-testid="button-config"
            >
              <Settings className="w-4 h-4 mr-2" />
              Config
            </Button>
            <Button
              onClick={isAdmin ? onLogout : onAdminClick}
              className={isAdmin ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
              data-testid={isAdmin ? "button-logout" : "button-admin-login"}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isAdmin ? 'Logout' : 'Admin'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
