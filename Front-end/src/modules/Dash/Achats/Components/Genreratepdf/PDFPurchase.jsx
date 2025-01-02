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

    // Header: Title on the Left and Logo on the Right
    const logoWidth = 30; // Width of the logo
    const logoX = doc.internal.pageSize.width - logoWidth - 10; // Position the logo on the right
    doc.addImage("https://media.istockphoto.com/id/981368726/fr/vectoriel/restaurant-nourriture-boissons-logo-fourchette-couteau-background-image-vectorielle.jpg?s=612x612&w=0&k=20&c=B7_5cMkmJU_myFhzyr7w_VeTvq4J_C_PjL9x1JuVHGc=", "PNG", logoX, 10, logoWidth, 30);

    // Title: Align left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(22, 160, 133);
    doc.text("Facture d'Achat", 10, 25); // Position title on the left

    // Purchase Details (Above Table)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString()}`, 10,30);


    // Supplier Information (Right-aligned)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    doc.text("Fournisseur:", 10, 42);
    doc.setFontSize(10);
    doc.text(`Nom: ${purchase.supplier.name}`, 10, 50);
    doc.text(`Email: ${purchase.supplier.email}`, 10, 55);
    doc.text(`Adresse: ${purchase.supplier.address}`,10, 60);
    doc.text(`Téléphone: ${purchase.supplier.phone}`,10, 65);

    // Table Columns
    const tableColumn = [
      "Produit",
      "Quantité",
      "Prix Unitaire (Dh)",
      "Montant Total (Dh)",
    ];

    // Table Rows - Loop through purchaseItems
    const tableRows = purchase.purchaseItems.map(item => [
      item.product.productName,
      Number(item.quantity),
      `${Number(item.unitPrice)} Dh`,
      `${Number(item.totalAmount)} Dh`,
    ]);

    // Auto Table Configuration
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 75, // Start the table below the supplier info
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

    // Total Amounts at the Bottom Right
    const totalAmountY = doc.lastAutoTable.finalY + 10; // Adjust positioning based on table size
    const totalX = doc.internal.pageSize.width - 80; // Adjust the X position to fit within page

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    {(purchase.discountType && purchase.discountValue!== null ) &&
      doc.text(
        `Remise: ${
          purchase.discountType && purchase.discountValue !== null
            ? purchase.discountType === 'amount'
              ? `${Number(purchase.discountValue).toString()} Dh`
              : `${Number(purchase.discountValue).toString()} %`
            : '-'
        }`,
        totalX,
        totalAmountY
      ); 
    }     
    doc.text(`Montant Total HT: ${Number(purchase.totalAmountHT)} Dh`, totalX, totalAmountY+8);
    doc.text(`Taxe: ${Number(purchase.taxPercentage)}%`, totalX, totalAmountY + 16);
    doc.text(`Montant Total TTC: ${Number(purchase.totalAmountTTC)} Dh`, totalX, totalAmountY + 24);

    // Footer (Page number and message)
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
        "Merci pour votre achat!",
        15,
        doc.internal.pageSize.height - 10
      );
    }

    // Save PDF
    doc.save(`Facture d'Achat-${purchase.ownerReferenece}-${formatDate(purchase.createdAt)}.pdf`);
  } catch (pdfError) {
    console.error("Failed to generate PDF:", pdfError.message);
  }
};


export default generatePDF;
