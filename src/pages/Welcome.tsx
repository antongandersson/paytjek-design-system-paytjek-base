import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import hkLogo from "@/assets/hk-logo.png";

interface WelcomeProps {
  variant?: "mobile" | "web";
}

const Welcome = ({ variant = "web" }: WelcomeProps) => {
  const navigate = useNavigate();
  const basePath = variant === "mobile" ? "/m" : "/app";

  return (
    <AuthLayout showBranding={variant === "web"}>
      <div className="flex flex-col items-center text-center">
        {/* HK Logo — kun synlig på mobil (desktop har det i venstre panel) */}
        <div className={variant === "web" ? "lg:hidden mb-8" : "mb-8"}>
          <img
            src={hkLogo}
            alt="HK Handel"
            className="h-16 w-auto mix-blend-multiply"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          HK Handel
        </h1>

        {/* Tagline */}
        <p className="text-primary text-xl lg:text-2xl font-semibold mt-2">
          Din løn skal være korrekt
        </p>

        {/* Description */}
        {variant === "web" && (
          <p className="hidden lg:block text-muted-foreground mt-4 max-w-sm text-base font-light">
            Skræddersyet til dig der arbejder i handel og kontor. Upload din lønseddel og få det tjekket med det samme.
          </p>
        )}

        {/* CTA Section */}
        <div className="mt-12 w-full space-y-4">
          <p className="text-foreground font-medium text-lg">
            Er din løn fra butikken korrekt?
          </p>

          <Button
            className="w-full h-14 text-lg font-semibold rounded-xl"
            onClick={() => navigate(`${basePath}/onboarding`)}
          >
            Tjek din lønseddel nu
          </Button>

          <p className="text-muted-foreground text-sm pt-2">
            Har du allerede en konto?{" "}
            <Link to={`${basePath}/auth?mode=login`} className="text-primary font-semibold hover:underline">
              Log ind
            </Link>
          </p>
        </div>

        {/* Trust indicators — desktop only */}
        {variant === "web" && (
          <div className="hidden lg:flex items-center gap-6 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Inkluderet i dit HK-medlemskab</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>100% sikker</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI-drevet analyse</span>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Welcome;
