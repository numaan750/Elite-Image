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
  const style = selectedStyle || "";
  const feature = selectedFeature || "";

  const styleDetail = style.toLowerCase().includes("vibrant")
    ? "Use rich saturated colors, high contrast, deep tones, vivid and punchy look."
    : style.toLowerCase().includes("soft")
      ? "Use soft natural tones, gentle contrast, muted colors, realistic and calm look."
      : "Use balanced natural tones with clean professional look.";

  const prompts = {
    // ==================== ENHANCE ====================
    Enhance: `You are a professional real estate photo editor. Your ONLY job is to enhance the photo quality.

      ENHANCEMENT FOCUS: "${feature}"
      EDITING STYLE: "${style}"
      STYLE DETAILS: ${styleDetail}

      WHAT TO DO based on focus "${feature}":
      - If "Window Glow": Brighten window areas, add warm natural glow to glass, balance interior/exterior exposure
      - If "Color Grading": Apply professional color grading matching the style - ${styleDetail}
      - If "Shadow Alignment": Fix shadows, make them consistent with natural light direction, remove harsh shadows
      - If "Edge Handling": Sharpen edges of walls, furniture, architectural elements cleanly

      STRICT RULES:
      1. Do NOT add any new objects, furniture, or elements
      2. Do NOT remove any existing objects
      3. Do NOT move anything
      4. Only improve: brightness, contrast, color, sharpness, lighting quality
      5. Keep all architectural elements 100% identical
      6. Result must look photorealis       tic and professional`,

    // ==================== HDR ====================
    HDR: `You are a professional HDR photographer. Apply HDR processing to this real estate photo.

      HDR TECHNIQUE: "${feature}"
      STYLE: "${style}"
      STYLE DETAILS: ${styleDetail}

      WHAT TO DO based on technique "${feature}":
      - If "Bracket Merge": Simulate multi-exposure bracket merge, balance highlights and shadows perfectly
      - If "Tone Mapping": Apply professional tone mapping - compress dynamic range while keeping detail in both bright and dark areas
      - If "Highlight Fix": Recover blown-out highlights (sky, windows, bright walls), bring back detail
      - If "Shadow Lift": Lift dark shadow areas, reveal hidden details in dark zones while keeping highlights intact

      STYLE APPLICATION: ${styleDetail}

      STRICT RULES:
      1. Only change tonal values and HDR processing
      2. Do NOT add, remove, or move any objects
      3. Keep all furniture, architecture, landscaping identical
      4. Result must look like professional HDR real e      state photo`,

    // ==================== GRASS REPLACEMENT ====================
    "Grass Replacement": `You are a professional real estate photo retoucher specializing in lawn and grass editing.

      GRASS TASK: "${feature}"
      STYLE: "${style}"
      STYLE DETAILS: ${styleDetail}

      WHAT TO DO based on task "${feature}":
      - If "Lawn Renovation": Replace ALL dead, patchy, brown grass with fresh perfectly manicured lush green lawn
      - If "Overgrown Removal": Replace ALL overgrown wild tall grass with neatly trimmed uniform short green lawn
      - If "Driveway Cleanup": Remove and clean all grass/weeds growing along driveway edges, replace with neat green grass borders
      - If "Texture Matching": Replace existing grass with perfectly uniform consistent-texture lawn that matches property style
      - If "Season Change": Transform ALL grass to vibrant lush summer green - replace any dry, dead, brown, or yellow areas
      - If "Weed Reduction": Remove ALL visible weeds, dandelions, invasive plants from lawn, replace with clean weed-free uniform grass

      GRASS STYLE: ${styleDetail}

      ABSOLUTE RULES:
      1. ONLY modify pixels that are grass or lawn - nothing else at all
      2. Keep COMPLETELY UNCHANGED: buildings, roof, windows, doors, driveway, pathways, sidewalks, fences, trees, shrubs, flowers, sky, parked cars, people - every single non-grass pixel
      3. New grass edges must blend seamlessly with driveways, pathways, and building foundations
      4. Match original photo lighting direction and cast natural shadows on new grass
      5. Result must be 100% photorealistic
      6. Do NOT enhance or change colors outside grass areas
      7. Do NOT add any decorative elements not in original`,

    // ==================== OBJECT REMOVAL ====================
    "Object Removal": `You are an expert professional photo retoucher. Your task is SURGICAL OBJECT REMOVAL.

      ${
        feature && feature.includes("REGION")
          ? `USER HAS SELECTED SPECIFIC REGIONS TO REMOVE:
      
      ${feature}

      EXECUTION RULES - FOLLOW EXACTLY:
      1. Find and remove ONLY the objects inside each REGION described above
      2. Count the regions - remove ALL of them, not just one
      3. For each removed region, fill with seamless background:
         - If region is over grass/lawn: reconstruct with matching grass
         - If region is over wall: reconstruct with matching wall texture
         - If region is over floor: reconstruct with matching floor
         - If region is over sky: reconstruct with matching sky
         - If region is over driveway: reconstruct with matching driveway
      4. Blending must be PERFECT - no visible edges, no blur artifacts
      5. DO NOT remove or change ANYTHING outside the described regions
      6. DO NOT alter colors, brightness, or quality of non-selected areas
      7. Result must look like the removed objects were NEVER THERE`
          : feature && feature.includes("Selection")
            ? `${feature}
      
      EXECUTION RULES:
      1. Remove ONLY the content inside each described region
      2. Fill with seamless realistic background matching surroundings
      3. DO NOT touch anything outside specified regions
      4. Result must look completely natural`
            : `Remove all unwanted objects, clutter, and distracting elements visible in the photo. Fill removed areas with seamless realistic background. Keep all architectural and structural elements intact.`
      }`,

    // ==================== SKY REPLACEMENT ====================
    "Sky Replacement": `You are a professional real estate photographer specializing in sky replacement.

      SKY TYPE TO ADD: "${feature}"
      STYLE: "${style}"
      STYLE DETAILS: ${styleDetail}

      WHAT TO DO based on sky type "${feature}":
      - If "Clear Sky": Replace with a vibrant, clear blue sky, perfectly even tone, no clouds, bright and realistic lighting.
      - If "Partly Cloudy Sky": Replace with a natural, photorealistic partly cloudy sky; white fluffy clouds with realistic shapes, soft shadows, and natural depth; clouds should vary in size and density for realism.
      - If "Overcast Sky": Replace with a soft, diffuse overcast sky; even gray-white tones, subtle light variations, realistic cloud textures.
      - If "Sunset Sky": Replace with a dramatic, photorealistic warm sunset sky (orange, pink, purple); include natural light gradients and subtle cloud highlights reflecting sunset colors.
      - If "Twilight / Dusk Sky": Replace with deep blue to purple gradient twilight sky; include soft horizon glow, natural dim light effect on clouds if present.
      - If "Dramatic Sky": Replace with epic moody sky; volumetric light rays, dark clouds, high contrast, dramatic atmosphere, realistic cloud formations.
      - If "Rainy Sky": Replace with stormy gray sky; textured clouds, slight rain haze, subtle lighting to reflect storm conditions.

      STYLE APPLICATION: ${styleDetail}

      STRICT RULES:
      1. Replace ONLY the sky - identify sky region precisely.
      2. Create perfectly seamless edges at rooftops, trees, chimneys, antennas, and poles.
      3. Match the color temperature of the new sky with ground/building lighting for realism.
      4. If sunset/dusk sky: slightly adjust building and ground colors to reflect warm light.
      5. Keep COMPLETELY IDENTICAL: buildings, roofs, trees, lawns, driveways, cars, people — everything non-sky.
      6. Maintain original image sharpness, resolution, and perspective.
      7. Clouds must be realistic in shape, density, and lighting; avoid flat or artificial cloud textures.`,

    // ==================== VIRTUAL STAGING ====================
    "Virtual Staging": `You are a world-class professional virtual staging artist for real estate.

      ROOM TYPE: "${feature}"
      FURNITURE STYLE: "${style}"

      STAGING TASK: Add ${style} style furniture and decor to this empty ${feature}.

      FURNITURE TO ADD for "${feature}":
      - Living Room: sofa/sectional, coffee table, side tables, floor lamp, TV unit, area rug, wall art, decorative plants, throw pillows, curtains
      - Bedroom: bed with headboard, bedside tables, lamps, dresser, mirror, artwork, bedding, curtains, plants
      - Kitchen: bar stools, kitchen accessories on counter, hanging pendant lights, decorative items, small plants
      - Dining Room: dining table, dining chairs, pendant light above table, sideboard, artwork, table centerpiece
      - Bathroom: towels, bath mat, vanity accessories, mirror, small plant, decorative items
      - Home Office: desk, office chair, bookshelf, desk lamp, computer/monitor, books, small plants
      - Kids Room: bed, study desk, chair, bookshelf, toys, colorful rugs, wall art
      - Study Room: large desk, bookshelf filled with books, reading chair, floor lamp, framed certificates

      STYLE "${style}" DETAILS:
      - Modern Furniture: clean lines, neutral colors (white/gray/black), minimalist, metal accents
      - Contemporary: current trends, mixed materials, bold but clean
      - Minimalist: very minimal pieces, lots of white space, simple colors
      - Scandinavian: light wood, white walls, cozy textures, simple functional design
      - Mid-Century: retro 1950-60s style, tapered legs, warm wood tones, geometric patterns
      - Industrial: raw materials, metal + wood combination, exposed brick look, dark tones
      - Traditional: classic ornate furniture, rich wood tones, formal arrangement
      - Transitional: mix of traditional and modern, neutral palette, elegant
      - Rustic: natural wood, warm earth tones, cozy farmhouse feel
      - Bohemian: eclectic mix, colorful patterns, plants everywhere, layered textures
      - Farmhouse: shiplap, white with wood accents, vintage items, cozy feel
      - Luxury / Glam: gold accents, velvet upholstery, marble surfaces, crystal/glass elements
      - Japandi: Japanese + Scandinavian mix, natural materials, zen minimalism, beige/green tones
      - Vintage: antique furniture, aged finishes, retro accessories, warm patina
      - Art Deco: geometric patterns, gold and black, luxurious materials, bold symmetry

      STRICT RULES:
      1. Do NOT alter walls, floors, ceilings, windows, doors, or any fixed architectural feature
      2. Keep original room structure 100% identical
      3. Place furniture with correct perspective matching room's vanishing points
      4. Apply realistic shadows from existing room lighting
      5. All furniture must be properly scaled to room size
      6. Result must look like a professional real estate staging photo`,

    // ==================== DAY TO DUSK ====================
    "Day to Dusk": `You are a professional real estate twilight/dusk photographer.

      DUSK TECHNIQUE: "${feature}"
      STYLE: "${style}"
      STYLE DETAILS: ${styleDetail}

      TRANSFORMATION TASK: Convert this daytime exterior photo to a beautiful twilight/dusk shot.

      WHAT TO DO based on technique "${feature}":
      - If "Brighten Shadows": During dusk conversion, lift shadow areas to show detail in dark zones
      - If "Reduce Highlights": During dusk conversion, tone down bright highlights, prevent overexposure
      - If "Natural Light Boost": Create natural-looking dusk light, not overdone, realistic twilight
      - If "Warm Tone": Use warm orange-amber twilight palette, golden hour feel
      - If "Smart Sharpening": Apply sharpening to keep architectural details crisp during dusk conversion
      - If "Noise Reduction": Apply clean noise-free dusk effect

      DUSK CONVERSION STEPS:
      1. Replace sky with beautiful ${styleDetail.includes("vibrant") ? "rich saturated" : "natural balanced"} twilight sky - orange/pink/purple gradient near horizon, deep blue above
      2. Turn ON all visible interior lights through windows - warm amber/yellow glow
      3. Add exterior lighting effects: pathway lights, landscape spotlights, porch lights
      4. Darken overall ambient lighting to evening level
      5. Add slight blue-purple cast to shadows (natural dusk effect)

      STRICT RULES:
      1. Keep ALL architecture, landscaping, lawn, driveway 100% identical
      2. Only change: sky, lighting, overall color temperature
      3. Result must look like a real professional twilight photography shot`,

    // ==================== STRAIGHTEN ====================
    Straighten: `You are a professional architectural correction expert.

      PRIMARY TASK:
      Correct all tilted, rotated, leaning, curved, or distorted objects and lines in this image.

      OBJECT STRAIGHTENING RULES:
      1. Make all vertical elements perfectly vertical:
         - Walls
         - Door frames
         - Window frames
         - Columns
         - Cabinets
         - Poles
         - Buildings

      2. Make all horizontal elements perfectly horizontal:
         - Floors
         - Ceilings
         - Countertops
         - Roof lines
         - Tables
         - Shelves

      3. Fix camera tilt or rotation so the entire scene looks properly aligned.
      4. Correct lens distortion (barrel or pincushion distortion).
      5. Fix converging verticals (keystone distortion).
      6. If objects appear slightly rotated, straighten them naturally.
      7. Crop minimally if required after correction.

      STRICT LIMITS:
      - DO NOT change colors
      - DO NOT change brightness
      - DO NOT enhance anything
      - DO NOT add or remove objects
      - DO NOT change background
      - DO NOT modify textures
      - DO NOT blur or sharpen
      - ONLY fix geometry and alignment

      FINAL RESULT:
      Image must look identical to original but properly straight, aligned, and geometrically corrected.
      All objects remain exactly the same — only straightened.`,

    // ==================== WATERMARK REMOVE ====================
    "Watermark Remove": `You are an expert photo retoucher specializing in watermark and overlay removal.
      
      REMOVAL TASK: Remove all watermarks, text overlays, and logos from this image.

      WHAT TO REMOVE:
      - Text watermarks (any text overlay on the image)
      - Logo watermarks (brand logos, company mark      s)
      - Copyright notices (© symbols, copyright text)
      - Semi-transparent overlays (any translucent text/pattern)
      - Diagonal text patterns
      - Repeated watermark patterns across image

      RECONSTRUCTION METHOD:
      After removing each watermark:
      1. Analyze the background texture behind the watermark
      2. Reconstruct background seamlessly - match exact texture, color, pattern, and lighting
      3. If watermark is over grass: replace with matching grass texture
      4. If watermark is over sky: replace with matching sky gradient
      5. If watermark is over wall: replace with matching wall texture
      6. Reconstruction must be completely invisible

      STRICT RULES:
      1. Do NOT change, alter, or affect ANY non-watermark content
      2. Keep all architectural elements, furniture, landscaping exactly identical
      3. Do NOT change brightness, colors, contrast of non-watermark areas
      4. Maintain original image quality and resolution`,
  };

  let prompt =
    prompts[featureType] ||
    `Enhance this real estate photo professionally. Style: ${style}. Focus: ${feature}. Keep all original content intact.`;

  if (finalNotes && finalNotes.trim()) {
    prompt += `\n\nADDITIONAL USER INSTRUCTIONS (apply these on top of above): ${finalNotes}`;
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
