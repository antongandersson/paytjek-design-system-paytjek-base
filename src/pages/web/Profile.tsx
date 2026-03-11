import { useState, useEffect } from "react";
import { Camera, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

export default function WebProfile() {
  const { toast } = useToast();
  const { user, updateUser, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    employer: "",
    address: "",
    union: "",
    memberNumber: "",
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
        address: user.address || "",
        union: user.union || "",
        memberNumber: user.memberNumber || "",
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
        address: formData.address,
      });
      toast({
        title: "Profil opdateret",
        description: "Dine ændringer er blevet gemt.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Fejl",
        description: "Kunne ikke gemme ændringer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Blue Header Banner */}
      <div className="bg-primary px-6 py-8 -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 rounded-b-3xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-foreground">Min Profil</h1>
            <p className="text-primary-foreground/80 mt-1">
              Administrer dine personlige oplysninger
            </p>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
                onClick={() => setIsEditing(false)}
              >
                Annuller
              </Button>
              <Button 
                variant="secondary"
                className="bg-white hover:bg-white/90 text-primary border-0"
                onClick={handleSave}
              >
                Gem ændringer
              </Button>
            </div>
          ) : (
            <Button 
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0"
              onClick={() => setIsEditing(true)}
            >
              Rediger profil
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile Card */}
        <Card className="border-border/50 lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src="" alt={formData.firstName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {formData.firstName?.[0] || ""}{formData.lastName?.[0] || ""}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <h2 className="text-xl font-bold mt-4">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-muted-foreground">{formData.employer}</p>
            
            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-sm">{formData.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Telefon</span>
                <span className="font-medium text-sm">{formData.phone}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-muted-foreground">Fagforening</span>
                <span className="font-medium text-sm">{formData.union}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Personlige oplysninger</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Fornavn</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Efternavn</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Arbejdsgiver & Fagforening</h2>
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
            
            <Card className="border-border/50">
              <CardContent className="p-4 md:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer">Arbejdsgiver</Label>
                    <Input
                      id="employer"
                      value={formData.employer}
                      onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="union">Fagforening</Label>
                    <Input
                      id="union"
                      value={formData.union}
                      onChange={(e) => setFormData({ ...formData, union: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberNumber">Medlemsnummer</Label>
                  <Input
                    id="memberNumber"
                    value={formData.memberNumber}
                    onChange={(e) => setFormData({ ...formData, memberNumber: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
