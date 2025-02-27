import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle,ChevronDown,ChevronUp,Coins,CheckCheck,ClockAlert} from 'lucide-react';
import {formatDate} from '@/components/dateUtils/dateUtils'
import { useFetchFunds } from '@/modules/Dash/Fund/hooks/useFetchFunds';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";




// Liste des types de mouvements en français
const transactionTypes = [
  { value: 'expense', label: 'Dépense' },
];

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvé' },
];

const TableauExpense = ({ data , Confirm , ChangeFundSource }) => {
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




  //popup pour changer la caisse d'une opération
  const { funds,fetchFunds } = useFetchFunds()

  useEffect(() => {
    fetchFunds({fetchAll:true});
  }, [fetchFunds]);

  const [formData, setFormData] = useState({
    fundId: '',
    operationId:''
  });
  const [isModalVisible ,setIsModalVisible] =useState(false)

  const [oldFund ,setOldFund] =useState(null)
  const [errors ,setErrors] =useState({})
  const [issLoading ,setIssLoading] =useState(false)

  const showModel =(idoperation , oldFund)=>{
    setIsModalVisible(true);
    setFormData({
      operationId: idoperation
    })
    setOldFund(oldFund)
  }

  const CloseModel =()=>{
    setIsModalVisible(false);
    setFormData({
      fundId: '',
      operationId:''
    })
    setErrors({})
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SubmitChangeFundSource = ()=>{
    if(!formData.fundId){
      setErrors({fundId: "Veuillez sélectionner une caisse"});
      return;
    }
    setIssLoading(true);
    ChangeFundSource(formData,CloseModel);
    setIssLoading(false);
  }







  const LigneDesktop = ({ operation, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>

      <td className="p-3 text-sm">
        <div className="flex items-center">
          {afficherIconeAction(operation.action)}
        </div>
      </td>

      <td className="p-3 text-sm">{operation?.fund?.name}</td>
      
      <td className="p-3 text-sm">{<span className="px-3 py-1 bg-gray-500 text-white rounded-full w-fit text-sm font-bold flex items-center">{operation?.expenseType?.name}</span> || '-'}</td>

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

      <td className="p-3 text-sm">
        {obtenirLibellestatus(operation.status)==="En attente" ? 
          <div className='flex items-center gap-2'>
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

            <button id="approve-btn" className="btn-approve bg-green-600 text-white px-4 py-2 rounded" onClick={()=>{showModel(operation.id ,operation?.fund?.name )}}
            >
              Changer
            </button>
          </div>
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
                    <div className='flex flex-col gap-2'>
                      <button id="approve-btn" className="btn-approve w-fit bg-black text-white px-4 py-2 rounded" onClick={() => {
                          if (operation.operationType === 'transfer') {
                            confirmTransferOperation(operation.id);
                          } else {
                            Confirm(operation.id);
                          }
                        }}
                      >
                        Approuver
                      </button>

                      <button id="approve-btn" className="btn-approve w-fit bg-green-600 text-white px-4 py-2 rounded" onClick={()=>{showModel(operation.id ,operation?.fund?.name )}}
                      >
                        Changer
                      </button>
                    </div>
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


      {isModalVisible && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={CloseModel}
          />
          
          <div 
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Changer la caisse d'une opération</h3>
              <p className="mt-2 text-sm text-gray-600">
                Veuillez sélectionner la nouvelle caisse pour l'opération.
              </p>
            </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">

                  <div className="space-y-2">
                    <Label htmlFor="tag" className="text-sm font-medium text-gray-700">
                      Ancienne caisse
                    </Label>
                    <Input
                      id="operationId"
                      name="operationId"
                      value={oldFund || ""}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tag" className="text-sm font-medium text-gray-700">
                      Nouvelle caisse <span className='text-red-500 text-base'>*</span>
                    </Label>
                    <Select
                      id="fundId"
                      name="fundId"
                      value={formData.fundId  || ""}
                      onValueChange={(value) => handleChange({ target: { name: 'fundId', value } })}
                    >
                      <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez nom du fond de caisse" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {funds.length > 0 ? (
                          funds.filter(fund => fund.name !== oldFund)
                            .map((fund) => (
                              <SelectItem key={fund.id} value={fund.id}>
                                {fund.name} ({fund.sku})
                              </SelectItem>
                            ))
                        ) : (
                          <p className='text-sm'>Aucune donnée disponible</p>
                        )}
                      </SelectContent>
                    </Select>
                      {errors.fundId && ( 
                        <p className="text-xs text-red-500 mt-1">{errors.fundId}</p>
                      )} 
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={CloseModel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    Annuler
                  </button>

                  <Button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      SubmitChangeFundSource();
                    }}
                    disabled={issLoading}
                  >
                    {issLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>En traitement...</span>
                      </div>
                      ) : (
                      "Changer"
                    )}
                    </Button>
                </div>
              </form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TableauExpense;