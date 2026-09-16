"use client";

import type React from "react";
import { Warp } from "@paper-design/shaders-react";
import {
  Code2,
  ShieldCheck,
  Cloud,
  BrainCircuit,
  Palette,
  Database,
  Smartphone,
  Lightbulb,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ─── Logic Tech Services ──────────────────────────────────────────────────────

const services: ServiceCard[] = [
  {
    id: "s1",
    title: "Web Development",
    description:
      "Build fast, scalable web applications from design to deployment. React, Node.js, and everything in between.",
    icon: <Code2 className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s2",
    title: "Cybersecurity",
    description:
      "Protect your digital assets with comprehensive security audits, penetration testing, and zero-trust solutions.",
    icon: <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s3",
    title: "Cloud & DevOps",
    description:
      "Modernize your infrastructure with cloud migration, Kubernetes orchestration, and CI/CD pipelines.",
    icon: <Cloud className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s4",
    title: "Data Science & AI",
    description:
      "Extract value from your data with machine learning models and predictive analytics that drive decisions.",
    icon: <BrainCircuit className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s5",
    title: "UI/UX Design",
    description:
      "Design intuitive, delightful user experiences that convert and retain users across every touchpoint.",
    icon: <Palette className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s6",
    title: "Database Administration",
    description:
      "Ensure optimal database performance, security, and disaster recovery for PostgreSQL, MySQL, and more.",
    icon: <Database className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s7",
    title: "Mobile Development",
    description:
      "Build native and cross-platform mobile apps for iOS and Android that users love to use every day.",
    icon: <Smartphone className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
  {
    id: "s8",
    title: "IT Consulting",
    description:
      "Strategic technology consulting to align your IT investments with your business goals and growth plans.",
    icon: <Lightbulb className="w-10 h-10 text-white" strokeWidth={1.5} />,
  },
];

// ─── Per-card shader configs ──────────────────────────────────────────────────

const shaderConfigs = [
  {
    proportion: 0.3,
    softness: 0.8,
    distortion: 0.15,
    swirl: 0.6,
    swirlIterations: 8,
    shape: "checks" as const,
    shapeScale: 0.08,
    colors: ["hsl(260,100%,25%)", "hsl(220,100%,55%)", "hsl(200,90%,40%)", "hsl(240,100%,70%)"],
  },
  {
    proportion: 0.35,
    softness: 1.0,
    distortion: 0.18,
    swirl: 0.8,
    swirlIterations: 10,
    shape: "stripes" as const,
    shapeScale: 0.1,
    colors: ["hsl(340,100%,25%)", "hsl(10,100%,55%)", "hsl(30,90%,40%)", "hsl(350,100%,70%)"],
  },
  {
    proportion: 0.4,
    softness: 1.2,
    distortion: 0.2,
    swirl: 0.9,
    swirlIterations: 12,
    shape: "checks" as const,
    shapeScale: 0.09,
    colors: ["hsl(180,100%,20%)", "hsl(160,100%,50%)", "hsl(200,90%,35%)", "hsl(170,100%,65%)"],
  },
  {
    proportion: 0.38,
    softness: 0.95,
    distortion: 0.22,
    swirl: 0.75,
    swirlIterations: 11,
    shape: "stripes" as const,
    shapeScale: 0.11,
    colors: ["hsl(40,100%,25%)", "hsl(55,100%,55%)", "hsl(35,90%,40%)", "hsl(48,100%,70%)"],
  },
  {
    proportion: 0.32,
    softness: 0.9,
    distortion: 0.16,
    swirl: 0.7,
    swirlIterations: 9,
    shape: "checks" as const,
    shapeScale: 0.12,
    colors: ["hsl(290,100%,25%)", "hsl(310,100%,60%)", "hsl(280,90%,35%)", "hsl(300,100%,72%)"],
  },
  {
    proportion: 0.42,
    softness: 1.1,
    distortion: 0.19,
    swirl: 0.85,
    swirlIterations: 13,
    shape: "stripes" as const,
    shapeScale: 0.1,
    colors: ["hsl(150,100%,20%)", "hsl(130,100%,50%)", "hsl(170,90%,30%)", "hsl(140,100%,65%)"],
  },
  {
    proportion: 0.36,
    softness: 1.0,
    distortion: 0.17,
    swirl: 0.78,
    swirlIterations: 10,
    shape: "checks" as const,
    shapeScale: 0.08,
    colors: ["hsl(210,100%,25%)", "hsl(190,100%,55%)", "hsl(220,90%,40%)", "hsl(200,100%,68%)"],
  },
  {
    proportion: 0.44,
    softness: 0.85,
    distortion: 0.21,
    swirl: 0.65,
    swirlIterations: 14,
    shape: "stripes" as const,
    shapeScale: 0.13,
    colors: ["hsl(10,100%,28%)", "hsl(30,100%,60%)", "hsl(20,90%,38%)", "hsl(25,100%,72%)"],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeatureShaderCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {services.map((service, index) => {
        const cfg = shaderConfigs[index % shaderConfigs.length];
        return (
          <div key={service.id} className="relative h-72 group cursor-pointer">
            {/* Shader background */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <Warp
                style={{ height: "100%", width: "100%" }}
                proportion={cfg.proportion}
                softness={cfg.softness}
                distortion={cfg.distortion}
                swirl={cfg.swirl}
                swirlIterations={cfg.swirlIterations}
                shape={cfg.shape}
                shapeScale={cfg.shapeScale}
                scale={1}
                rotation={0}
                speed={0.6}
                colors={cfg.colors}
              />
            </div>

            {/* Card content */}
            <div className="relative z-10 p-6 rounded-2xl h-full flex flex-col bg-black/75 border border-white/10 group-hover:border-white/25 group-hover:bg-black/65 transition-all duration-300">
              <div className="mb-4 drop-shadow-lg">{service.icon}</div>

              <h3 className="text-lg font-semibold text-white mb-3 leading-snug">
                {service.title}
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed flex-grow">
                {service.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/60 group-hover:text-white/90 transition-colors duration-300">
                <span>Learn more</span>
                <svg
                  className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
