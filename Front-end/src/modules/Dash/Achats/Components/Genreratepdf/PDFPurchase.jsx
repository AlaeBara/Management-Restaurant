import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatDate } from "@/components/dateUtils/dateUtils";

const generatePDF = async (purchase) => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(22, 160, 133);
    doc.text("Purchase Report", 20, 15);

    // Purchase Details (Above Table)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Purchase ID: ${purchase.id}`, 20, 25);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

    // Supplier Information (Outside Table)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    doc.text("Supplier Information:", 20, 40);
    doc.setFontSize(10);
    doc.text(`Supplier Name: ${purchase.supplier.name}`, 20, 46);
    doc.text(`Supplier Email: ${purchase.supplier.email}`, 20, 52);

    // Table Columns (Without Supplier Details)
    const tableColumn = [
      "Date d'Achat",
      "Statut",
      "Montant Total (HT)",
      "Taxe (%)",
      "Montant Total (TTC)",
      "Statut de Paiement",
    ];

    // Table Rows
    const tableRows = [
      [
        formatDate(purchase.purchaseDate),
        purchase.status,
        `${purchase.totalAmountHT} Dh`,
        `${purchase.taxPercentage}%`,
        `${purchase.totalAmountTTC} Dh`,
        purchase.paiementStatus,
      ],
    ];

    // Auto Table Configuration
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 58, // Adjust startY to position below supplier info
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
        valign: "middle",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      margin: { top: 10, left: 15, right: 15 },
      styles: {
        overflow: "linebreak",
        cellPadding: 4,
      },
    });

    // Footer (with page number and message)
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
      doc.text(
        "Thank you for your business!",
        15,
        doc.internal.pageSize.height - 10
      );
    }

    // Save PDF
    doc.save(`purchase-report-${purchase.id}.pdf`);
  } catch (pdfError) {
    console.error("Failed to generate PDF:", pdfError.message);
  }
};

export default generatePDF;
