import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Moon, Globe, Shield, LogOut } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import * as demoAuth from "@/lib/demoAuth";

export default function MobileSettings() {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    analytics: true,
  });

  const handleLogout = () => {
    demoAuth.logout();
    navigate(`${basePath}/welcome`);
  };

  return (
    <main className="px-4 py-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(`${basePath}/more`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Indstillinger</h1>
      </div>

      <div className="space-y-4">
        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-bold">Notifikationer</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push notifikationer</Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, notifications: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Moon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-bold">Udseende</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Mørkt tema</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, darkMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-bold">Privatliv</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics">Anonyme analyser</Label>
                <p className="text-xs text-muted-foreground">Hjælp os med at forbedre appen</p>
              </div>
              <Switch
                id="analytics"
                checked={settings.analytics}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, analytics: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Log ud
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}





