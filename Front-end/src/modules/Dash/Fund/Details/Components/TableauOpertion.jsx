import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpCircle, 
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,CheckCheck , ClockAlert, Coins,NotebookPen
} from 'lucide-react';

import {formatDate} from '@/components/dateUtils/dateUtils'
import { useParams } from 'react-router-dom';


// Liste des types de mouvements en français
const transactionTypes = [
  { value: 'deposit', label: 'Dépôt' },
  { value: 'tip', label: 'Pourboire' },
  { value: 'withdraw', label: 'Retrait' },
  { value: 'payment', label: 'Paiement' },
  { value: 'refund', label: 'Remboursement' },
  { value: 'expense', label: 'Dépense' },
  { value: 'income', label: 'Revenu' },
  { value: 'adjustment', label: 'Ajustement' },
  { value: 'penalty', label: 'Pénalité' },
  { value: 'charge', label: 'Frais' },
  { value: 'transfer', label: 'Transfert' }
];

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
];

const TableauOperation = ({ data , Confirm , confirmTransferOperation }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});


  const {id} = useParams()

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

        <td className="p-3 text-sm font-bold " > 
          <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm font-bold flex items-center" ><NotebookPen className='w-5 h-5 mr-2 '/> {obtenirLibelleType(operation.operationType)}</span>
        </td>

        <td className="p-3 text-sm">
            <div className="flex items-center">
                <>
                    {operation.operationAction === 'both'  &&  id === operation.transferToFundId ? (
                        <>
                          {afficherIconeAction("increase")}
                          <span className="text-green-500 mr-2">Augmentation</span>
                        </>
                        ) : operation.action === 'both' ? (
                        <>
                          {afficherIconeAction("decrease")}
                          <span className="text-red-500 mr-2">Diminution</span>
                        </>
                        ) : (
                        <>
                            {afficherIconeAction(operation.operationAction)}
                            <span
                            className={
                                operation.operationAction === 'increase'
                                ? 'text-green-500 mr-2'
                                : 'text-red-500 mr-2'
                            }
                            >
                            {operation.operationAction === 'increase' ? 'Augmentation' : 'Diminution'}
                            </span>
                        </>
                    )}
                </>
            </div>
        </td>

        <td className="p-3 text-sm">{operation?.transferToFund?.sku && <>{operation?.fund.sku} → {operation?.transferToFund?.sku}</> || '-'}</td>
        
        <td className="p-3 text-sm ">
          <span className='px-3 py-1 bg-gray-500 text-white rounded-full text-sm whitespace-nowrap font-bold flex items-center'><Coins className='h-5 w-5 mr-2'/>{operation.amount} Dh</span>
        </td>

        <td className="p-3 text-sm">{formatDate(operation.dateOperation)}</td>

        <td className="p-3 text-sm">
          <span className={`px-3 py-1 rounded-full flex items-center ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
            {operation.status === 'approved' ?<CheckCheck className='h-5 w-5 mr-2'/> : <ClockAlert className='h-5 w-5 mr-2'/>} {obtenirLibellestatus(operation.status)}
          </span>
        </td>

        <td className="p-3 text-sm">{operation.reference || "-"}</td>

        <td className="p-3 text-sm">{operation.note || "-"}</td>

        <td className="p-3 text-sm">

          {obtenirLibellestatus(operation.status)==="En attente" ? 
            <button id="approve-btn" className="btn-approve bg-black text-white px-4 py-2 rounded" onClick={() => {
                if (operation.operationType === 'transfer') {
                  confirmTransferOperation(operation.id);
                } else {
                  Confirm(operation.id);
                }
              }}
            >
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
            <td className="font-bold flex">
              <NotebookPen className='w-5 h-5 mr-2 '/> {obtenirLibelleType(operation.operationType)}
            </td>
            <td className="text-right flex justify-end items-center">
                <div className="flex items-center">
                  <>
                      {operation.operationAction === 'both'  &&  id !== operation.transferToFundId ? (
                          <>
                              {afficherIconeAction("decrease")}
                              <span className="text-red-500 mr-2">Diminution</span>
                          </>
                          ) : operation.action === 'both' ? (
                          <>
                              {afficherIconeAction("increase")}
                              <span className="text-green-500 mr-2">Augmentation</span>
                          </>
                          ) : (
                          <>
                              {afficherIconeAction(operation.operationAction)}
                              <span
                              className={
                                  operation.operationAction === 'increase'
                                  ? 'text-green-500 mr-2'
                                  : 'text-red-500 mr-2'
                              }
                              >
                              {operation.operationAction === 'increase' ? 'Augmentation' : 'Diminution'}
                              </span>
                          </>
                      )}
                  </>
                {estEtendue ? <ChevronUp/> : <ChevronDown/>}
                </div>
            </td>
        </tr>
        {estEtendue && (
          <tr className="md:hidden">
            <td colSpan="2" className="p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                
                <div className="font-semibold">Transfert:</div>
                <div>{operation?.transferToFund?.sku && <>{operation?.fund.sku} → {operation?.transferToFund?.sku}</> || '-'}</div>

                <div className="font-semibold">Montant:</div>
                <div>{operation.amount} Dh</div>

                <div className="font-semibold">Date l'Operation:</div>
                <div>
                  {formatDate(operation.dateOperation)}
                </div>
                
                <div className="font-semibold">Status:</div>
                <div>
                  <span className={`px-3 py-1 rounded-full ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
                    {obtenirLibellestatus(operation.status)}
                  </span>
                </div>
                
                <div className="font-semibold">Référence:</div>
                <div>{operation.reference || "-"}</div>


                <div className="font-semibold">Notes:</div>
                <div>{operation.note || "-"}</div>
                

                <div className="font-semibold">Approuver l'opération</div>
                <div>{obtenirLibellestatus(operation.status)==="En attente" ? 
                    <button id="approve-btn" className="btn-approve bg-black text-white px-4 py-2 rounded" onClick={() => {
                        if (operation.operationType === 'transfer') {
                          confirmTransferOperation(operation.id);
                        } else {
                          Confirm(operation.id);
                        }
                      }}
                    >
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
                <th className="p-3 text-left text-sm">Type</th>
                <th className="p-3 text-left text-sm">Action</th>
                <th className="p-3 text-left text-sm">Transfert</th>
                <th className="p-3 text-left text-sm">Montant</th>
                <th className="p-3 text-left text-sm">Date l'Operation</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left text-sm">Référence</th>
                <th className="p-3 text-left text-sm">Notes</th>
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

export default TableauOperation;