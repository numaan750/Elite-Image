"use client";
import React, { useState, useEffect } from "react";
import { X, Copy, Check, Download, Facebook, Twitter, Linkedin, Mail, Link2, ExternalLink } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import Image from "next/image";

const ShareModal = ({ isOpen, onClose, formData }) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isPreparingZip, setIsPreparingZip] = useState(false);

  const processedData =
    formData?.beforeAfterData && formData.beforeAfterData.length > 0
      ? formData.beforeAfterData
      : formData?.uploadedImages?.map((img) => ({ processedImage: img })) || [];

  const isSingleImage = processedData.length === 1;
  const singleImageUrl = isSingleImage ? processedData[0]?.processedImage : null;

  // Share link: single image -> direct URL, multiple -> first image URL (ya tum apna backend link use kar sako)
  useEffect(() => {
    if (isSingleImage && singleImageUrl) {
      setShareLink(singleImageUrl);
    } else if (processedData.length > 1) {
      // Multiple images ke liye pehli image ka link ya custom page link
      setShareLink(processedData[0]?.processedImage || "");
    }
  }, [formData]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  const handleDownloadForShare = async () => {
    if (isSingleImage) {
      // Single image seedha download
      try {
        toast.loading("Preparing image...", { id: "share-download" });
        const response = await fetch(singleImageUrl);
        const blob = await response.blob();
        saveAs(blob, "elite-image-share.jpg");
        toast.success("Image ready!", { id: "share-download" });
      } catch {
        toast.error("Download failed", { id: "share-download" });
      }
    } else {
      // Multiple -> ZIP
      setIsPreparingZip(true);
      toast.loading("Creating ZIP for sharing...", { id: "share-zip" });
      try {
        const zip = new JSZip();
        const folder = zip.folder("Elite-Image-AI-Share");
        for (let i = 0; i < processedData.length; i++) {
          const response = await fetch(processedData[i].processedImage);
          const blob = await response.blob();
          folder.file(`elite-image-${i + 1}.jpg`, blob);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "Elite-Image-AI-Share.zip");
        toast.success("ZIP ready for sharing!", { id: "share-zip" });
      } catch {
        toast.error("ZIP creation failed", { id: "share-zip" });
      } finally {
        setIsPreparingZip(false);
      }
    }
  };

  // Social media share functions
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Check out my AI enhanced image: ${shareLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(shareLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out my AI enhanced image! 🎨✨`);
    const url = encodeURIComponent(shareLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(shareLink);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Check out my AI enhanced image!");
    const body = encodeURIComponent(`I used Elite Image AI to enhance this image. Check it out: ${shareLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Elite Image AI",
          text: "Check out my AI enhanced image!",
          url: shareLink,
        });
      } catch (err) {
        if (err.name !== "AbortError") toast.error("Share failed");
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Share Image{processedData.length > 1 ? "s" : ""}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="p-5">
          {isSingleImage ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-5">
              <Image
                src={singleImageUrl}
                alt="Share preview"
                fill
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-[#034F75] text-white text-xs px-2 py-1 rounded">
                1 image
              </div>
            </div>
          ) : (
            <div className="mb-5">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {processedData.slice(0, 3).map((data, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={data.processedImage}
                      alt={`Image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    {i === 2 && processedData.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">+{processedData.length - 3}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 text-center">
                {processedData.length} images will be shared as ZIP
              </p>
            </div>
          )}

          {/* Download for sharing */}
          <button
            onClick={handleDownloadForShare}
            disabled={isPreparingZip}
            className="w-full flex items-center justify-center gap-2 bg-[#034F75] text-white py-2.5 rounded-xl mb-5 hover:bg-[#023d5c] transition-colors font-medium"
          >
            <Download size={18} />
            {isSingleImage
              ? "Download Image to Share"
              : isPreparingZip
              ? "Preparing ZIP..."
              : `Download ZIP (${processedData.length} images)`}
          </button>

          {/* Link Copy */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Link2 size={14} />
              {isSingleImage ? "Image Link" : "Share Link"}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-600 truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-[#034F75] text-white hover:bg-[#023d5c]"
                }`}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Share on Social Media</p>
            <div className="grid grid-cols-5 gap-2">
              {/* WhatsApp */}
              <button
                onClick={shareOnWhatsApp}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IoLogoWhatsapp size={22} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-500">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareOnFacebook}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook size={20} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-500">Facebook</span>
              </button>

              {/* Twitter/X */}
              <button
                onClick={shareOnTwitter}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter size={18} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-500">Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={shareOnLinkedIn}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin size={18} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-500">LinkedIn</span>
              </button>

              {/* Email */}
              <button
                onClick={shareViaEmail}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full bg-[#EA4335] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={18} className="text-white" />
                </div>
                <span className="text-[10px] text-gray-500">Email</span>
              </button>
            </div>

            {/* Native Share (mobile) */}
            <button
              onClick={handleNativeShare}
              className="w-full mt-3 flex items-center justify-center gap-2 border border-[#034F75] text-[#034F75] py-2.5 rounded-xl hover:bg-[#D3E7F0] transition-colors text-sm font-medium"
            >
              <ExternalLink size={16} />
              More sharing options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;