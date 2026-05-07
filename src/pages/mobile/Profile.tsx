import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useDemo } from "@/contexts/DemoContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function MobileProfile() {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  const { toast } = useToast();
  const { user, updateUser, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employer: "",
  });

  // Sync form data with user context when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        employer: user.employer || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        employer: formData.employer,
      });
      toast({
        title: "Profil opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme ændringer.",
        variant: "destructive",
      });
    }
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
        <h1 className="text-2xl font-bold text-foreground">Min Profil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src="" alt={formData.firstName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {formData.firstName?.[0] || ""}{formData.lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-bold mt-3">
          {formData.firstName} {formData.lastName}
        </h2>
        <p className="text-muted-foreground">{formData.employer}</p>
      </div>

      {/* Form */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Fornavn</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Efternavn</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employer">Arbejdsgiver</Label>
            <Input
              id="employer"
              value={formData.employer}
              onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Gem ændringer
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}





