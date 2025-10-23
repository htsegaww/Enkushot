import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { FiUpload, FiDownload, FiRefreshCw } from "react-icons/fi";
import { MdImage } from "react-icons/md";

const ImageConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [outputFormat, setOutputFormat] = useState("png");
  const [quality, setQuality] = useState(0.9);
  const [converting, setConverting] = useState(false);
  const [originalFormat, setOriginalFormat] = useState("");
  const [fileSize, setFileSize] = useState({ original: 0, converted: 0 });

  const formats = [
    { value: "png", label: "PNG", description: "Lossless, supports transparency" },
    { value: "jpeg", label: "JPEG", description: "Compressed, smaller file size" },
    { value: "webp", label: "WEBP", description: "Modern format, best compression" },
    { value: "bmp", label: "BMP", description: "Uncompressed bitmap" },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setOriginalFormat(file.type.split("/")[1].toUpperCase());
      setFileSize({ ...fileSize, original: file.size });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Reset converted image
      setConvertedUrl(null);
    } else {
      alert("Please select a valid image file");
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !previewUrl) return;
    
    setConverting(true);
    
    try {
      const img = new Image();
      img.src = previewUrl;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        
        // For formats that don't support transparency, fill with white background
        if (outputFormat === "jpeg" || outputFormat === "bmp") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob
        const mimeType = outputFormat === "jpeg" ? "image/jpeg" : 
                        outputFormat === "png" ? "image/png" :
                        outputFormat === "webp" ? "image/webp" :
                        "image/bmp";
        
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setFileSize({ ...fileSize, converted: blob.size });
            setConverting(false);
          },
          mimeType,
          quality
        );
      };
      
      img.onerror = () => {
        alert("Error loading image");
        setConverting(false);
      };
    } catch (error) {
      console.error("Conversion error:", error);
      alert("Error converting image");
      setConverting(false);
    }
  };

  const downloadImage = () => {
    if (!convertedUrl) return;
    
    const link = document.createElement("a");
    link.href = convertedUrl;
    const originalName = selectedFile.name.split(".")[0];
    link.download = `${originalName}_converted.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setOriginalFormat("");
    setFileSize({ original: 0, converted: 0 });
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Navbar />
      
      <div className="mt-20 px-4 py-16 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <MdImage className="text-white text-5xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Image Converter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your images between different formats - PNG, JPEG, WEBP, and BMP
          </p>
        </motion.div>

        {/* Main Converter Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiUpload className="text-emerald-600" />
              Upload Image
            </h2>
            
            {!previewUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="text-5xl text-emerald-500 mb-3" />
                  <p className="mb-2 text-sm text-gray-700 font-semibold">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPEG, WEBP, BMP (MAX. 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-gray-50"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {originalFormat}
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">File name:</span> {selectedFile?.name}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Size:</span> {formatBytes(fileSize.original)}
                  </p>
                </div>
                
                <button
                  onClick={resetConverter}
                  className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                >
                  <FiRefreshCw />
                  Choose Different Image
                </button>
              </div>
            )}
          </motion.div>

          {/* Conversion Settings & Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Conversion Settings
            </h2>
            
            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setOutputFormat(format.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      outputFormat === format.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="font-bold text-lg text-gray-800">
                      {format.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {format.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for JPEG and WEBP) */}
            {(outputFormat === "jpeg" || outputFormat === "webp") && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Lower size</span>
                  <span>Higher quality</span>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={convertImage}
              disabled={!previewUrl || converting}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                !previewUrl || converting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl"
              }`}
            >
              {converting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Converting...
                </>
              ) : (
                <>
                  <FiRefreshCw />
                  Convert Image
                </>
              )}
            </button>

            {/* Converted Image Preview */}
            <AnimatePresence>
              {convertedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Converted Result
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-300">
                    <img
                      src={convertedUrl}
                      alt="Converted"
                      className="w-full h-48 object-contain bg-gray-50"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {outputFormat.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-xl mt-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">New size:</span> {formatBytes(fileSize.converted)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-semibold">Difference:</span>{" "}
                      <span className={fileSize.converted < fileSize.original ? "text-green-600" : "text-red-600"}>
                        {fileSize.converted < fileSize.original ? "-" : "+"}
                        {formatBytes(Math.abs(fileSize.converted - fileSize.original))}
                        {" "}
                        ({Math.round(((fileSize.converted - fileSize.original) / fileSize.original) * 100)}%)
                      </span>
                    </p>
                  </div>
                  
                  <button
                    onClick={downloadImage}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl mt-4"
                  >
                    <FiDownload />
                    Download Converted Image
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Format Comparison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((format) => (
              <div key={format.value} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-lg text-emerald-600 mb-2">
                  {format.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {format.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ImageConverter;
