import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import StepIndicator from "./StepIndicator";
import SignupStep1Email from "./SignupStep1Email";
import SignupStep2Password from "./SignupStep2Password";
import SignupStep3Verify from "./SignupStep3Verify";
import { FeedbackModal, FeedbackModalState } from "@/components/ui/feedback-modal";
import paytjekLogo from "@/assets/paytjek-logo.svg";
import * as demoAuth from "@/lib/demoAuth";

interface SignupWizardProps {
  variant?: "mobile" | "web";
  onSwitchToLogin: () => void;
}

const SignupWizard = ({ variant = "web", onSwitchToLogin }: SignupWizardProps) => {
  const navigate = useNavigate();
  const { basePath } = useDemo();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState<FeedbackModalState>("loading");
  const [modalMessage, setModalMessage] = useState("");

  const getRedirectPath = () => {
    return variant === "mobile" ? `${basePath}/home` : "/app/dashboard";
  };

  const handleSocialLogin = async (provider: string) => {
    setModalState("loading");
    setModalMessage(`Logger ind med ${provider}...`);
    setModalOpen(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Social signup er ikke tilgængelig
    setModalState("error");
    setModalMessage("Social login er ikke tilgængelig. Log ind med eksisterende konto.");

    setTimeout(() => {
      setModalOpen(false);
    }, 2500);
  };

  const handleStep1Continue = () => {
    setCurrentStep(1);
  };

  const handleStep2Continue = async () => {
    setModalState("loading");
    setModalMessage("Opretter din konto...");
    setModalOpen(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setModalOpen(false);
    setCurrentStep(2);
  };

  const handleVerify = async (code: string) => {
    setModalState("loading");
    setModalMessage("Verificerer kode...");
    setModalOpen(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Signup er ikke tilgængelig - kun eksisterende konti kan logge ind
    setModalState("error");
    setModalMessage("Kunne ikke verificere. Log ind med eksisterende konto.");
    
    setTimeout(() => {
      setModalOpen(false);
    }, 2500);
  };

  const handleResend = async () => {
    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <SignupStep1Email
            email={email}
            onEmailChange={setEmail}
            onContinue={handleStep1Continue}
            onSocialLogin={handleSocialLogin}
          />
        );
      case 1:
        return (
          <SignupStep2Password
            password={password}
            onPasswordChange={setPassword}
            onContinue={handleStep2Continue}
            onBack={() => setCurrentStep(0)}
            email={email}
          />
        );
      case 2:
        return (
          <SignupStep3Verify
            email={email}
            onVerify={handleVerify}
            onBack={() => setCurrentStep(1)}
            onResend={handleResend}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Logo - mobile only or when no branding sidebar */}
      <div className={variant === "web" ? "lg:hidden mb-4" : "mb-4"}>
        <img src={paytjekLogo} alt="PayTjek" className="h-10 w-auto" />
      </div>

      {/* Step Indicator */}
      <div className="mb-6">
        <StepIndicator currentStep={currentStep} totalSteps={3} />
      </div>

      {/* Form Container */}
      <div className="w-full bg-card rounded-3xl p-6 shadow-sm border border-border/50">
        {renderStep()}
      </div>

      {/* Login Link */}
      {currentStep === 0 && (
        <p className="text-muted-foreground text-sm mt-6">
          Har du allerede en konto?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary font-semibold hover:underline"
          >
            Log ind
          </button>
        </p>
      )}

      <FeedbackModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        state={modalState}
        message={modalMessage}
      />
    </div>
  );
};

export default SignupWizard;


