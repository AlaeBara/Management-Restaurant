import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Printer, ExternalLink } from 'lucide-react';
import { formatDate } from '@/components/dateUtils/dateUtils';
import generatePDF from "./Genreratepdf/PDFPurchase";



const TableauTransfert = ({ data }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});

  const basculerExtensionLigne = (id) => {
    setLignesExtendues((precedent) => ({
      ...precedent,
      [id]: !precedent[id],
    }));
  };

  const handleGeneratePDF = async (purchase) => {
    try {
      await generatePDF(purchase);
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  };

  //for Status Eng => French
  function StatusToFrench(status) {
    const statusTranslations = {
      'CREATED': 'Créé',
      'CONFIRMED': 'Confirmé',
      'DELIVERING': 'En livraison',
      'CANCELLED': 'Annulé',
      'COMPLETED': 'Terminé',
    };
  
    return statusTranslations[status.toUpperCase()] || status; 
  }

  //for PaymentStatus Eng => French
  function PaymentStatusToFrench(status) {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Payé';
      case 'UNPAID':
        return 'Non payé';
      case 'PARTIALLY_PAID':
        return 'Partiellement payé';
      default:
        return status; 
    }
  }

  const LigneDesktop = ({ purchase, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <td className="p-3 text-sm">{purchase.ownerReferenece}</td>
      <td className="p-3 text-sm">{purchase.supplier.name}</td>
      <td className="p-3 text-sm">{StatusToFrench(purchase.status)}</td>
      <td className="p-3 text-sm whitespace-nowrap">{purchase.totalAmountHT} Dh</td>
      <td className="p-3 text-sm ">{purchase.taxPercentage}%</td>
      <td className="p-3 text-sm  whitespace-nowrap">{purchase.totalAmountTTC} Dh</td>
      <td className="p-3 text-sm">{PaymentStatusToFrench(purchase.paiementStatus)}</td>
      <td className="p-3 text-sm">{purchase.sourcePayment.name}</td>
      <td className="p-3 text-sm">{formatDate(purchase.purchaseDate)}</td>
      <td className="p-3 text-sm">{formatDate(purchase.createdAt)}</td>
      <td className="p-3 text-sm">
        <div className='flex gap-5'>
          <button onClick={() => handleGeneratePDF(purchase)}>
            <Printer className='w-5 h-5' />
          </button>
          <button>
            <ExternalLink className='w-5 h-5' />
          </button>
        </div>
      </td>
    </tr>
  );

  
  const LigneMobile = ({ purchase, isLast }) => {
    const estEtendue = lignesExtendues[purchase.id];
    return (
      <>
        <tr
          className={`md:hidden grid grid-cols-1 gap-2 p-2 ${!isLast ? 'border-b' : ''} cursor-pointer`}
          onClick={() => basculerExtensionLigne(purchase.id)}
        >
          <td className="font-bold">
          {purchase.ownerReferenece} - {purchase.supplier.name} 
          </td>
          <td className="text-right flex justify-end items-center">
            <div className="flex items-center">
              {estEtendue ? <ChevronUp /> : <ChevronDown />}
            </div>
          </td>
        </tr>
        {estEtendue && (
          <tr className="md:hidden">
            <td colSpan="2" className="p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Référence Achat:</div>
                <div>{purchase.ownerReferenece}</div>
                <div className="font-semibold">Nom du Fournisseur:</div>
                <div>{purchase.supplier.name}</div>
                <div className="font-semibold">Status:</div>
                <div>{StatusToFrench(purchase.status)}</div>
                <div className="font-semibold">Montant Total (HT):</div>
                <div>{purchase.totalAmountHT} Dh</div>
                <div className="font-semibold">Taxe (%)</div>
                <div>{purchase.taxPercentage}</div>
                <div className="font-semibold">Montant Total (TTC):</div>
                <div>{purchase.totalAmountTTC} Dh</div>
                <div className="font-semibold">Statut de Paiement:</div>
                <div>{PaymentStatusToFrench(purchase.paiementStatus)}</div>
                <div className="font-semibold">Source Paiement:</div>
                <div>{purchase.sourcePayment.name}</div>
                <div className="font-semibold">Date d'achat:</div>
                <div>{formatDate(purchase.purchaseDate)}</div>
                <div className="font-semibold">Date de création:</div>
                <div>{formatDate(purchase.createdAt)}</div>
                <div className="font-semibold">Action:</div>
                <div>
                  <div className='flex gap-5'>
                    <button onClick={() => handleGeneratePDF(purchase)}>
                      <Printer className='w-5 h-5' />
                    </button>
                    <button>
                      <ExternalLink className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <Card className="w-full mt-7 shadow-none border-0">
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm">Référence Achat</th>
                <th className="p-3 text-left text-sm">Nom du Fournisseur</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left text-sm">Montant Total (HT)</th>
                <th className="p-3 text-left text-sm">Pourcentage Taxe</th>
                <th className="p-3 text-left text-sm">Montant Total (TTC)</th>
                <th className="p-3 text-left text-sm">Statut de Paiement</th>
                <th className="p-3 text-left text-sm">Source Paiement</th>
                <th className="p-3 text-left text-sm">Date d'achat</th>
                <th className="p-3 text-left text-sm">Date de création</th>
                <th className="p-3 text-left text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((purchase, index) => (
                <React.Fragment key={purchase.id}>
                  <LigneDesktop purchase={purchase} isLast={index === data.length - 1} />
                  <LigneMobile purchase={purchase} isLast={index === data.length - 1} />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableauTransfert;
