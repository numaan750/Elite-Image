import fetch from "node-fetch";
import FormData from "form-data";

const DASHSCOPE_API_URL =
  "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const HDR_MAX_IMAGES = 3;
const HDR_MIN_IMAGES = 2;
const buildPrompt = (
  featureType,
  selectedFeature,
  selectedStyle,
  finalNotes,
  selectedSky,
  selectedAreas,
) => {
  const style = selectedStyle || "";
  const feature = selectedFeature || "";

  // const styleDetail = style.toLowerCase().includes("vibrant")
  //   ? "Use rich saturated colors, high contrast, deep tones, vivid and punchy look."
  //   : style.toLowerCase().includes("soft")
  //     ? "Use soft natural tones, gentle contrast, muted colors, realistic and calm look."
  //     : "Use balanced natural tones with clean professional look.";

  const prompts = {
    Enhance: `Enhance real estate image: match professional real estate photography lighting, bright interior, 0% shine natural light.`,
    // Features: ${feature}. Style: ${style}.,
    "HDR": `Create ONE photorealistic HDR image by merging input images. Combine best elements naturally, keep correct perspective, avoid duplicates, and match professional real estate photography lighting, bright interior, 0% shine natural light.`,
    // using feature="${feature}"
    "Grass Replacement": `Edit grass only using feature="${feature}" & style="${style}": replace/improve lawn, match original lighting & texture, keep edges natural; do not change or touch any non-grass areas, no new objects, no blur, preserve original image quality.`,
    // "Object Removal": (() => {
    //   if (!selectedAreas || selectedAreas.length === 0) {
    //     return `Remove unwanted objects: only edit selected regions. Erase everything inside them and seamlessly fill with matching surrounding background. Preserve original image quality, lighting, and details. No blur or new objects.`;
    //   }
    //   const areaDescriptions = selectedAreas.map((area, idx) => {
    //     const xPct = Math.round(area.xPct || 0);
    //     const yPct = Math.round(area.yPct || 0);
    //     const wPct = Math.round(area.wPct || 0);
    //     const hPct = Math.round(area.hPct || 0);
    //     const centerXPct = Math.round(xPct + wPct / 2);
    //     const centerYPct = Math.round(yPct + hPct / 2);
    //     const vertPos = yPct < 33 ? "upper" : yPct > 66 ? "lower" : "middle";
    //     const horizPos = xPct < 33 ? "left" : xPct > 66 ? "right" : "center";
    //     return `REGION ${idx + 1}: Remove object at ${vertPos}-${horizPos} area. Starts ${xPct}% from left, ${yPct}% from top, covers ${wPct}% width and ${hPct}% height. Center: ${centerXPct}% from left, ${centerYPct}% from top.`;
    //   });
    //   return `PRECISE OBJECT REMOVAL - ${selectedAreas.length} REGION(s) to remove:\n\n${areaDescriptions.join("\n\n")}\n\nCRITICAL EXECUTION RULES:\n1. Remove ONLY the content inside each described REGION above - nothing else\n2. There are exactly ${selectedAreas.length} REGION(s) to remove - remove ALL of them\n3. Fill each removed region with seamless background matching surrounding area exactly\n4. Reconstruction must be completely invisible - match texture, color, lighting perfectly\n5. DO NOT remove, change, or affect ANYTHING outside the ${selectedAreas.length} specified region(s)\n6. Final result must look completely natural as if those objects were never there`;
    // })(),
    "Object Removal": `Remove ONLY the selected area(s), preserve original image quality, sharpness, lighting, and details; do not blur, alter, or change anything outside the selection.`,
    "Sky Replacement": `Replace ONLY sky with "${feature}" using style="${style}": match lighting & color with scene, keep edges natural; do not change any non-sky areas; ${style === "Vibrant" ? "boost saturation/contrast" : style === "Soft" ? "soft tones, lower contrast" : "natural balanced look"}.`,
    "Virtual Staging": `Stage the uploaded ${feature} with ${selectedStyle} (${style} style); keep the original room unchanged, realistic lighting & shadows, maintain scale.`,
    "Day to Dusk": `Convert daytime photo to ${feature} dusk; use ${selectedSky || style} sky and ${style} style; keep original building, surroundings, and objects unchanged; adjust lighting realistically.`,
    Straighten: `Correct this image geometry only: level the horizon, make vertical lines perfectly straight, fix lens distortion. No color or brightness changes.`,
    "Watermark Remove": `Remove all watermarks, logos, text overlays, and copyright marks from this image; reconstruct the background seamlessly to match original texture, color, and lighting; do NOT change any other part of the image or its quality.`,
    DirectEdit: `Apply only the user instruction: "${feature}" to this image. Do NOT change anything else; keep all objects, colors, lighting, and quality identical. Result must be realistic and professional.`,
  };

  let prompt =
    prompts[featureType] ||
    `Enhance this real estate photo professionally. Style: ${style}. Focus: ${feature}. Keep all original content intact.`;

  if (finalNotes && finalNotes.trim()) {
    prompt += `\n\nADDITIONAL USER INSTRUCTIONS (apply these on top of above): ${finalNotes}`;
  }

  return prompt;
};

const callQwenCombine = async (images, prompt, apiKey) => {
  const content = [...images.map((url) => ({ image: url })), { text: prompt }];

  const response = await fetch(DASHSCOPE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-DashScope-Async": "disable",
    },
    body: JSON.stringify({
      model: process.env.DASHSCOPE_MODEL_HDR,
      input: {
        messages: [
          {
            role: "user",
            content,
          },
        ],
      },
      parameters: {
        negative_prompt:
          "watermark, text, logo, blurry, low quality, distorted",
        watermark: false,
        prompt_extend: true,
      },
    }),
  });

  const data = await response.json();

  const outputContent = data?.output?.choices?.[0]?.message?.content;
  const imageContent = outputContent?.find((item) => item.image);

  if (!imageContent) {
    throw new Error("AI did not return an image");
  }

  return imageContent.image;
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
      selectedSky,
      selectedAreas,
    } = req.body;

    if (!imageUrl || (Array.isArray(imageUrl) && imageUrl.length === 0)) {
      return res.status(400).json({ message: "Image URL required" });
    }

    if (
      featureType === "HDR" &&
      Array.isArray(imageUrl) &&
      imageUrl.length > HDR_MAX_IMAGES
    ) {
      return res
        .status(400)
        .json({ message: `HDR supports maximum ${HDR_MAX_IMAGES} images` });
    }

    if (
      featureType === "HDR" &&
      Array.isArray(imageUrl) &&
      imageUrl.length < HDR_MIN_IMAGES
    ) {
      return res
        .status(400)
        .json({ message: `HDR requires minimum ${HDR_MIN_IMAGES} images` });
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
      selectedSky,
      selectedAreas,
    );

    console.log(`📝 Prompt: ${prompt}`);
    const isHDR = featureType === "HDR";
    if (isHDR && Array.isArray(imageUrl) && imageUrl.length > 3) {
      console.log("⚡ Using multi-step HDR combine");

      const firstBatch = imageUrl.slice(0, 3);
      const remaining = imageUrl.slice(3);

      // STEP 1
      const firstResult = await callQwenCombine(firstBatch, prompt, apiKey);

      // STEP 2
      const secondImages = [firstResult, ...remaining].slice(0, 3);
      const finalResult = await callQwenCombine(secondImages, prompt, apiKey);

      let processedImageUrl;

      if (finalResult.startsWith("http")) {
        const imgResponse = await fetch(finalResult);
        const imgBuffer = await imgResponse.buffer();
        const base64 = imgBuffer.toString("base64");
        processedImageUrl = await uploadBase64ToCloudinary(base64);
      } else {
        processedImageUrl = await uploadBase64ToCloudinary(finalResult);
      }

      return res.status(200).json({
        success: true,
        processedImageUrl,
        prompt,
      });
    }
    const hdrImages =
      isHDR && Array.isArray(imageUrl)
        ? imageUrl.slice(0, HDR_MAX_IMAGES)
        : imageUrl;
    const buildContentArray = () => {
      if (isHDR && Array.isArray(hdrImages)) {
        const imageItems = hdrImages.map((url) => ({ image: url }));
        return [...imageItems, { text: prompt }];
      }
      return [
        { image: Array.isArray(imageUrl) ? imageUrl[0] : imageUrl },
        { text: prompt },
      ];
    };

    const qwenResponse = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-DashScope-Async": "disable",
      },
      body: JSON.stringify({
        model: isHDR
          ? process.env.DASHSCOPE_MODEL_HDR
          : process.env.DASHSCOPE_MODEL,
        input: {
          messages: [
            {
              role: "user",
              content: buildContentArray(),
            },
          ],
        },
        parameters: isHDR
          ? {
            negative_prompt:
              "watermark, text, logo, blurry, low quality, distorted",
            watermark: false,
            prompt_extend: true,
          }
          : {
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

export const getHDRConfig = async (req, res) => {
  res.status(200).json({
    hdrMaxImages: HDR_MAX_IMAGES,
    hdrMinImages: HDR_MIN_IMAGES,
  });
};
