"use client";

const ProgressBar = ({ currentStep, totalSteps }) => {
  if (!totalSteps || totalSteps === 0) {
    return null;
  }

  if (currentStep > totalSteps) {
    return null; 
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isPassed = stepNumber < currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <div
              className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-[#034F75] scale-110"
                  : isPassed
                  ? "bg-[#6FB6D6]"
                  : "bg-[#D3E7F0]"
              }`}
            />
            
            {stepNumber < totalSteps && (
              <div
                className={`h-[2px] sm:h-[3px] w-8 sm:w-10 lg:w-12 transition-all duration-300 ${
                  isPassed || isActive
                    ? "bg-[#034F75]"
                    : "bg-[#CFE8F2]"
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