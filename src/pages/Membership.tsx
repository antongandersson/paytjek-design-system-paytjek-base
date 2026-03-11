import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, Phone, Mail, MapPin } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { useUser } from "@/contexts/UserContext";
import hkLogo from "@/assets/hk-logo.png";
import foaLogo from "@/assets/foa-logo.png";

interface UnionInfo {
  logo: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  benefits: string[];
}

const UNION_INFO: Record<string, UnionInfo> = {
  HK: {
    logo: hkLogo,
    website: "https://www.hk.dk",
    phone: "7011 4545",
    email: "hk@hk.dk",
    address: "Weidekampsgade 8, 0900 København C",
    benefits: [
      "Ubegrænset løntjek af dine HK Handel lønsedler",
      "AI-analyse med Ernest — tilpasset butiksoverenskomsten",
      "Direkte kontakt til HK Handel ved lønfejl",
      "Vagtplan-synkronisering efter butiksoverenskomsten",
      "Historik over alle dine løntjek",
    ],
  },
  FOA: {
    logo: foaLogo,
    website: "https://www.foa.dk",
    phone: "+45 46 97 26 26",
    email: "kontakt@foa.dk",
    address: "Staunings Plads 1-3, 1790 København V",
    benefits: [
      "Ubegrænset løntjek af dine lønsedler",
      "AI-analyse med Ernest",
      "Direkte kontakt til FOA ved lønfejl",
      "Vagtplan-synkronisering",
      "Historik over alle dine løntjek",
    ],
  },
};

const FALLBACK_UNION: UnionInfo = {
  logo: hkLogo,
  website: "https://www.hk.dk",
  phone: "7011 4545",
  email: "hk@hk.dk",
  address: "Weidekampsgade 8, 0900 København C",
  benefits: [
    "Ubegrænset løntjek af dine lønsedler",
    "AI-analyse med Ernest",
    "Direkte kontakt til din fagforening ved lønfejl",
    "Vagtplan-synkronisering",
    "Historik over alle dine løntjek",
  ],
};

const Membership = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  const unionKey = user?.union ?? "HK";
  const unionInfo = UNION_INFO[unionKey] ?? FALLBACK_UNION;

  return (
    <MobileContainer>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Medlemskab</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-8 space-y-6 animate-fade-in">
        {/* Union Card */}
        <Card className="border-2 border-primary/20 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                {isLoading ? (
                  <div className="w-full h-full bg-muted rounded-lg animate-pulse" />
                ) : (
                  <img
                    src={unionInfo.logo}
                    alt={unionKey}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              <div>
                {isLoading ? (
                  <>
                    <div className="h-6 w-24 bg-muted rounded animate-pulse mb-1" />
                    <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-foreground">
                      {user?.union ?? "HK"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.unionFullName ?? "HK Handel"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Chip variant="success" size="sm">Aktivt medlemskab</Chip>
            </div>

            <div className="space-y-1 text-sm">
              {user?.memberSince && (
                <p className="text-muted-foreground">
                  Medlem siden{" "}
                  <span className="text-foreground font-medium">{user.memberSince}</span>
                </p>
              )}
              {user?.memberNumber && (
                <p className="text-muted-foreground">
                  Medlems-ID:{" "}
                  <span className="text-foreground font-medium">{user.memberNumber}</span>
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* PayTjek Benefits through Union */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            PayTjek gennem {user?.union ?? "HK"}
          </h3>
          <p className="text-sm text-muted-foreground">
            Som medlem af {user?.unionFullName ?? "HK Handel"} har du adgang til PayTjek med følgende fordele:
          </p>

          <Card>
            <CardContent className="p-4 space-y-3">
              {unionInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Union Contact */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            Kontakt {user?.union ?? "HK"}
          </h3>

          <Card>
            <CardContent className="p-0">
              <a
                href={`tel:${unionInfo.phone}`}
                className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Telefon</p>
                  <p className="text-sm text-muted-foreground">{unionInfo.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${unionInfo.email}`}
                className="flex items-center gap-3 p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{unionInfo.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Adresse</p>
                  <p className="text-sm text-muted-foreground">{unionInfo.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl gap-2"
            onClick={() => window.open(unionInfo.website, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Besøg {user?.union ?? "HK"}'s hjemmeside
          </Button>
        </div>
      </main>
    </MobileContainer>
  );
};

export default Membership;
