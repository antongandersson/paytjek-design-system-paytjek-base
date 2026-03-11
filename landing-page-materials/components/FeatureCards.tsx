/**
 * PayTjek Landing Page - Feature Cards Section
 * 
 * Copy this component to your landing page project.
 * Requires: 
 *   - Tailwind CSS
 *   - Mockup images in /public/mockups/ (download from /mockups route)
 * 
 * Usage:
 * <FeatureCards />
 */

import React from "react";

interface Feature {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  mockupImage: string;
  bgColor: string;
  borderColor: string;
}

const features: Feature[] = [
  {
    id: "lontjek",
    title: "Løntjek",
    description: "Upload din lønseddel og se om du får den løn du har krav på. Vores AI tjekker det hele på 30 sekunder.",
    shortDescription: "AI tjekker din løn på 30 sekunder",
    mockupImage: "/mockups/paytjek-mockup-report.png",
    bgColor: "bg-[#e8f4fc]",
    borderColor: "border-[#c5e3f5]",
  },
  {
    id: "vagtplan",
    title: "Vagtplan",
    description: "Synkroniser din vagtplan fra ProLøn, Planday eller din kalender. Vi matcher automatisk vagter med din løn.",
    shortDescription: "Sync vagter fra ProLøn, Planday m.fl.",
    mockupImage: "/mockups/paytjek-mockup-calendar.png",
    bgColor: "bg-[#f0fce8]",
    borderColor: "border-[#d4f0c5]",
  },
  {
    id: "ernest",
    title: "Ernest AI",
    description: "Spørg Ernest om alt der handler om løn. Han forklarer din lønseddel i et sprog du forstår.",
    shortDescription: "Din personlige løn-assistent",
    mockupImage: "/mockups/paytjek-mockup-ernest.png",
    bgColor: "bg-[#f0e8fc]",
    borderColor: "border-[#d9c5f5]",
  },
  {
    id: "arbejdsgiver",
    title: "Send til arbejdsgiver",
    description: "Fandt vi fejl? Send sagen direkte til din arbejdsgiver. Vi samler al dokumentation for dig.",
    shortDescription: "Send sag med ét klik",
    mockupImage: "/mockups/paytjek-mockup-success.png",
    bgColor: "bg-[#fce8f0]",
    borderColor: "border-[#f5c5d9]",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Udforsk PayTjek
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`
                ${feature.bgColor} ${feature.borderColor}
                rounded-3xl border p-8 
                transition-all duration-300 
                hover:shadow-lg hover:-translate-y-1
              `}
            >
              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>

              {/* Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative w-48 h-96 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={feature.mockupImage}
                    alt={`${feature.title} screenshot`}
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Alternative: 3-column layout (for 6 features)
 */
export function FeatureCardsCompact() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Alt du behøver
          </h2>
        </div>

        {/* Feature Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`
                ${feature.bgColor} ${feature.borderColor}
                rounded-2xl border p-6
                transition-all duration-300
                hover:shadow-lg hover:-translate-y-1
              `}
            >
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {feature.shortDescription}
              </p>

              {/* Smaller Phone Mockup */}
              <div className="flex justify-center">
                <div className="relative w-36 h-72">
                  <img
                    src={feature.mockupImage}
                    alt={`${feature.title} screenshot`}
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Alternative: Text only (no mockups)
 */
export function FeatureCardsTextOnly() {
  const icons: Record<string, string> = {
    lontjek: "📄",
    vagtplan: "📅",
    ernest: "🤖",
    arbejdsgiver: "📨",
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Features
          </h2>
        </div>

        {/* Feature List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex gap-4"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                {icons[feature.id]}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureCards;

