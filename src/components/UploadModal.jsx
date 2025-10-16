import React, { useEffect, useRef, useState } from "react";
import useStorage from "../hooks/useStorage";

const UploadModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { progress, url, error } = useStorage(uploading ? file : null, { firstName });

  useEffect(() => {
    if (url) {
      setUploading(false);
      setFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      onClose && onClose();
    }
  }, [url, onClose, previewUrl]);

  useEffect(() => {
    if (error) {
      console.error("upload error:", error);
      setUploading(false);
    }
  }, [error]);

  const handleChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setFile(f);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(f));
  };

  // debug UI removed per user request

  const startUpload = () => {
    if (!file) return alert("Please choose a file first.");
    if (!firstName.trim()) return alert("Please enter your first name.");
    setUploading(true);
  };

  const [nativeError, setNativeError] = useState(null);
  const [nativeFileInfo, setNativeFileInfo] = useState(null);

  const openNativePicker = async () => {
    setNativeError(null);
    setNativeFileInfo(null);
    if (window.showOpenFilePicker) {
      try {
        const [handle] = await window.showOpenFilePicker({
          multiple: false,
          types: [
            {
              description: 'Images',
              accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.avif'] }
            }
          ]
        });
        const f = await handle.getFile();
        setNativeFileInfo({ name: f.name, size: f.size, type: f.type });
        setFile(f);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(f));
      } catch (err) {
        console.error('showOpenFilePicker error', err);
        setNativeError(String(err));
      }
    } else {
      setNativeError('showOpenFilePicker is not available in this browser');
    }
  };

  return (
    <div className="signin-backdrop" role="dialog" aria-modal="true">
      <div className="signin-modal" style={{ maxWidth: 560, padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 className="text-2xl font-semibold mb-1">Upload a photo</h3>
            <p className="text-sm text-gray-600 mb-4">Add a photo and your first name so we can credit you.</p>

            <div
              onClick={async () => {
                // clicking the drop area triggers the same picker behavior
                if (window.showOpenFilePicker) {
                  try {
                    const [handle] = await window.showOpenFilePicker({ multiple: false, types: [{ description: 'Images', accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.avif'] } }] });
                    const f = await handle.getFile();
                    setFile(f);
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(URL.createObjectURL(f));
                  } catch (err) {
                    console.error('showOpenFilePicker error', err);
                    setNativeError(String(err));
                  }
                } else {
                  if (fileRef.current) fileRef.current.click();
                }
              }}
              style={{
                border: '2px dashed #d1fae5',
                background: '#f0fdf4',
                borderRadius: 12,
                padding: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 10, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16V8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L12 8L16 12" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Click to choose or drag & drop</div>
                <div style={{ fontSize: 13, color: '#065f46' }}>PNG, JPG, AVIF — up to 10MB</div>
              </div>
            </div>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />

            <div style={{ marginTop: 14 }}>
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded"
                style={{ padding: '10px 12px' }}
              />
            </div>

            {uploading && (
              <div className="mb-3" style={{ marginTop: 12 }}>
                <div className="text-sm">Uploading: {Math.round(progress)}%</div>
                <div style={{ background: '#e5e7eb', height: 8, borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#10b981' }} />
                </div>
              </div>
            )}

            {error && <div className="text-xs text-red-600 mb-2" style={{ marginTop: 8 }}>{String(error)}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFile(null);
                  setUploading(false);
                  if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }
                  onClose && onClose();
                }}
                style={{ padding: '8px 14px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={startUpload}
                disabled={uploading}
                style={{ padding: '8px 14px', background: '#059669', borderColor: '#059669' }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>

          <div style={{ width: 160, textAlign: 'center' }}>
            <div style={{ borderRadius: 10, overflow: 'hidden', background: '#fff', boxShadow: '0 6px 20px rgba(2,6,23,0.08)', padding: 8 }}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 16V8" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L12 8L16 12" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: '#444' }}>{file ? file.name : 'No file selected'}</div>
            {nativeFileInfo && (
              <div className="text-xs text-gray-500" style={{ marginTop: 6 }}>{nativeFileInfo.name}</div>
            )}
            {nativeError && (
              <div className="text-xs text-red-600" style={{ marginTop: 6 }}>{nativeError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
