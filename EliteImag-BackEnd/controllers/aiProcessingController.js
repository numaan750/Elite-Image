import fetch from "node-fetch";
import FormData from "form-data";

const DASHSCOPE_API_URL =
  "https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

// Feature ke hisaab se prompt banao
const buildPrompt = (
  featureType,
  selectedFeature,
  selectedStyle,
  finalNotes,
) => {
  const prompts = {
    Enhance: `Enhance this real estate photo professionally. Apply ${selectedStyle || "vibrant"} editing style. Improve lighting, contrast, colors and sharpness. Make it look magazine-quality and photorealistic. Keep all architectural elements exactly the same.`,

    HDR: `Apply ${selectedStyle || "vibrant"} HDR processing to this real estate photo. Enhance dynamic range, improve shadow and highlight details, boost colors naturally. Make it look like a professional HDR real estate photograph.`,

    "Grass Replacement": `Replace the grass and lawn areas in this real estate photo with lush, healthy, perfectly green grass. Apply ${selectedStyle || "vibrant"} style. Keep all structures, pathways, driveways and non-grass elements exactly unchanged. Make it look natural and photorealistic.`,

    "Object Removal": `Remove any unwanted objects, clutter, vehicles, people, or distracting elements from this real estate photo. Fill the removed areas naturally and seamlessly with the surrounding background. Keep all important architectural and design elements intact. Make it look clean and professional.`,

    "Sky Replacement": `Replace the sky in this real estate photo with a beautiful ${selectedFeature || "clear blue"} sky. Apply ${selectedStyle || "vibrant"} edit style. Keep all buildings, trees, landscape and ground elements exactly the same. Only change the sky portion. Make it look photorealistic.`,

    "Virtual Staging": `Virtually stage this empty ${selectedFeature || "living room"} with beautiful ${selectedStyle || "modern"} style ${selectedStyle || "contemporary"} furniture. Add realistic furniture, decorations and accessories appropriate for the space. Keep walls, floors, windows, doors and architectural elements exactly unchanged. Make it look like a professional real estate photo.`,

    "Day to Dusk": `Transform this daytime real estate exterior photo into a beautiful ${selectedStyle || "vibrant"} dusk/twilight shot. Add warm sunset orange and purple sky lighting, turn on all interior lights visible through windows creating warm glow, add outdoor landscape lighting. Keep all architectural elements exactly the same. Make it look photorealistic.`,

    Straighten: `Straighten and correct the perspective of this real estate photo. Fix any lens distortion, make vertical lines perfectly vertical, horizontal lines perfectly horizontal. Remove any tilt or angle issues. Maintain the original composition and content. Make it look professionally shot.`,

    "Watermark Remove": `Remove any watermarks, text overlays, logos, or copyright marks from this real estate photo. Fill the removed areas naturally and seamlessly with the surrounding content. Keep the photo otherwise completely unchanged and make it look clean.`,
  };

  let prompt =
    prompts[featureType] ||
    `Enhance this real estate photo professionally with ${selectedStyle || "high quality"} processing.`;

  if (finalNotes && finalNotes.trim()) {
    prompt += ` Additional instructions: ${finalNotes}`;
  }

  return prompt;
};

// Base64 image ko Cloudinary pe upload karo
const uploadBase64ToCloudinary = async (base64Data) => {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "drh7q62eh";
  const UPLOAD_PRESET =
    process.env.CLOUDINARY_UPLOAD_PRESET || "unsigned_preset";

  // Base64 ko blob mein convert karo
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

// Main AI Processing Function
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

    // Qwen API call
    const qwenResponse = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-DashScope-Async": "disable",
      },
      body: JSON.stringify({
        model: "qwen-image-edit-plus-2025-12-15",
        input: {
          messages: [
            {
              role: "user",
              content: [
                {
                  image: imageUrl, // Cloudinary URL
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

    // Response se image extract karo
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

    // Image content dhundo
    const imageContent = outputContent.find((item) => item.image);

    if (!imageContent || !imageContent.image) {
      console.error("❌ No image in response:", JSON.stringify(outputContent));
      return res.status(500).json({
        message: "AI did not return an image",
        debug: outputContent,
      });
    }

    let processedImageUrl;

    // Image URL ya base64 handle karo
    if (imageContent.image.startsWith("http")) {
      // Direct URL mila — Cloudinary pe upload karo permanent link ke liye
      console.log("📎 Got image URL from Qwen, uploading to Cloudinary...");

      const imgResponse = await fetch(imageContent.image);
      const imgBuffer = await imgResponse.buffer();
      const base64 = imgBuffer.toString("base64");
      processedImageUrl = await uploadBase64ToCloudinary(base64);
    } else {
      // Base64 mila — Cloudinary pe upload karo
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
