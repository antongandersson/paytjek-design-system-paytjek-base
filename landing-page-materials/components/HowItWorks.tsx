/**
 * PayTjek Landing Page - "Sådan fungerer det" Section
 * 
 * Copy this component to your landing page project.
 * Requires: Tailwind CSS (or adapt classes to your CSS framework)
 * 
 * Usage:
 * <HowItWorks />
 */

import React from "react";

interface Step {
  number: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Hent appen",
    description: "Du kan finde appen på App Store og Google Play.",
  },
  {
    number: 2,
    title: "Upload din lønseddel",
    description: "Tag et foto eller upload PDF. Vi understøtter alle danske lønsystemer.",
  },
  {
    number: 3,
    title: "AI analyserer",
    description: "Vores AI tjekker grundløn, tillæg, og sammenligner med din vagtplan.",
  },
  {
    number: 4,
    title: "Se resultat & handling",
    description: "Se om du mangler penge. Send sagen til din fagforening med ét klik.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Kom nemt igang
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Sådan fungerer det
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Number Circle */}
                <div className="relative z-10 w-20 h-20 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <span className="text-2xl font-bold text-[#090cd2]">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 max-w-[200px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Alternative version with icons instead of numbers
 */

interface StepWithIcon {
  icon: string;
  title: string;
  description: string;
}

const stepsWithIcons: StepWithIcon[] = [
  {
    icon: "📱",
    title: "Hent appen",
    description: "Gratis på App Store og Google Play",
  },
  {
    icon: "📄",
    title: "Upload lønseddel",
    description: "Foto eller PDF - vi klarer resten",
  },
  {
    icon: "🤖",
    title: "AI analyserer",
    description: "30 sekunder til resultat",
  },
  {
    icon: "✅",
    title: "Handling",
    description: "Send til fagforening med ét klik",
  },
];

export function HowItWorksWithIcons() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#090cd2] uppercase tracking-wide mb-2">
            Simpelt og hurtigt
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            4 nemme trin
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stepsWithIcons.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-base font-bold text-gray-900 mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;


