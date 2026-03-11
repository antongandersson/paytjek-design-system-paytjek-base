import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  OnboardingPayslipUI,
  OnboardingCalendarUI,
  OnboardingErnestUI,
  OnboardingUnionUI
} from "@/components/onboarding/OnboardingUI";

interface OnboardingSlide {
  component: React.ReactNode;
  title: string;
  description: string;
}

const slides: OnboardingSlide[] = [
  {
    component: <OnboardingPayslipUI />,
    title: "Tjek din lønseddel",
    description: "Upload din lønseddel og få den analyseret automatisk. Vi finder fejl, så du får hvad du har ret til.",
  },
  {
    component: <OnboardingCalendarUI />,
    title: "Hold styr på dine vagter",
    description: "Synkroniser din arbejdskalender og sammenlign dine vagter med din lønseddel.",
  },
  {
    component: <OnboardingErnestUI />,
    title: "Spørg Ernest",
    description: "Vores AI-assistent forklarer din lønseddel og besvarer dine spørgsmål.",
  },
  {
    component: <OnboardingUnionUI />,
    title: "Send til fagforening",
    description: "Fundet fejl? Send sagen til din fagforening med ét tryk.",
  },
];

interface OnboardingProps {
  variant?: "mobile" | "web";
}

const Onboarding = ({ variant = "web" }: OnboardingProps) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const basePath = variant === "mobile" ? "/m" : "/app";

  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate(`${basePath}/auth`); // Goes to signup by default
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    navigate(`${basePath}/auth`); // Goes to signup by default
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <AuthLayout showBranding={false}>
      <div className="flex flex-col items-center min-h-[80vh] lg:min-h-0">
        {/* UI Component Container */}
        <div className="h-[280px] lg:h-[320px] w-full flex items-center justify-center mb-6">
          <div className="relative">
            {/* Background Blob for aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10" />
            {slides[currentSlide].component}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-center mb-3 animate-fade-in">
          {slides[currentSlide].title}
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-center text-base lg:text-lg leading-relaxed max-w-sm animate-fade-in delay-75">
          {slides[currentSlide].description}
        </p>

        {/* Bottom Section */}
        <div className="w-full mt-auto pt-8 lg:pt-12 space-y-6">
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2 rounded-full transition-all duration-300 ease-out ${
                  index === currentSlide
                    ? "bg-primary w-8"
                    : "bg-gray-200 w-2 hover:bg-gray-300"
                }`}
                aria-label={`Gå til slide ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <Button
            className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg shadow-primary/20"
            variant={isLastSlide ? "accent" : "default"}
            onClick={handleNext}
          >
            {isLastSlide ? (
              "Kom i gang"
            ) : (
              <>
                Næste
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {/* Skip Link */}
          {!isLastSlide && (
            <button
              onClick={handleSkip}
              className="w-full text-center text-muted-foreground hover:text-foreground font-medium text-sm transition-colors"
            >
              Spring over
            </button>
          )}
          
          {/* Spacer for skip link on last slide to keep button position stable */}
          {isLastSlide && <div className="h-5" />}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Onboarding;
