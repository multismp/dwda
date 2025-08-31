import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminModal({ isOpen, onClose, onSuccess }: AdminModalProps) {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await apiRequest("POST", "/api/auth/admin", { password });
      return res.json();
    },
    onSuccess: () => {
      onSuccess();
      onClose();
      setPassword("");
      toast({
        title: "Success",
        description: "Admin login successful",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      loginMutation.mutate(password);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin-password" className="text-foreground">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="bg-input border-border focus:ring-ring"
              data-testid="input-admin-password"
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="bg-primary hover:bg-primary/90 flex-1"
              data-testid="button-admin-submit"
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              data-testid="button-admin-cancel"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
