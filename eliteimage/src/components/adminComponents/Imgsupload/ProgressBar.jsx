"use client";

const ProgressBar = ({ currentStep, totalSteps }) => {
  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPassed = stepNumber < currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Circle */}
            <div
              className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full transition-colors ${
                isActive
                  ? "bg-[#034F75]" // Current step - dark blue
                  : isPassed
                  ? "bg-[#6FB6D6]" // Completed step - medium blue
                  : "bg-[#D3E7F0]" // Upcoming step - light blue
              }`}
            />
            
            {/* Line (don't show after last step) */}
            {stepNumber < totalSteps && (
              <div
                className={`h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 transition-colors ${
                  isPassed
                    ? "bg-[#034F75]" // Completed - dark blue
                    : isActive
                    ? "bg-[#034F75]" // Current - dark blue
                    : "bg-[#CFE8F2]" // Upcoming - light blue
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;