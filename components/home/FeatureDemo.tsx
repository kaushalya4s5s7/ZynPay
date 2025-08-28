"use client"

import { cn } from "@/lib/utils"
// Renamed 'Component' to 'FeatureCarousel' for clarity. Ensure this matches your file structure.
import { Component as FeatureCarousel } from "@/components/ui/FeatureCarousel"
import { Users, Settings, FileText, Send } from "lucide-react"

// Data for the payroll feature carousel - structured to match FeatureCarousel expectations
const payrollSteps = [
  {
    id: "1",
    name: "Step 1", 
    title: "Add Employees Globally",
    description:
      "Import your team from CSV or add them manually. Include role, salary, and location details for compliance.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
  },
  {
    id: "2", 
    name: "Step 2",
    title: "Define Payment Rules", 
    description:
      "Set up custom payment schedules, multiple currencies, and let the platform handle local compliance rules automatically.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  },
  {
    id: "3",
    name: "Step 3", 
    title: "Auto-Generate Payslips",
    description:
      "Complex tax calculations, deductions, and benefits are handled instantly. Generate and distribute compliant payslips for all countries.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
  },
  {
    id: "4",
    name: "Step 4",
    title: "1-Click Global Payouts", 
    description:
      "Fund your payroll and send payments to over 120 countries with a single click. No more manual bank transfers.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
  },
]

const GlobalPayrollFeatureCarousel = () => {
  // Since each step now uses a single image, we define a consistent class for it.
  // This class is based on the original step 3 & 4 styling for a single, prominent image.
  const singleImageClass = cn(
    "pointer-events-none w-[90%] border border-stone-100/10 dark:border-stone-700 rounded-t-[24px] transition-all duration-500 overflow-hidden",
    "left-[5%] top-[55%] md:top-[30%] md:left-[68px]",
    "md:group-hover:-translate-y-2" // Added a subtle hover effect for consistency
  )

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main heading outside the carousel */}
      <div className="text-center mb-8 mt-7 py-4">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
          How ZynPay Works?
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          From onboarding to payout, manage your international team in one seamless, compliant platform.
        </p>
      </div>
      
      <div className="rounded-[34px] bg-neutral-700 p-2">
        <div className="relative z-10 grid w-full gap-8 rounded-[28px] bg-neutral-950 p-2 md:p-4">
          <FeatureCarousel
            // Remove the title and description props since they're now outside
            title=""
            description=""
            
            // The following props are for styling the images within the carousel visualization.
            // We use the singleImageClass for all steps to ensure consistency.
            step1img1Class={singleImageClass}
            step1img2Class={singleImageClass}
            step2img1Class={singleImageClass}
            step2img2Class={singleImageClass}
            step3imgClass={singleImageClass}
            step4imgClass={singleImageClass}
            
            // The image object now sources URLs from our payrollSteps array.
            // All image slots are properly defined for the FeatureCarousel component.
            image={{
              step1light1: payrollSteps[0].image,
              step1light2: payrollSteps[0].image, // Reusing the same image for step1light2
              step2light1: payrollSteps[1].image,
              step2light2: payrollSteps[1].image, // Reusing the same image for step2light2
              step3light: payrollSteps[2].image,
              step4light: payrollSteps[3].image,
              alt: "Global Payroll Feature Demonstration",
            }}
            
            // Background styling remains the same
            bgClass="bg-gradient-to-tr from-neutral-900/90 to-neutral-800/90"
          />
        </div>
      </div>
    </div>
  )
}

export default GlobalPayrollFeatureCarousel