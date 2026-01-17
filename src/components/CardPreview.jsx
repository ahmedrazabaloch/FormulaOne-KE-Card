import CardFront from "./CardFront";
import CardBack from "./CardBack";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const CardPreview = ({ employeeData, vehicleData, onClose, orientation = "portrait", isModal = false }) => {
  const downloadPDF = async () => {
    const cards = document.querySelectorAll(".card");

    const w = 85.6;
    const h = 53.98;
    const pageFormat = orientation === "portrait" ? [h, w] : [w, h];

    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: pageFormat,
    });

    for (let i = 0; i < cards.length; i++) {
      const canvas = await html2canvas(cards[i], {
        scale: 4, //  SHARP TEXT
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) pdf.addPage(pageFormat, orientation);

      //  NO MARGINS, NO SCALING
      const imgW = orientation === "portrait" ? h : w;
      const imgH = orientation === "portrait" ? w : h;
      pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
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
        <CardFront data={employeeData} inspectionId={vehicleData.inspectionId} orientation={orientation} />
        <CardBack data={backData} orientation={orientation} />
      </div>
    </div>
  );
};

export default CardPreview;
