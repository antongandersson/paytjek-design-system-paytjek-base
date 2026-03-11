import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "Kim Jørgensen",
    email: "kim.jorgensen@email.dk",
    phone: "+45 12 34 56 78",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Ændringer gemt",
      description: "Din profil er blevet opdateret.",
    });
    
    setIsLoading(false);
  };

  return (
    <MobileContainer>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => navigate("/more")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Min Profil</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-8 animate-fade-in">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Fulde navn
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-muted border-0 rounded-xl h-12"
                placeholder="Dit navn"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-muted border-0 rounded-xl h-12"
                placeholder="din@email.dk"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                Telefonnummer
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="bg-muted border-0 rounded-xl h-12"
                placeholder="+45 12 34 56 78"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-4">
                Skift adgangskode
              </p>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Ny adgangskode
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-muted border-0 rounded-xl h-12"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Bekræft adgangskode
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="bg-muted border-0 rounded-xl h-12"
                placeholder="••••••••"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          className="w-full h-14 rounded-2xl mt-6 bg-primary text-primary-foreground font-bold text-base"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Gemmer..." : "Gem ændringer"}
        </Button>
      </main>
    </MobileContainer>
  );
};

export default Profile;
