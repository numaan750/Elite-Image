"use client";

import { useEffect } from "react";

/**
 * ✅ PERFORMANCE MONITORING
 * Tracks Core Web Vitals and logs in development
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Monitor Web Vitals
    if ("web-vital" in window) {
      const handleMetric = (metric) => {
        if (process.env.NODE_ENV === "development") {
          console.log(`${metric.name}: ${metric.value}ms`);
        }

        // Send to analytics service in production
        if (process.env.NODE_ENV === "production") {
          // Example: sendToAnalytics(metric);
        }
      };

      // Observe largest contentful paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "largest-contentful-paint") {
            const metric = {
              name: "LCP",
              value: entry.renderTime || entry.loadTime,
            };
            handleMetric(metric);
          }
        }
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure first contentful paint (FCP)
      const fcpEntries = performance.getEntriesByName("first-contentful-paint");
      if (fcpEntries.length > 0) {
        handleMetric({
          name: "FCP",
          value: fcpEntries[0].startTime,
        });
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
