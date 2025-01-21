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
    { value: 'expense', label: 'Dépense' },
];
const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
];

const TableauExpense = ({ data , Confirm }) => {
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-red-500 text-white';
      case 'approved':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };







  const LigneDesktop = ({ operation, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>


        <td className="p-3 text-sm">{operation?.fund?.sku}</td>

        <td className="p-3 text-sm">{operation?.fund?.name}</td>
        

        <td className="p-3 text-sm">{operation?.expenseType?.name || '-'}</td>

        <td className="p-3 text-sm">
            <div className="flex items-center">
                {afficherIconeAction(operation.action)}
                <span className={operation.action === 'increase' ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>
                    {operation.action === 'increase' ? 'Augmentation' : 'Diminution'}
                </span>
            </div>
        </td>

        <td className="p-3 text-sm whitespace-nowrap">
          {operation.amount} Dh
        </td>

        <td className="p-3 text-sm">{formatDate(operation.dateOperation)}</td>

        <td className="p-3 text-sm">
          <span className={`px-3 py-1 rounded-full ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
            {obtenirLibellestatus(operation.status)}
          </span>
        </td>

        <td className="p-3 text-sm">{operation.reference || "-"}</td>

        <td className="p-3 text-sm">{operation.note || "-"}</td>

        <td className="p-3 text-sm">{formatDate(operation.createdAt)}</td>
        <td className="p-3 text-sm">

          {obtenirLibellestatus(operation.status)==="En attente" ? 
            <button id="approve-btn" className="btn-approve bg-black text-white px-4 py-2 rounded" onClick={()=>Confirm(operation.id)}>
              Approuver
            </button>
            :
            (
              <span>{formatDate(operation.approvedAt)}</span>
            )
          }
        </td>
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
                {operation?.fund?.sku} - {operation?.fund?.name}
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



                <div className="font-semibold">Nom de la Caisse</div>
                <div>{operation?.fund?.name}</div>

                <div className="font-semibold">Type:</div>
                <div>{operation?.expenseType?.name || '-'}</div>

                <div className="font-semibold">Montant:</div>
                <div>{operation.amount} Dh</div>

                <div className="font-semibold">Date l'Operation:</div>
                <div>
                  {formatDate(operation.dateOperation)}
                </div>
                
                <div className="font-semibold">Status:</div>
                <div><span className={`px-3 py-1 rounded-full ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
                  {obtenirLibellestatus(operation.status)}
                </span></div>
                
                <div className="font-semibold">Référence:</div>
                <div>{operation.reference || "-"}</div>


                <div className="font-semibold">Notes:</div>
                <div>{operation.note || "-"}</div>
                
                
                <div className="font-semibold">Date de création</div>
                <div>{formatDate(operation.createdAt)}</div>

                <div className="font-semibold">Approuver l'opération</div>
                <div>{obtenirLibellestatus(operation.status)==="En attente" ? 
                    <button id="approve-btn" className="btn-approve bg-black text-white px-4 py-2 rounded" onClick={()=>Confirm(operation.id)}>
                      Approuver
                    </button>
                    :
                    (
                      <span>{formatDate(operation.approvedAt)}</span>
                    )
                  }
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
                <th className="p-3 text-left text-sm">Sku Caisse</th>
                <th className="p-3 text-left text-sm">Nom de la Caisse</th>
                <th className="p-3 text-left text-sm">Type</th>
                <th className="p-3 text-left text-sm">Action</th>
                <th className="p-3 text-left text-sm">Montant</th>
                <th className="p-3 text-left text-sm">Date l'Operation</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left text-sm">Référence</th>
                <th className="p-3 text-left text-sm">Notes</th>
                <th className="p-3 text-left text-sm">Date de création</th>
                <th className="p-3 text-left text-sm">Approuver l'opération</th>
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

export default TableauExpense;