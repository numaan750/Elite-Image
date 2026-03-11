import fetch from "node-fetch";
import FormData from "form-data";

const DASHSCOPE_API_URL =
  "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";
const buildPrompt = (
  featureType,
  selectedFeature,
  selectedStyle,
  finalNotes,
  selectedSky,
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
    Enhance: `You are a senior professional real estate photographer and photo retoucher with 15+ years of experience. Your task is PHOTO QUALITY ENHANCEMENT ONLY.

ENHANCEMENT FOCUS: "${feature}"
EDITING STYLE: "${style}"
STYLE DETAILS: ${styleDetail}

YOUR CORE MISSION:
Dramatically improve the overall photo quality while keeping every single element in its exact position. This is NOT a subtle edit — make a visible, professional improvement.

WHAT TO ENHANCE based on focus "${feature}":

If "Window Glow":
- Recover blown-out window areas using HDR exposure blending technique
- Add soft warm natural light radiating from window frames (golden/white glow)
- Balance interior darkness with exterior brightness (multi-zone exposure)
- Enhance light rays or ambient glow without looking artificial
- Deepen shadows around non-window areas for dramatic contrast

If "Color Grading":
- Apply cinematic color grading matching style: ${styleDetail}
- Adjust white balance, lift, gamma, gain per color channel
- Add color story: warm tones for cozy spaces, cool tones for modern/luxury
- Enhance saturation selectively (wood tones, greenery, textiles)
- Apply subtle vignette to draw focus to center

If "Shadow Alignment":
- Identify primary light source direction in the image
- Reconstruct shadows to match ONE consistent light direction
- Remove conflicting or harsh multiple shadow sources
- Add soft depth shadows under furniture to ground objects
- Improve shadow softness and falloff for photorealism

If "Edge Handling":
- Apply micro-contrast sharpening to all architectural edges
- Sharpen wall-to-ceiling transitions, door frames, window frames
- Crisp up furniture outlines and material textures
- Improve overall image clarity and detail resolution
- Apply local contrast enhancement (clarity/texture boost)

GLOBAL ENHANCEMENT ALWAYS APPLY:
- Boost overall depth: separate foreground, midground, background tones
- Enhance material textures: wood grain, fabric weave, tile grout, metal sheen
- Improve shadow depth for 3D dimensionality
- Increase micro-detail sharpness (8K-level detail extraction)
- Professional lens correction: fix barrel distortion, chromatic aberration
- Correct vertical/horizontal architectural lines (perspective correction)
- Dynamic range expansion: brighter highlights, deeper shadows with detail

STRICT RULES:
1. ZERO new objects added — not even reflections that weren't there
2. ZERO objects removed
3. ZERO position changes
4. ONLY improve: luminosity, color, depth, sharpness, texture detail, lighting quality
5. All walls, floors, ceilings, furniture stay 100% identical in shape and position
6. Result must look like a professional $5000 real estate photoshoot
7. Output must be photorealistic — no painterly, HDR-overdone, or artificial look

OUTPUT: A dramatically improved, magazine-quality real estate photograph that looks like it was shot by a top architectural photographer.`,
    // ==================== HDR ====================
    HDR: `You are a professional HDR photographer and image compositor.

YOUR TASK: ${
      selectedFeature && selectedFeature.includes(",")
        ? `Merge ALL of these ${selectedFeature.split(",").length} bracket-exposed images into ONE single perfectly blended HDR photograph.
    
BRACKET IMAGES PROVIDED:
${selectedFeature
  .split(",")
  .map((url, i) => `Image ${i + 1}: ${url}`)
  .join("\n")}

MERGE INSTRUCTIONS:
- Analyze all bracket images (underexposed, correctly exposed, overexposed)
- Extract shadow detail from brightest exposure
- Extract highlight detail from darkest exposure  
- Use middle exposure as the base tone
- Blend all exposures seamlessly into ONE output image
- Apply professional tone mapping for realistic HDR look
- OUTPUT: Exactly ONE merged HDR image`
        : `Apply HDR processing to this image.
HDR TECHNIQUE: "${selectedFeature}"
- If "Bracket Merge": Simulate multi-exposure bracket merge
- If "Tone Mapping": Apply professional tone mapping
- If "Highlight Fix": Recover blown-out highlights
- If "Shadow Lift": Lift dark shadow areas`
    }

STYLE: "${style}"
STYLE DETAILS: ${styleDetail}

STRICT RULES:
1. Output must be ONE single image
2. Natural, photorealistic HDR result - not overdone
3. Keep all architectural elements, furniture identical
4. Professional real estate quality output`,

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

      EXECUTION RULES – FOLLOW STRICTLY:
1. Detect ALL regions described above and process every region.
2. Remove ONLY the objects located inside those regions.
3. Do NOT modify, repaint, regenerate, or change the background in any way.
4. Do NOT change floor, walls, roof, sky, grass, driveway, textures, colors, lighting, brightness, or shadows.
5. Do NOT create new background elements.
6. Do NOT blur, smooth, or alter surrounding areas.
7. Do NOT remove or change anything outside the specified regions.
8. Keep the entire image identical to the original except that the objects inside the regions are removed.
9. Preserve the original image quality, colors, and details exactly as they are.
10. The final result must look exactly like the original image with only the selected objects removed.`
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
    "Virtual Staging": `You are the world's most skilled virtual staging artist specializing in ultra-photorealistic real estate interior photography. You have staged thousands of luxury real estate listings.

ROOM TYPE: "${feature}"
FURNITURE STYLE: "${style}"

YOUR MISSION:
Add beautifully staged ${style} furniture into this EMPTY room.

PHASE 1 — ARCHITECTURE LOCK (DO THIS FIRST):
Before placing any furniture, mentally map and LOCK every architectural element:
✓ Do Not Change Wall surfaces, colors, textures
✓ Do Not Change Floor material, pattern, color  
✓ Do Not Change Ceiling height, color, features
✓ Do Not Change Windows: size, position, frame, glass reflections
✓ Do Not Change Doors: position, style, hardware
✓ Do Not Change Baseboards, crown molding, columns
✓ Do Not Change Room dimensions and perspective
WARNING: Any alteration to the above = FAILED result

PHASE 2 — FURNITURE PLACEMENT for "${feature}":

Living Room: large sofa/sectional, rectangular coffee table, 2 side tables with table lamps, floor lamp in corner, TV console unit, area rug under furniture, 2-3 framed wall artworks, indoor plant (fiddle leaf or palm), decorative throw pillows and blanket, sheer curtains on windows

Bedroom: queen/king bed with upholstered headboard, 2 matching bedside tables, 2 bedside lamps, dresser with mirror, bench at foot of bed, window curtains, artwork above headboard, bedding with pillows and duvet, small indoor plant

Kitchen: 2-4 bar stools at island/counter, pendant lights above counter, fruit bowl or decorative tray on counter, small herb plants on windowsill, cookbook display, coffee machine or kettle as accent

Dining Room: rectangular dining table, 4-6 dining chairs, pendant chandelier centered above table, sideboard/buffet against wall, 2 framed artworks, table centerpiece (vase with flowers or candles), area rug under table

Bathroom: fluffy folded towels on rack, bath mat on floor, vanity accessories (soap dispenser, tray, candle), large mirror above vanity, small plant (snake plant or succulent), artwork on wall

Home Office: large L-shape or straight desk, ergonomic office chair, bookshelf with organized books, desk lamp, monitor/laptop, small plant, framed motivational art, desk organizer

Kids Room: single/bunk bed with colorful bedding, study desk with chair, 3-tier bookshelf with toys and books, colorful area rug, wall decals or growth chart, small storage baskets, fun ceiling pendant light

Study Room: large wooden desk, leather reading chair, wall-to-wall bookshelf filled with books, floor lamp next to chair, framed certificates on wall, globe or classic desk accessories, Persian area rug

PHASE 3 — STYLE EXECUTION for "${style}":
Modern: white/gray/black palette, chrome/matte black metal accents, handle-less cabinets, geometric forms, minimal decor
Contemporary: mixed warm neutrals, curved sofa forms, mixed metal finishes, statement pendant lights
Minimalist: 3-4 key furniture pieces only, white and warm beige palette, zero clutter, maximum open space
Scandinavian: light birch/ash wood, white and soft gray, sheepskin throws, hygge cozy feel, simple clean forms
Mid-Century Modern: walnut wood with tapered legs, mustard/teal/burnt orange accents, starburst clock, retro shapes
Industrial: dark metal frames, reclaimed wood tops, exposed brick aesthetic, Edison bulb pendants, leather seating
Traditional: mahogany/cherry wood, rolled-arm sofas, ornate patterns, classic table lamps with shades, rich jewel tones
Transitional: neutral sofa with wood frame, mix of modern and classic accessories, layered neutrals
Rustic: chunky natural wood, plaid/linen textiles, woven baskets, stone-effect accents, warm amber lighting
Bohemian: rattan furniture, layered colorful rugs, macrame wall hanging, lots of plants, eclectic cushion mix
Farmhouse: shiplap accent wall styling, distressed white wood, galvanized metal accents, linen fabrics, mason jar decor
Luxury/Glam: velvet upholstery in jewel tones, marble side tables, gold/brass hardware, fur throws, crystal pendants
Japandi: minimal natural wood, warm greige palette, wabi-sabi ceramics, linen fabrics, floor-level coffee table, bamboo
Vintage: antique wood furniture, persian rug, brass accessories, velvet upholstery, gallery wall of vintage prints
Art Deco: black and gold palette, geometric mirror, velvet seating, chevron patterns, bold angular forms

PHASE 4 — PHOTOREALISM REQUIREMENTS:
- Camera: DSLR Canon 5D Mark IV, 24mm wide-angle lens, f/8 aperture
- Lighting: Match EXACTLY the natural light direction coming from windows in original photo
- Shadows: Each furniture piece casts realistic soft shadow onto the floor
- Reflections: Glossy floors/surfaces show subtle furniture reflections
- Depth of field: Slight foreground softness, sharp midground focus
- Materials: Wood grain visible, fabric texture visible, metal specularity correct
- Scale: Every piece perfectly proportioned to room — no oversized/undersized items
- Perspective: All furniture aligned to room's vanishing points
- Resolution: 8K ultra-sharp interior photography quality

NEGATIVE RULES — NEVER DO:
✗ Do NOT change wall color or add wallpaper
✗ Do NOT change floor material or color
✗ Do NOT alter window size or position
✗ Do NOT change ceiling or add features
✗ Do NOT remove any original architectural elements
✗ No cartoon, illustration, CGI, 3D render, or painting look
✗ No floating furniture (all pieces must contact floor or wall)
✗ No wrong-scale furniture (must match room proportions)

FINAL OUTPUT: An absolutely photorealistic real estate listing photo with perfect ${style} staging that looks indistinguishable from a real professionally photographed and staged room. The architecture`,

    // ==================== DAY TO DUSK ====================
    "Day to Dusk": `Day to Dusk: You are a world-class professional real estate twilight photographer and digital artist.
DUSK TECHNIQUE: ${feature}
SELECTED SKY: ${selectedSky || style} 
SELECTED SKY STYLE: ${style}
SKY DETAILS: ${styleDetail}
MISSION:
Transform this daytime photo into a stunning professional twilight real estate shot that looks like it was captured by a $500/hour architectural photographer at the perfect golden hour.

SKY TRANSFORMATION — Apply based on SELECTED SKY: "${selectedSky || style}":

If "Clear Sky":
Replace sky with a vibrant, clear blue sky. Perfectly even tone, no clouds, bright and realistic daylight-to-dusk transition lighting.

If "Partly Cloudy Sky":
Replace with natural photorealistic partly cloudy twilight sky. White and gray fluffy clouds, soft dusk shadows, natural depth with varied cloud sizes.

If "Overcast Sky":
Replace with soft diffuse overcast dusk sky. Even gray-blue tones, subtle light variations, moody and calm atmosphere.

If "Sunset Sky":
Replace sky with dramatic warm sunset — rich orange/amber at horizon fading to deep gold, soft peach/pink clouds, warm glow reflecting on building facade and landscape.

If "Twilight / Dusk Sky":
Replace with classic blue hour twilight — deep cobalt blue to purple gradient, slight teal at horizon, no visible sun, cool professional twilight feel.

If "Dramatic Sky":
Replace with epic moody sky — dark volumetric clouds, high contrast, dramatic light rays breaking through, cinematic and powerful atmosphere.

If "Rainy Sky":
Replace with stormy gray-blue sky. Dark textured clouds, slight rain haze effect, dramatic storm lighting on building.

INTERIOR LIGHTS — MUST DO:
Turn ON all interior room lights visible through windows:
- Warm amber/golden light glowing from each window (2700K–3000K color temperature)
- Light should spill slightly onto exterior walls around windows
- Each window should glow uniquely (not identical flat brightness)
- Rooms further back should glow slightly dimmer
- If visible: kitchen pendant lights, chandeliers, table lamps all ON

EXTERIOR LIGHTING EFFECTS:
Add realistic exterior lighting:
- Pathway lights along walkway
- Landscape uplighting on trees and building corners
- Porch/entry light glow
- Garage lights if visible
- Pool glow if water feature exists

ATMOSPHERE ADJUSTMENT based on "${feature}":
If "Brighten Shadows": lift shadow areas to reveal detail.
If "Reduce Highlights": control window glow and bright areas.
If "Natural Light Boost": keep lighting subtle and realistic.
If "Warm Tone": emphasize warm amber color cast.
If "Smart Sharpening": keep architectural edges crisp.
If "Noise Reduction": smooth clean dusk sky without grain.

ENVIRONMENTAL ADJUSTMENTS:
- Reduce overall ambient brightness to evening levels
- Slight blue-purple tint in shadows
- Slightly darker grass and landscape
- Warm ambient reflection on building facade
- Driveway reflecting subtle sky color

STRICT ARCHITECTURE RULES:
Do NOT change building shape, roof, walls, doors, windows.
Do NOT change driveway, paths, fences, trees or shrubs.
ONLY change sky, lighting, color temperature and window illumination.

OUTPUT:
A breathtaking professional twilight real estate photo with a ${selectedSky || style} sky ready for MLS listing.`,

    // ==================== STRAIGHTEN ====================
    Straighten: `You are a professional architectural photo correction expert.

IMPORTANT:
Edit the provided image. Do NOT generate a new image.

PRIMARY TASK:
Correct camera tilt, perspective distortion, and misaligned objects.

OBJECT STRAIGHTENING RULES:

1. Make all vertical elements perfectly vertical:
- walls
- door frames
- window frames
- columns
- cabinets
- poles
- buildings

2. Make all horizontal elements perfectly horizontal:
- floors
- ceilings
- countertops
- roof lines
- tables
- shelves

3. Fix camera tilt or rotation so the scene is properly aligned.
4. Correct lens distortion and keystone distortion.
5. Straighten objects that appear slightly rotated.
6. Apply minimal crop if needed after correction.

STRICT LIMITS:
- Do NOT change colors
- Do NOT change lighting
- Do NOT enhance the image
- Do NOT add or remove objects
- Do NOT modify textures
- Do NOT change the background

FINAL RESULT:
The output must remain a realistic photograph identical to the original image, only geometrically corrected and properly aligned.`,

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

    // ==================== DIRECT EDIT ====================
    DirectEdit: `You are a professional photo editor. The user wants specific changes made to this image.

USER INSTRUCTION: "${feature}"

TASK: Apply exactly what the user has described above to this image.
- Make only the changes the user specified
- Keep everything else identical to the original
- Result must be photorealistic and professional
- Preserve original image quality and resolution`,
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
      selectedSky,
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
      selectedSky,
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
