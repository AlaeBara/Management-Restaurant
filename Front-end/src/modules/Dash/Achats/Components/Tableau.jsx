import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Printer, ExternalLink } from 'lucide-react';
import { formatDate } from '@/components/dateUtils/dateUtils';
import generatePDF from "./Genreratepdf/PDFPurchase";
import { useNavigate } from 'react-router-dom';



const TableauTransfert = ({ data }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});

  const navigate = useNavigate()

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
  
    const normalizedStatus = status ? status.toUpperCase().trim() : '';
  
    const statusTranslations = {
      'CREATED': { 
        label: 'Créé', 
        style: 'bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm font-medium' 
      },
      'CONFIRMED': { 
        label: 'Confirmé', 
        style: 'bg-blue-200 text-blue-800 rounded px-2 py-1 text-sm font-medium' 
      },
      'DELIVERING': { 
        label: 'En livraison', 
        style: 'bg-yellow-200 text-yellow-800 rounded px-2 py-1 text-sm font-medium' 
      },
      'CANCELLED': { 
        label: 'Annulé', 
        style: 'bg-red-200 text-red-800 rounded px-2 py-1 text-sm font-medium' 
      },
      'COMPLETED': { 
        label: 'Terminé', 
        style: 'bg-green-200 text-green-800 rounded px-2 py-1 text-sm font-medium' 
      }
    };
  
    const statusInfo = statusTranslations[normalizedStatus] || { 
      label: status || 'Statut inconnu', 
      style: 'bg-gray-200 text-gray-800 rounded px-2 py-1 text-sm font-medium' 
    };
  
    return statusInfo;
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
      <td className="p-3 text-sm">{purchase.supplierReference}</td>
      <td className="p-3 text-sm">{purchase.supplier.name}</td>
      <td className="p-3 text-sm whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-sm ${StatusToFrench(purchase.status).style}`}>
          {StatusToFrench(purchase.status).label}
        </span>
      </td>
      <td className="p-3 text-sm  whitespace-nowrap">{purchase.totalAmountTTC} Dh</td>
      <td className="p-3 text-sm whitespace-nowrap">{purchase.totalRemainingAmount} Dh</td>
      <td className="p-3 text-sm">{PaymentStatusToFrench(purchase.paiementStatus)}</td>
      <td className="p-3 text-sm">{formatDate(purchase.purchaseDate)}</td>
      <td className="p-3 text-sm">{formatDate(purchase.createdAt)}</td>
      <td className="p-3 text-sm">
        <div className='flex gap-5'>
          <button onClick={() => handleGeneratePDF(purchase)} title='Imprimer'>
            <Printer className='w-5 h-5' />
          </button>
          <button onClick={()=>navigate(`/dash/achats/detail/${purchase.id}`)} title='Voir les détails'>
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
                <div className="font-semibold">Référence Fournisseur:</div>
                <div>{purchase.supplierReference}</div>
                <div className="font-semibold">Nom du Fournisseur:</div>
                <div>{purchase.supplier.name}</div>
                <div className="font-semibold whitespace-nowrap">Status d'achat:</div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm ${StatusToFrench(purchase.status).style}`}>
                    {StatusToFrench(purchase.status).label}
                  </span>
                </div>
                <div className="font-semibold">Montant Total (TTC):</div>
                <div>{purchase.totalAmountTTC} Dh</div>
                <div className="font-semibold">Montant Total Restant:</div>
                <div>{purchase.totalRemainingAmount} Dh</div>
                <div className="font-semibold">Statut de Paiement:</div>
                <div>{PaymentStatusToFrench(purchase.paiementStatus)}</div>
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
                    <button  onClick={()=>navigate(`/dash/achats/detail/${purchase.id}`)}>
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
                <th className="p-3 text-left text-sm">Référence Fournisseur</th>
                <th className="p-3 text-left text-sm">Nom du Fournisseur</th>
                <th className="p-3 text-left text-sm">Status d'achat</th>
                <th className="p-3 text-left text-sm">Montant Total (TTC)</th>
                <th className="p-3 text-left text-sm">Montant Total Restant</th>
                <th className="p-3 text-left text-sm">Statut de Paiement</th>
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
