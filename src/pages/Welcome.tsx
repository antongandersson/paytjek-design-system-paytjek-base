import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/layout/AuthLayout";
import paytjekLogo from "@/assets/paytjek-logo.svg";
import { useDemo } from "@/contexts/DemoContext";

interface WelcomeProps {
  variant?: "mobile" | "web";
}

const Welcome = ({ variant = "web" }: WelcomeProps) => {
  const navigate = useNavigate();
  const { demoConfig, basePath } = useDemo();

  const isCustomUnion = demoConfig.id !== "hk";

  return (
    <AuthLayout
      showBranding={variant === "web"}
      accentColor={isCustomUnion ? demoConfig.primaryColor : undefined}
      unionLogo={isCustomUnion ? demoConfig.logo : undefined}
      authFeatures={demoConfig.authFeatures}
    >
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className={variant === "web" ? "lg:hidden mb-8" : "mb-8"}>
          <img
            src={isCustomUnion ? demoConfig.logo : paytjekLogo}
            alt={isCustomUnion ? demoConfig.name : "PayTjek"}
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Single headline */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight max-w-sm">
          {demoConfig.welcomeHeadline}
        </h1>

        {/* CTA */}
        <div className="mt-10 w-full space-y-4">
          <Button
            className="w-full h-14 text-lg font-semibold rounded-xl"
            style={
              isCustomUnion
                ? {
                    backgroundColor: demoConfig.primaryColor,
                    borderColor: demoConfig.primaryColor,
                  }
                : undefined
            }
            onClick={() => navigate(`${basePath}/onboarding`)}
          >
            Kom i gang
          </Button>

          <p className="text-muted-foreground text-sm pt-2">
            Har du allerede en konto?{" "}
            <Link
              to={`${basePath}/auth?mode=login`}
              className="font-semibold hover:underline"
              style={{ color: isCustomUnion ? demoConfig.primaryColor : undefined }}
            >
              Log ind
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Welcome;
