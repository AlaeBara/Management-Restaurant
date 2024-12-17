import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp ,Printer,ExternalLink} from 'lucide-react';
import { formatDate } from '@/components/dateUtils/dateUtils';

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
];

const TableauTransfert = ({ data }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});

  const basculerExtensionLigne = (id) => {
    setLignesExtendues((precedent) => ({
      ...precedent,
      [id]: !precedent[id],
    }));
  };

  const LigneDesktop = ({ purchase, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <td className="p-3 text-sm">{purchase.id}</td>
      <td className="p-3 text-sm">{formatDate(purchase.purchaseDate)}</td>
      <td className="p-3 text-sm">
        <span className={`px-3 py-1 rounded-full whitespace-nowrap`}>
          {purchase.status}
        </span>
      </td>
      <td className="p-3 text-sm">{purchase.totalAmountHT} Dh</td>
      <td className="p-3 text-sm">{purchase.taxPercentage}%</td>
      <td className="p-3 text-sm">{purchase.totalAmountTTC} Dh</td>
      <td className="p-3 text-sm">{purchase.paiementStatus}</td>
      <td className="p-3 text-sm">{purchase.supplier.name}</td>
      <td className="p-3 text-sm">{purchase.supplier.email}</td>
      <td className="p-3 text-sm">{purchase.sourcePayment.name}</td>
      <td className="p-3 text-sm">{formatDate(purchase.createdAt)}</td>
      <td className="p-3 text-sm">{purchase.sourcePayment.sku}</td>
      <td className="p-3 text-sm">
        <div className='flex gap-5'>
          <button>
            <Printer className='w-5 h5' />
          </button>
          <button>
            <ExternalLink className='w-5 h5' />
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
            {purchase.supplier.name} - {purchase.id}
          </td>
          <td className="text-right flex justify-end items-center">
                <div className="flex items-center">
                  {estEtendue ? <ChevronUp/> : <ChevronDown/>}
                </div>
            </td>
        </tr>
        {estEtendue && (
          <tr className="md:hidden">
            <td colSpan="2" className="p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Nom du Fournisseur:</div>
                <div>{purchase.supplier.name}</div>

                <div className="font-semibold">Référence Achat:</div>
                <div>{purchase.ownerReferenece}</div>

                <div className="font-semibold">Montant Total (HT):</div>
                <div>{purchase.totalAmountHT} Dh</div>

                <div className="font-semibold">Taxe (%)</div>
                <div>{purchase.taxPercentage}</div>

                <div className="font-semibold">Montant Total (TTC):</div>
                <div>{purchase.totalAmountTTC} Dh</div>

                <div className="font-semibold">Statut de Paiement:</div>
                <div>{purchase.paiementStatus}</div>

                <div className="font-semibold">Date d'Achat:</div>
                <div>{formatDate(purchase.purchaseDate)}</div>

                <div className="font-semibold">Référence du Fournisseur:</div>
                <div>{purchase.supplierReference}</div>

                <div className="font-semibold">Notes:</div>
                <div>{purchase.note || '-'}</div>

                <div className="font-semibold">Date de création</div>
                <div>{formatDate(purchase.createdAt)}</div>

                <div className="font-semibold">Approuver l'achat</div>
                <div>
                  {purchase.status === "created" ? (
                    <button
                      id="approve-btn"
                      className="btn-approve bg-black text-white px-4 py-2 rounded"
                      onClick={() => Confirm(purchase.id)}
                    >
                      Approuver
                    </button>
                  ) : (
                    <span>{formatDate(purchase.updatedAt)}</span>
                  )}
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
                <th className="p-3 text-left text-sm">ID Achat</th>
                <th className="p-3 text-left text-sm">Date d'Achat</th>
                <th className="p-3 text-left text-sm">Statut</th>
                <th className="p-3 text-left text-sm">Montant Total (HT)</th>
                <th className="p-3 text-left text-sm">Pourcentage Taxe</th>
                <th className="p-3 text-left text-sm">Montant Total (TTC)</th>
                <th className="p-3 text-left text-sm">Statut de Paiement</th>
                <th className="p-3 text-left text-sm">Nom du Fournisseur</th>
                <th className="p-3 text-left text-sm">Email du Fournisseur</th>
                <th className="p-3 text-left text-sm">Source Paiement</th>
                <th className="p-3 text-left text-sm">Date de création</th>
                <th className="p-3 text-left text-sm">Référence Source Paiement</th>
                <th className="p-3 text-left text-sm">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((purchase, index) => (
                <React.Fragment key={purchase.id}>
                  <LigneDesktop purchase={purchase} isLast={index === data.length - 1}/>
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
