import { useState } from "react";
import { Bell, Moon, Shield, Smartphone, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function WebSettings() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      payslipReminder: true,
      errorAlerts: true,
    },
    appearance: {
      theme: "system",
      language: "da",
    },
    privacy: {
      analytics: true,
      marketing: false,
    },
  });

  const handleSave = () => {
    toast({
      title: "Indstillinger gemt",
      description: "Dine præferencer er blevet opdateret.",
    });
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">Indstillinger</h1>
            <p className="text-primary-foreground/80 mt-1">
              Tilpas din oplevelse med PayTjek
            </p>
          </div>
          
          <Button 
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
            onClick={handleSave}
          >
            Gem ændringer
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary">Notifikationer</h2>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications" className="font-bold">Email notifikationer</Label>
                <p className="text-sm text-muted-foreground">Modtag opdateringer via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.notifications.email}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, email: checked }
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications" className="font-bold">Push notifikationer</Label>
                <p className="text-sm text-muted-foreground">Modtag beskeder i browseren</p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.notifications.push}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, push: checked }
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payslip-reminder" className="font-bold">Lønseddel påmindelse</Label>
                <p className="text-sm text-muted-foreground">Bliv mindet om at tjekke din lønseddel</p>
              </div>
              <Switch
                id="payslip-reminder"
                checked={settings.notifications.payslipReminder}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, payslipReminder: checked }
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="error-alerts" className="font-bold">Fejl alarmer</Label>
                <p className="text-sm text-muted-foreground">Få besked når der findes fejl</p>
              </div>
              <Switch
                id="error-alerts"
                checked={settings.notifications.errorAlerts}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, errorAlerts: checked }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Appearance */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary">Udseende</h2>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold">Tema</Label>
                <p className="text-sm text-muted-foreground">Vælg mellem lyst, mørkt eller system</p>
              </div>
              <Select 
                value={settings.appearance.theme}
                onValueChange={(value) => 
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, theme: value }
                  })
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Lyst</SelectItem>
                  <SelectItem value="dark">Mørkt</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-bold">Sprog</Label>
                <p className="text-sm text-muted-foreground">Vælg dit foretrukne sprog</p>
              </div>
              <Select 
                value={settings.appearance.language}
                onValueChange={(value) => 
                  setSettings({
                    ...settings,
                    appearance: { ...settings.appearance, language: value }
                  })
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="da">🇩🇰 Dansk</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Privacy */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary">Privatliv</h2>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="font-bold">Anonyme analyser</Label>
                <p className="text-sm text-muted-foreground">Hjælp os med at forbedre appen</p>
              </div>
              <Switch
                id="analytics"
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, analytics: checked }
                  })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing" className="font-bold">Marketing kommunikation</Label>
                <p className="text-sm text-muted-foreground">Modtag tilbud og nyheder</p>
              </div>
              <Switch
                id="marketing"
                checked={settings.privacy.marketing}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings,
                    privacy: { ...settings.privacy, marketing: checked }
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* App Version Switcher */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-primary">App version</h2>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </div>
        
        <Card className="border-border/50">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Nuværende version</p>
                <p className="text-sm text-muted-foreground">Du bruger web-versionen</p>
              </div>
              <Button onClick={() => window.location.href = "/m"}>
                <Smartphone className="h-4 w-4 mr-2" />
                Skift til mobil
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
