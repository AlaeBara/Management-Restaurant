import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpCircle, 
  ArrowDownCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import {formatDate} from '@/components/dateUtils/dateUtils'



// Liste des types de mouvements en français
const transactionTypes = [
    { value: 'deposit', label: 'Dépôt' },
    { value: 'purchase', label: 'Achat' },
    { value: 'tip', label: 'Pourboire' },
    { value: 'withdraw', label: 'Retrait' },
    { value: 'payment', label: 'Paiement' },
    { value: 'refund', label: 'Remboursement' },
    { value: 'income', label: 'Revenu' },
    { value: 'adjustment-increase', label: 'Ajustement - Augmentation' },
    { value: 'adjustment-decrease', label: 'Ajustement - Diminution' },
    { value: 'other-income', label: 'Autre revenu' },
    { value: 'other-expense', label: 'Autre dépense' },
    { value: 'transfer-in', label: 'Transfert entrant' },
    { value: 'transfer-out', label: 'Transfert sortant' },
    { value: 'charge', label: 'Frais' },
    { value: 'chargeback', label: 'Rétrofacturation' },
    { value: 'chargeback-refund', label: 'Remboursement de rétrofacturation' },
    { value: 'chargeback-charge', label: 'Frais de rétrofacturation' }
];
const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
];

const TableauMouvementsInventaire = ({ data }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});

  const basculerExtensionLigne = (id) => {
    setLignesExtendues(precedent => ({
      ...precedent,
      [id]: !precedent[id]
    }));
  };

  const afficherIconeAction = (action) => {
    const proprietesIcone = {
      size: 20,
      className: action === 'increase' 
        ? "text-green-500 mr-2" 
        : "text-red-500 mr-2"
    };

    return action === 'increase' 
      ? <ArrowUpCircle {...proprietesIcone} /> 
      : <ArrowDownCircle {...proprietesIcone} />;
  };

  // Fonction pour obtenir le libellé du type de mouvement
  const obtenirLibelleType = (valeur) => {
    const type = transactionTypes.find(t => t.value === valeur);
    return type ? type.label : valeur;
  };

  const obtenirLibellestatus = (valeur) => {
    const type = statuses.find(t => t.value === valeur);
    return type ? type.label : valeur;
  };

  const LigneDesktop = ({ operation, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <td className="p-3 text-sm">{obtenirLibelleType(operation.operation)}</td>
      <td className="p-3 text-sm">
        <div className="flex items-center">
            {afficherIconeAction(operation.action)}
            <span className={operation.action === 'increase' ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>
                {operation.action === 'increase' ? 'Augmentation' : 'Diminution'}
            </span>

        </div>
      </td>
      <td className="p-3 text-sm">
        {operation.amount} Dh
      </td>
      <td className="p-3 text-sm">{formatDate(operation.dateOperation)}</td>
      <td className="p-3 text-sm">{obtenirLibellestatus(operation.status)}</td>
      <td className="p-3 text-sm">{operation.reference || "-"}</td>
      <td className="p-3 text-sm">{operation.note || "-"}</td>
      <td className="p-3 text-sm">{formatDate(operation.updatedAt)}</td>
    </tr>
  );






  const LigneMobile = ({ operation, isLast }) => {
    const estEtendue = lignesExtendues[operation.id];
    return (
      <>
        <tr 
          className={`md:hidden grid grid-cols-1 gap-2 p-2 ${!isLast ? 'border-b' : ''} cursor-pointer`}
          onClick={() => basculerExtensionLigne(operation.id)}
        >
          <td className="font-bold">
            {operation.operation}
          </td>
          <td className="text-right flex justify-end items-center">
            <div className="flex items-center">
              {afficherIconeAction(operation.action)}
              {operation.action === 'increase' ? 'Augmentation' : 'Diminution'}
              {estEtendue ? <ChevronUp/> : <ChevronDown/>}
            </div>
          </td>
        </tr>
        {estEtendue && (
          <tr className="md:hidden">
            <td colSpan="2" className="p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">

                <div className="font-semibold">Type:</div>
                <div>{obtenirLibelleType(operation.operation)}</div>

                <div className="font-semibold">Montant:</div>
                <div>{operation.amount} Dh</div>

                <div className="font-semibold">Date l'Operation:</div>
                <div>
                  {formatDate(operation.dateOperation)}
                </div>
                
                <div className="font-semibold">Status:</div>
                <div>{obtenirLibellestatus(operation.status)}</div>
                
                <div className="font-semibold">Référence:</div>
                <div>{operation.reference || "-"}</div>


                <div className="font-semibold">Notes:</div>
                <div>{operation.note || "-"}</div>
                
                
                <div className="font-semibold">Date de création</div>
                <div>{formatDate(operation.updatedAt)}</div>
                
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
                <th className="p-3 text-left text-sm">Type</th>
                <th className="p-3 text-left text-sm">Action</th>
                <th className="p-3 text-left text-sm">Montant</th>
                <th className="p-3 text-left text-sm">Date l'Operation</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left text-sm">Référence</th>
                <th className="p-3 text-left text-sm">Notes</th>
                <th className="p-3 text-left text-sm">Date de création</th>
              </tr>
            </thead>
            <tbody>
              {data.map((operation, index) => (
                <React.Fragment key={operation.id}>
                  <LigneDesktop 
                    operation={operation} 
                    isLast={index === data.length - 1} 
                  />
                  <LigneMobile 
                    operation={operation} 
                    isLast={index === data.length - 1} 
                  />
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableauMouvementsInventaire;