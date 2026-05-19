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

  const prompts = {
    Enhance: `Enhance this real estate photo to professional HD quality. Produce a sharp, crystal-clear, high-resolution result. Apply natural, balanced lighting throughout the interior — no overexposed windows, no glare, no blown-out highlights, no haze. Make the image bright and inviting but realistic. Preserve every object, texture, furniture piece, and architectural detail exactly as in the original. Do not add, remove, or alter any element. Output must be ultra-sharp, vibrant, and photo-realistic with zero blur or fading.`,
    "HDR": `Create ONE realistic HDR photo: balanced exposure, sharp details, 0% shine natural light, no fade, glow, or blur.`,
    "Grass Replacement": `Replace the grass area with ultra-realistic natural ${feature} lawn in ${style} style. The new grass must be perfectly sharp, lush, and photo-realistic — matching the original scene's lighting, color temperature, and grain exactly. Seamlessly blend edges. Preserve every other part of the image — buildings, pathways, sky, objects — completely unchanged and in full original HD quality. No blur, no CGI look, no new objects, no artifacts.`,
    "Object Removal": `Remove objects using feature="${feature}": only edit the selected regions. Erase everything inside them and seamlessly fill with matching surrounding background. Do not change anything outside the regions. Preserve original image quality, lighting, and details. No blur or new objects.`,
    "Sky Replacement": `Replace ONLY the sky area with "${feature}" sky in ${style} style. The replacement sky must be ultra-realistic, sharp, and seamlessly blended with the horizon and building edges. Match the sky's color temperature and lighting direction to the rest of the scene. Do not alter any non-sky area — all buildings, trees, ground, and objects must remain in full original HD quality, perfectly sharp and unchanged.`,
    "Virtual Staging": `Virtually stage this empty ${feature} room with ${style} style furniture and decor. Place realistic, proportionally correct furniture that matches the room's scale and architecture. Lighting, shadows, and reflections must be physically accurate and consistent with the existing room lighting. Keep all walls, floors, ceilings, windows, and architectural elements completely unchanged. The result must look like a professional real estate photograph — ultra-sharp, HD, and photo-realistic.`,
    "Day to Dusk": `Convert this daytime real estate photo to a stunning ${feature} dusk scene using ${selectedSky || style} sky. The sky must transition beautifully with warm golden and blue-hour tones. Interior lights should appear naturally lit and glowing. Keep the original building, landscaping, driveway, and all surrounding objects completely unchanged in structure and placement. Adjust only lighting and sky. The output must be ultra-sharp, HD, and photo-realistic — no blur, no haze, no artifacts.`,
    "Straighten": `Correct ultra-wide 0.5x lens distortion. Make all vertical and horizontal architectural lines perfectly straight and natural. Fix barrel distortion, fisheye effect, and perspective tilt so walls, doors, windows, and furniture edges appear perfectly aligned. Preserve every object, person, texture, and detail in the scene exactly as-is — do not remove or add anything. Output must be HD sharp with zero blur or quality loss.`,
    "Watermark Remove": `Remove all watermarks, logos, text overlays, and copyright marks from this image. Reconstruct the background seamlessly to match the original texture, color, lighting, and pattern underneath. The result must be completely clean and invisible — no ghost marks, no smearing, no blur. Do NOT change any other part of the image. Preserve full original HD quality everywhere outside the removed watermarks.`,
    DirectEdit: `Apply only this user instruction to the image: "${feature}". Do NOT change anything else in the image — keep all objects, colors, lighting, textures, and quality identical to the original. The result must be photo-realistic, ultra-sharp, and professional HD quality.`,
    // Enhance: `Enhance to professional HD. Natural balanced lighting, no overexposure/glare/haze. Bright, realistic. Preserve all objects and details exactly. Sharp, vibrant, zero blur.`,
    //   "HDR": `Create ONE realistic HDR photo: balanced exposure, sharp details, natural light, no fade/glow/blur.`,
    //   "Grass Replacement": `Replace grass with realistic ${feature} lawn, ${style} style. Match scene lighting and color. Blend edges seamlessly. Keep everything else unchanged. No blur or artifacts.`,
    //   "Object Removal": `Remove objects in selected regions (feature="${feature}"). Fill with matching background. Keep everything outside regions unchanged. Preserve quality, no blur.`,
    //   "Sky Replacement": `Replace only sky with "${feature}" sky, ${style} style. Blend seamlessly with horizon/buildings. Match lighting direction. Keep all non-sky areas unchanged and sharp.`,
    //   "Virtual Staging": `Stage this empty ${feature} room with ${style} furniture. Proportional, realistic placement matching room scale. Accurate lighting/shadows. Keep all architecture unchanged. Photo-realistic HD result.`,
    //   "Day to Dusk": `Convert to ${feature} dusk scene, ${selectedSky || style} sky. Warm golden/blue-hour tones. Natural interior glow. Keep building/landscape unchanged. Adjust only lighting and sky. Sharp, no artifacts.`,
    //   "Straighten": `Fix 0.5x ultra-wide lens distortion. Straighten all vertical/horizontal lines. Correct barrel/fisheye/perspective tilt. Preserve all content exactly. HD sharp, no quality loss.`,
    //   "Watermark Remove": `Remove all watermarks/logos/text overlays. Reconstruct background seamlessly matching original texture/color. Clean result, no ghost marks. Keep rest of image unchanged, HD quality.`,
    //   DirectEdit: `Apply this instruction: "${feature}". Change nothing else. Keep all objects, colors, lighting identical. Photo-realistic HD output.`,
  };

  let prompt =
    prompts[featureType] ||
    `Enhance this real estate photo to professional HD quality. Style: ${style}. Focus: ${feature}. Keep all original content intact. Output must be ultra-sharp, clear, and photo-realistic.`;

  if (finalNotes && finalNotes.trim()) {
    prompt += ` ADDITIONAL USER INSTRUCTIONS (apply these exactly, do not change anything else): ${finalNotes}`;
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
          "watermark, text, logo, blurry, low quality, distorted, overexposed, blown highlights, glare, haze, fog, washed out, faded, dull, flat, grainy, noisy, pixelated, artifacts, low resolution",
        watermark: false,
        prompt_extend: true,
        // size:"2048*2048",
        quality: "hd"
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

// Step 2 helper: Enhance any AI-generated image to HD quality
// This is a SEPARATE call — it does NOT change what the image contains,
// it only sharpens, removes blur/fade, and boosts to HD.
const enhanceImageHD = async (imageUrlOrBase64, apiKey) => {
  console.log("🔬 Step 2: Enhancing image to HD quality...");
  const enhancePrompt = `Enhance this image to ultra-sharp HD quality. Make every detail crystal-clear and high-resolution. Remove any blur, softness, haze, or fading. Make colors vibrant and natural. Do NOT add, remove, or change any object, furniture, wall, floor, sky, or element in the image — keep everything exactly the same. Only improve sharpness, clarity, and resolution. Output must be photo-realistic, ultra-sharp, and HD.`;
  // const enhancePrompt = `Enhance to ultra-sharp HD. Remove blur/softness/haze. Vibrant natural colors. Do NOT add/remove/change any element — only improve sharpness, clarity, resolution. Photo-realistic output.`;

  const imageEntry = imageUrlOrBase64.startsWith("http")
    ? { image: imageUrlOrBase64 }
    : { image: `data:image/png;base64,${imageUrlOrBase64}` };

  const response = await fetch(DASHSCOPE_API_URL, {
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
            content: [imageEntry, { text: enhancePrompt }],
          },
        ],
      },
      parameters: {
        negative_prompt:
          "watermark, text, logo, blurry, low quality, distorted, overexposed, blown highlights, glare, haze, fog, washed out, faded, dull, flat, grainy, noisy, pixelated, artifacts, low resolution, out of focus",
        watermark: false,
        // size:"2048*2048",
        quality: "hd"
      },
    }),
  });

  const data = await response.json();
  const outputContent = data?.output?.choices?.[0]?.message?.content;
  const imageContent = outputContent?.find((item) => item.image);

  if (!imageContent || !imageContent.image) {
    console.warn("⚠️ HD enhance step did not return image, using original");
    return null; // Return null so caller can fall back to original
  }

  console.log("✅ HD enhancement complete");
  return imageContent.image;
};

// Features that need HD enhancement as a second step
const NEEDS_HD_ENHANCE = ["HDR", "Object Removal"];

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
    const needsHDEnhance = NEEDS_HD_ENHANCE.includes(featureType);

    if (isHDR && Array.isArray(imageUrl) && imageUrl.length > 3) {
      console.log("⚡ Using multi-step HDR combine");

      const firstBatch = imageUrl.slice(0, 3);
      const remaining = imageUrl.slice(3);

      // STEP 1
      const firstResult = await callQwenCombine(firstBatch, prompt, apiKey);

      // STEP 2
      const secondImages = [firstResult, ...remaining].slice(0, 3);
      const finalResult = await callQwenCombine(secondImages, prompt, apiKey);

      // STEP 3: HD Enhancement
      let imageToUpload = finalResult;
      if (needsHDEnhance) {
        const hdImage = await enhanceImageHD(
          finalResult.startsWith("http") ? finalResult : finalResult,
          apiKey,
        );
        if (hdImage) imageToUpload = hdImage;
      }

      let processedImageUrl;

      if (imageToUpload.startsWith("http")) {
        const imgResponse = await fetch(imageToUpload);
        const imgBuffer = await imgResponse.buffer();
        const base64 = imgBuffer.toString("base64");
        processedImageUrl = await uploadBase64ToCloudinary(base64);
      } else {
        processedImageUrl = await uploadBase64ToCloudinary(imageToUpload);
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
          : featureType === "Straighten"
            ? process.env.DASHSCOPE_MODEL_STRAIGTEN
            : process.env.DASHSCOPE_MODEL,
        // model: process.env.DASHSCOPE_MODEL_HDR,
        input: {
          messages: [
            {
              role: "user",
              content: buildContentArray(),
            },
          ],
        },
        parameters: {
          negative_prompt:
            "watermark, text, logo, blurry, low quality, distorted, overexposed, blown highlights, window glare, haze, fog, washed out, faded, dull, flat, grainy, noisy, pixelated, artifacts, low resolution, out of focus, chromatic aberration",
          watermark: false,
          prompt_extend: true,
          // size:"2048*2048",
          quality: "hd"
        },
        // parameters: {
        //   negative_prompt: "watermark, text, logo, blurry, low quality, distorted",
        //   watermark: false,
        //   prompt_extend: true,
        // },
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

    // For HDR and Object Removal: run a second AI call to enhance to HD
    let finalImage = imageContent.image;
    if (needsHDEnhance) {
      console.log(`🔬 ${featureType}: Running HD enhancement step...`);
      const hdImage = await enhanceImageHD(finalImage, apiKey);
      if (hdImage) finalImage = hdImage;
    }

    let processedImageUrl;
    if (finalImage.startsWith("http")) {
      console.log("📎 Got image URL, uploading to Cloudinary...");

      const imgResponse = await fetch(finalImage);
      const imgBuffer = await imgResponse.buffer();
      const base64 = imgBuffer.toString("base64");
      processedImageUrl = await uploadBase64ToCloudinary(base64);
    } else {
      console.log("📎 Got base64, uploading to Cloudinary...");
      processedImageUrl = await uploadBase64ToCloudinary(finalImage);
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
