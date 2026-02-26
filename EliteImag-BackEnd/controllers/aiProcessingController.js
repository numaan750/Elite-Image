import fetch from "node-fetch";
import FormData from "form-data";

const DASHSCOPE_API_URL =
  "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const buildPrompt = (
  featureType,
  selectedFeature,
  selectedStyle,
  finalNotes,
) => {
  const prompts = {
    Enhance: `You are a professional real estate photo editor. Enhance this real estate photograph:
       - Enhancement focus: ${selectedFeature || "Overall Quality"}
       - Editing style: ${selectedStyle || "Vibrant"}
       - Apply ${selectedStyle === "Vibrant Edit" ? "rich saturated colors with high clarity" : "soft natural tones with gentle contrast"}
       - Focus on: ${selectedFeature || "overall image quality"}
       - CRITICAL: Do NOT add, remove, or move any objects, furniture, or architectural elements
       - CRITICAL: Keep ALL original content exactly as-is, only improve photo quality`,

    HDR: `You are a professional HDR photographer. Apply HDR processing:
       - HDR technique: ${selectedFeature || "Tone Mapping"}
       - Style: ${selectedStyle || "Vibrant"}
       - Apply ${selectedFeature || "tone mapping"} technique specifically
       - ${selectedStyle === "Vibrant Edit" ? "Use rich bold HDR tones with vivid colors" : "Use natural balanced HDR with subtle tonal enhancement"}
       - CRITICAL: Do NOT add, remove, or move any objects or structural elements
       - Only change tonal processing, keep all original content identical`,

    "Grass Replacement": (() => {
      const grassActions = {
        "Lawn Renovation":
          "Replace ALL grass areas with fresh perfectly manicured lush green grass. Remove all dead patches and bare spots.",
        "Overgrown Removal":
          "Replace ALL overgrown wild grass with neatly trimmed uniform short green lawn.",
        "Driveway Cleanup":
          "Clean all grass and weeds along driveway edges only. Replace surrounding lawn with neat green grass.",
        "Texture Matching":
          "Replace grass with perfectly uniform consistent-texture green lawn matching the property style.",
        "Season Change":
          "Transform ALL grass to vibrant lush summer green. Replace any dry dead brown grass.",
        "Weed Reduction":
          "Remove ALL visible weeds and invasive plants. Replace with clean uniform weed-free green grass.",
      };
      const styleDetails = {
        "Vibrant Edit":
          "Use rich saturated deep green tones with crisp sharp texture.",
        "Soft Edit":
          "Use natural slightly muted green tones with smooth realistic texture.",
      };
      const action =
        grassActions[selectedFeature] || grassActions["Lawn Renovation"];
      const styleDetail =
        styleDetails[selectedStyle] || styleDetails["Vibrant Edit"];
      return `You are a professional real estate photo retoucher specializing in grass replacement.
       TASK: ${action}
       STYLE: ${styleDetail}
       STRICT RULES:
       1. ONLY modify pixels that are grass or lawn - nothing else
       2. Keep COMPLETELY UNCHANGED: buildings, roof, windows, doors, driveway, pathways, fences, trees, shrubs, sky, cars - every non-grass element
       3. New grass edges must blend seamlessly with driveways and structures
       4. Match original photo lighting direction and shadows
       5. Result must look completely photorealistic
       6. Do NOT enhance or change any colors outside grass areas
       7. Do NOT add any new objects not in the original photo`;
    })(),

    "Object Removal": (() => {
      if (selectedFeature && selectedFeature.includes("Selection")) {
        return `You are an expert professional photo retoucher.
       ${selectedFeature}
       MANDATORY RULES:
       1. Remove ONLY the exact content inside each described region
       2. Fill each removed region with seamless background matching surrounding context
       3. Reconstruction must be invisible - matching exact texture color and lighting
       4. DO NOT touch anything outside the specified regions - not even 1 pixel
       5. DO NOT change brightness colors or quality of any other area
       6. Final result must look completely natural`;
      }
      return `Remove all unwanted objects clutter and distracting elements. Fill removed areas with realistic seamless background. Preserve all architectural elements.`;
    })(),

    "Sky Replacement": `You are a professional real estate photographer.
       TASK: Replace sky with: ${selectedFeature || "Clear Blue Sky"}
       STYLE: ${selectedStyle || "Vibrant"}
       - Replace ONLY the sky portion with beautiful high-resolution ${selectedFeature || "clear blue sky"}
       - ${selectedStyle === "Vibrant Edit" ? "Use rich deep saturated sky colors" : "Use natural soft sky tones"}
       - Create perfectly seamless edges at rooftops trees and horizon
       - Match color temperature of new sky with ground lighting
       CRITICAL DO NOT CHANGE: Buildings roof trees lawn driveway - ALL IDENTICAL. Maintain original sharpness.`,

    "Virtual Staging": `You are a professional virtual staging artist.
       TASK: Stage this empty ${selectedFeature || "Living Room"}
       FURNITURE STYLE: ${selectedStyle || "Modern Furniture"}
       - Add ${selectedStyle || "Modern"} style furniture appropriate for ${selectedFeature || "living room"}
       - Include sofa tables lamps rug wall art plants and accessories in ${selectedStyle || "modern"} style
       - Position furniture with correct perspective matching room vanishing points
       - Apply realistic shadows from existing room lighting
       CRITICAL: Do NOT alter walls floors ceilings windows doors or any fixed architectural feature. Keep original room exactly as-is.`,

    "Day to Dusk": `You are a professional real estate twilight photographer.
       TECHNIQUE: ${selectedFeature || "Warm Tone"}
       STYLE: ${selectedStyle || "Vibrant"}
       - Replace sky with ${selectedFeature === "Warm Tone" ? "warm orange pink purple sunset" : selectedFeature === "Cool Tone" ? "cool blue-purple twilight" : selectedFeature === "Golden Hour" ? "rich golden amber sky" : "dramatic dusk sky"}
       - Turn ON all interior lights visible through windows with warm amber glow
       - Add exterior pathway lights and landscape lighting effects
       - ${selectedStyle === "Vibrant Edit" ? "Use rich saturated twilight colors" : "Use natural balanced dusk tones"}
       CRITICAL KEEP IDENTICAL: All architecture landscaping lawn driveway - UNCHANGED. Only sky and lighting change.`,

    Straighten: `You are a professional architectural photographer.
       CORRECTIONS:
       1. Fix all lens barrel and pincushion distortion
       2. Make ALL vertical lines perfectly vertical
       3. Make ALL horizontal lines perfectly horizontal
       4. Correct camera tilt and straighten horizon
       5. Fix converging verticals keystoning effect
       CRITICAL: Do NOT add remove or change any content objects or colors. Only correct geometry - all visual content stays identical.`,

    "Watermark Remove": `You are an expert photo retoucher specializing in watermark removal.
      REMOVE ALL: text watermarks logos copyright notices semi-transparent overlays diagonal text patterns
      RECONSTRUCTION: After removing each watermark reconstruct background seamlessly matching exact texture color and lighting of surrounding area.
      CRITICAL: Do NOT change alter or affect ANY non-watermark content. Keep all architectural elements furniture landscaping exactly identical. Maintain original image quality and resolution.`,
  };

  let prompt =
    prompts[featureType] ||
    `Enhance this real estate photo professionally. Style: ${selectedStyle || "high quality"}. Focus: ${selectedFeature || "overall enhancement"}. Keep all original content intact.`;

  if (finalNotes && finalNotes.trim()) {
    prompt += `\n\nADDITIONAL INSTRUCTIONS: ${finalNotes}`;
  }

  return prompt;
};
const uploadBase64ToCloudinary = async (base64Data) => {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "drh7q62eh";
  const UPLOAD_PRESET =
    process.env.CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";
  const base64WithPrefix = `data:image/png;base64,${base64Data}`;

  const formData = new FormData();
  formData.append("file", base64WithPrefix);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudinary upload failed: ${error}`);
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return secure_url");
  }

  return data.secure_url;
};
export const processImageWithAI = async (req, res) => {
  try {
    const {
      imageUrl,
      featureType,
      selectedFeature,
      selectedStyle,
      finalNotes,
    } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL required" });
    }

    if (!featureType) {
      return res.status(400).json({ message: "Feature type required" });
    }

    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI API key not configured" });
    }

    console.log(`🤖 AI Processing: ${featureType} for image: ${imageUrl}`);

    const prompt = buildPrompt(
      featureType,
      selectedFeature,
      selectedStyle,
      finalNotes,
    );

    console.log(`📝 Prompt: ${prompt}`);
    const qwenResponse = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-DashScope-Async": "disable",
      },
      body: JSON.stringify({
        model: process.env.DASHSCOPE_MODEL,
        input: {
          messages: [
            {
              role: "user",
              content: [
                {
                  image: imageUrl,
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        parameters: {
          negative_prompt:
            "watermark, text, logo, blurry, low quality, distorted",
          watermark: false,
        },
      }),
    });

    console.log(`📡 Qwen API Response Status: ${qwenResponse.status}`);

    if (!qwenResponse.ok) {
      const errorText = await qwenResponse.text();
      console.error("❌ Qwen API Error:", errorText);
      return res.status(qwenResponse.status).json({
        message: `AI API error: ${errorText}`,
      });
    }

    const qwenData = await qwenResponse.json();
    console.log("✅ Qwen API Response received");
    const outputContent = qwenData?.output?.choices?.[0]?.message?.content;

    if (!outputContent || !Array.isArray(outputContent)) {
      console.error(
        "❌ Unexpected response structure:",
        JSON.stringify(qwenData),
      );
      return res.status(500).json({
        message: "Unexpected AI response format",
        debug: qwenData,
      });
    }
    const imageContent = outputContent.find((item) => item.image);

    if (!imageContent || !imageContent.image) {
      console.error("❌ No image in response:", JSON.stringify(outputContent));
      return res.status(500).json({
        message: "AI did not return an image",
        debug: outputContent,
      });
    }

    let processedImageUrl;
    if (imageContent.image.startsWith("http")) {
      console.log("📎 Got image URL from Qwen, uploading to Cloudinary...");

      const imgResponse = await fetch(imageContent.image);
      const imgBuffer = await imgResponse.buffer();
      const base64 = imgBuffer.toString("base64");
      processedImageUrl = await uploadBase64ToCloudinary(base64);
    } else {
      console.log("📎 Got base64 from Qwen, uploading to Cloudinary...");
      processedImageUrl = await uploadBase64ToCloudinary(imageContent.image);
    }

    console.log("✅ Final processed image URL:", processedImageUrl);

    res.status(200).json({
      success: true,
      processedImageUrl,
      prompt,
    });
  } catch (error) {
    console.error("❌ AI Processing error:", error);
    res.status(500).json({
      message: error.message || "AI processing failed",
    });
  }
};
