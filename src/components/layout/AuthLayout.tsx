import { ReactNode } from "react";
import paytjekLogo from "@/assets/paytjek-logo.svg";

interface AuthLayoutProps {
  children: ReactNode;
  showBranding?: boolean;
  accentColor?: string;
  unionLogo?: string;
  authFeatures?: [string, string, string];
}

/**
 * Responsive auth layout with split-screen design on desktop
 * - Desktop: Left branding panel + right content
 * - Mobile: Full-width centered content
 */
const AuthLayout = ({
  children,
  showBranding = true,
  accentColor,
  unionLogo,
  authFeatures,
}: AuthLayoutProps) => {
  const defaultFeatures: [string, string, string] = [
    "Automatisk tjek af din butiksløn",
    "Synkroniser vagter efter butiksoverenskomsten",
    "AI-rådgivning baseret på din overenskomst",
  ];
  const features = authFeatures ?? defaultFeatures;
  const panelBg = accentColor
    ? `linear-gradient(135deg, ${accentColor} 0%, color-mix(in srgb, ${accentColor} 80%, black) 100%)`
    : undefined;
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel - only visible on large screens */}
      {showBranding && (
        <div
          className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden"
          style={panelBg ? { background: panelBg } : undefined}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
            
            {/* Decorative circles */}
            <div className="absolute top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
            
            {/* Subtle pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-primary-foreground">
            {/* Union logo — eller PayTjek som fallback */}
            <div className="mb-10 flex flex-col items-center">
              <img
                src={unionLogo ?? paytjekLogo}
                alt={unionLogo ? "Fagforening" : "PayTjek"}
                className="h-14 w-auto object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Tagline */}
            <p className="text-xl font-light opacity-90 text-center max-w-xs">
              Din løn skal være korrekt — hver gang
            </p>

            {/* Divider */}
            <div className="w-12 h-px bg-white/30 my-10" />

            {/* Feature highlights */}
            <div className="space-y-6 w-full max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base font-light opacity-90">{features[0]}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-base font-light opacity-90">{features[1]}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <p className="text-base font-light opacity-90">{features[2]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Right content panel */}
      <div className={`flex-1 flex items-center justify-center p-6 ${showBranding ? '' : 'w-full'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;





