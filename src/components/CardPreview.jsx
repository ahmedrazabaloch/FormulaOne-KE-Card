import CardFront from "./CardFront";
import CardBack from "./CardBack";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CardPreview = ({ employeeData, vehicleData, onClose, orientation = "portrait", isModal = false }) => {
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
      `;
      
      // Fix photo size in pixels
      const photo = clone.querySelector(".employee-photo");
      if (photo) {
        const photoW = 20 * MM_TO_PX;
        const photoH = 24 * MM_TO_PX;
        photo.style.cssText = `
          width: ${photoW}px !important;
          height: ${photoH}px !important;
          min-width: ${photoW}px !important;
          min-height: ${photoH}px !important;
          max-width: ${photoW}px !important;
          max-height: ${photoH}px !important;
          object-fit: cover !important;
          object-position: center !important;
          display: block !important;
          margin: ${3 * MM_TO_PX}px auto !important;
          border: 2px solid #333 !important;
          border-radius: 3px !important;
          box-sizing: border-box !important;
        `;
      }
      
      wrapper.appendChild(clone);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture
      const canvas = await html2canvas(wrapper, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
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
    <div className={isModal ? "preview-modal-content" : "preview-page"}>
      <div className="preview-actions">
        <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={isModal ? "preview-wrapper-modal" : "preview-wrapper"}>
        <CardFront data={employeeData} inspectionId={vehicleData.inspectionId} orientation={"portrait"} />
        <CardBack data={backData} orientation={"portrait"} />
      </div>
    </div>
  );
};

export default CardPreview;
