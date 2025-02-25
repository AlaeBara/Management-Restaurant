import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUpCircle, 
  ArrowDownCircle,
  ChevronDown,
  ChevronUp,
  Coins,
  CheckCheck,
  ClockAlert
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

        <td className="p-3 text-sm">
          <div className="flex items-center">
              {afficherIconeAction(operation.action)}
          </div>
        </td>


        <td className="p-3 text-sm">{operation?.fund?.name}</td>
        

        <td className="p-3 text-sm">{operation?.expenseType?.name || '-'}</td>

      
        <td className="p-3 text-sm">
          <span className='px-3 py-1 bg-gray-500 text-white rounded-full text-sm w-fit whitespace-nowrap font-bold flex items-center'><Coins className='h-5 w-5 mr-2'/>{Number(operation.amount)} Dh</span>
        </td>

        <td className="p-3 text-sm whitespace-nowrap">{formatDate(operation.dateOperation)}</td>

        <td className="p-3 text-sm">
          <span className={`px-3 py-1 rounded-full flex items-center w-fit ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
          {operation.status === 'approved' ?<CheckCheck className='h-5 w-5 mr-2'/> : <ClockAlert className='h-5 w-5 mr-2'/>}{obtenirLibellestatus(operation.status)}
          </span>
        </td>

        <td className="p-3 text-sm">{operation.reference || "-"}</td>

        <td className="p-3 text-sm">{operation.note || "-"}</td>

        {/* <td className="p-3 text-sm">{formatDate(operation.createdAt)}</td> */}
        <td className="p-3 text-sm">

          {obtenirLibellestatus(operation.status)==="En attente" ? 
            <button id="approve-btn" className="btn-approve bg-black text-white px-4 py-2 rounded" onClick={()=>Confirm(operation.id)}>
              Approuver
            </button>
            :
            (
              <span className='whitespace-nowrap'>{formatDate(operation.approvedAt)}</span>
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
              {operation?.fund?.name}
            </td>
            <td className="text-right flex justify-end items-center">
                <div className="flex items-center">
                {afficherIconeAction(operation.action)}
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
                <div><span className='px-3 py-1 bg-gray-500 text-white rounded-full text-sm w-fit whitespace-nowrap font-bold flex items-center'><Coins className='h-5 w-5 mr-2'/>{Number(operation.amount)} Dh</span></div>

                {/* <div className="font-semibold">Date d'operation:</div>
                <div>
                  {formatDate(operation.dateOperation)}
                </div> */}
                
                <div className="font-semibold">Status:</div>
                <div>
                  <span className={`px-3 py-1 rounded-full flex items-center w-fit ${getStatusBadgeClass(operation.status)} whitespace-nowrap`}>
                    {operation.status === 'approved' ?<CheckCheck className='h-5 w-5 mr-2'/> : <ClockAlert className='h-5 w-5 mr-2'/>}{obtenirLibellestatus(operation.status)}
                  </span>
                </div>
                
                <div className="font-semibold">Référence:</div>
                <div>{operation.reference || "-"}</div>


                <div className="font-semibold">Notes:</div>
                <div>{operation.note || "-"}</div>
                
                
                <div className="font-semibold">Date de création</div>
                <div>{formatDate(operation.createdAt)}</div>

                <div className="font-semibold">Approuver d'opération</div>
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
                <th className="p-3 text-left text-sm"></th>
                <th className="p-3 text-left text-sm">Caisse</th>
                <th className="p-3 text-left text-sm">Type</th>
                <th className="p-3 text-left text-sm">Montant</th>
                <th className="p-3 text-left text-sm">Date d'operation</th>
                <th className="p-3 text-left text-sm">Status</th>
                <th className="p-3 text-left text-sm">Référence</th>
                <th className="p-3 text-left text-sm">Notes</th>
                {/* <th className="p-3 text-left text-sm">Date de création</th> */}
                <th className="p-3 text-left text-sm">Approuver d'opération</th>
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