import { useState, useRef, useEffect } from "react";

const CameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startCamera = async () => {
      try {
        setIsLoading(true);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Check browser permissions.");
        setIsLoading(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const video = videoRef.current;

      // Set canvas size to match video
      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0);

      // Convert to data URL
      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.9);
      
      // Close camera and return image
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      onCapture(imageData);
      onClose();
    }
  };

  return (
    <div className="camera-modal-overlay" onClick={onClose}>
      <div className="camera-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="camera-modal-header">
          <div className="camera-modal-title">
            <svg className="camera-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span>Capture Photo</span>
          </div>
          <button onClick={onClose} className="camera-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="camera-modal-body">
          {error ? (
            <div className="camera-error">
              <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>{error}</p>
            </div>
          ) : isLoading ? (
            <div className="camera-loading">
              <div className="spinner"></div>
              <p>Starting camera...</p>
            </div>
          ) : (
            <>
              <div className="video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="camera-video"
                />
                <div className="video-overlay">
                  <div className="camera-guide"></div>
                </div>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          )}
        </div>

        {!error && !isLoading && (
          <div className="camera-modal-footer">
            <button onClick={onClose} className="camera-btn camera-btn-cancel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Cancel</span>
            </button>
            <button onClick={capturePhoto} className="camera-btn camera-btn-capture">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6" fill="white"></circle>
              </svg>
              <span>Capture</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
