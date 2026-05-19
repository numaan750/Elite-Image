"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * ✅ OPTIMIZED IMAGE COMPONENT
 * Automatically handles:
 * - Lazy loading
 * - Blur placeholder
 * - Quality optimization
 * - Size responsiveness
 */
export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = "",
  // quality = 75,
  objectFit = "cover",
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        // quality={quality}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,CiAgICA8c3ZnIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIvPgogICAgPC9zdmc+"
        onLoadingComplete={() => setIsLoading(false)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
        className={`object-${objectFit} transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
    </div>
  );
}
