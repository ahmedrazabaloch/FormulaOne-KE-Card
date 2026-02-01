import CardFront from "./CardFront";
import CardBack from "./CardBack";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CardPreview = ({ employeeData, vehicleData, onClose, orientation = "portrait", isModal = false }) => {
  
  // Helper function to create a cropped canvas from image
  const createCroppedImage = (imgElement, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;
        
        let sx, sy, sWidth, sHeight;
        
        if (imgAspect > targetAspect) {
          // Image is wider - crop sides
          sHeight = img.height;
          sWidth = img.height * targetAspect;
          sx = (img.width - sWidth) / 2;
          sy = 0;
        } else {
          // Image is taller - crop top/bottom
          sWidth = img.width;
          sHeight = img.width / targetAspect;
          sx = 0;
          sy = (img.height - sHeight) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = imgElement.src;
    });
  };
  
  const downloadPDF = async () => {
    const cards = document.querySelectorAll(".card");

    // Force portrait for PDF output
    const w = 85.6;
    const h = 53.98;
    const pageFormat = [h, w];

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: pageFormat,
    });

    // DPI conversion: 1mm = 3.7795275591 pixels at 96 DPI
    const MM_TO_PX = 3.7795275591;
    
    for (let i = 0; i < cards.length; i++) {
      // Create completely new isolated container with pixel sizing
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: ${h * MM_TO_PX}px;
        height: ${w * MM_TO_PX}px;
        background: white;
        padding: 0;
        margin: 0;
      `;
      document.body.appendChild(wrapper);
      
      // Clone and style the card
      const clone = cards[i].cloneNode(true);
      clone.style.cssText = `
        width: ${h * MM_TO_PX}px !important;
        height: ${w * MM_TO_PX}px !important;
        transform: none !important;
        padding: ${3.5 * MM_TO_PX}px;
        margin: 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: Arial, Helvetica, sans-serif;
      `;
      
      // Fix all images - ensure proper sizing and cropping
      const images = clone.querySelectorAll("img");
      const imagePromises = [];
      
      images.forEach((img) => {
        if (img.classList.contains("employee-photo")) {
          // Employee photo - create actual cropped image
          const photoW = 20 * MM_TO_PX;
          const photoH = 24 * MM_TO_PX;
          
          const originalImg = cards[i].querySelector('.employee-photo');
          if (originalImg) {
            const promise = createCroppedImage(originalImg, photoW, photoH).then(croppedSrc => {
              img.src = croppedSrc;
              img.style.cssText = `
                width: ${photoW}px !important;
                height: ${photoH}px !important;
                object-fit: contain !important;
                display: block !important;
                margin: ${3 * MM_TO_PX}px auto !important;
                border: 2px solid #333 !important;
                border-radius: 3px !important;
                box-sizing: border-box !important;
                flex-shrink: 0 !important;
              `;
            });
            imagePromises.push(promise);
          }
        } else if (img.classList.contains("card-logo") || img.classList.contains("authority-signature")) {
          // Logos and signatures - auto sizing
          img.style.cssText = `
            object-fit: contain !important;
            object-position: center !important;
            display: block !important;
          `;
        }
      });
      
      wrapper.appendChild(clone);
      
      // Wait for all image processing to complete
      await Promise.all(imagePromises);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Capture with high quality
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 10000,
        windowWidth: h * MM_TO_PX,
        windowHeight: w * MM_TO_PX,
      });
      
      document.body.removeChild(wrapper);

      const imgData = canvas.toDataURL("image/png", 1.0);

      if (i > 0) pdf.addPage(pageFormat, "portrait");

      pdf.addImage(imgData, "PNG", 0, 0, h, w);
    }

    pdf.save("office-duty-card.pdf");
  };

  const backData = {
    ...vehicleData,
    licenceNo: employeeData.licenceNo,
    licenceCategory: employeeData.licenceCategory,
    licenceValidity: employeeData.licenceValidity,
    dateOfIssue: employeeData.dateOfIssue,
  };

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <div className="preview-actions">
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="preview-wrapper-modal">
          <CardFront data={employeeData} inspectionId={vehicleData.inspectionId} orientation={"portrait"} />
          <CardBack data={backData} orientation={"portrait"} />
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
