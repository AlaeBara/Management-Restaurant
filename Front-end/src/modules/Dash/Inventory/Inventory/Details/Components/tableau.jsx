import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CirclePlus , 
  CircleMinus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import {formatDate} from '@/components/dateUtils/dateUtils'
import { useParams } from 'react-router-dom';





// Liste des types de mouvements en français
const typesDeMovements = [
  { value: 'allocation_product', label: 'Allocation de produit' },
  { value: 'wastage', label: 'Gaspillage' },
  { value: 'supplier_return', label: 'Retour fournisseur' },
  { value: 'adjustment', label: 'Ajustement' },
  { value: 'inventory_count', label: 'Inventaire comptage' },
  { value: 'inventory_initial', label: 'Inventaire initial' }
];

const TableauMouvementsInventaire = ({ data }) => {
  const [lignesExtendues, setLignesExtendues] = useState({});

  const {id_iventory}=useParams()

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
      ? <CirclePlus  {...proprietesIcone} /> 
      : <CircleMinus {...proprietesIcone} />;
  };

  // Fonction pour obtenir le libellé du type de mouvement
  const obtenirLibelleTypeMouvement = (valeur) => {
    const type = typesDeMovements.find(t => t.value === valeur);
    return type ? type.label : valeur;
  };

  const LigneDesktop = ({ movement, isLast }) => (
    <tr className={`hidden md:table-row ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <td className="p-3 text-sm">{obtenirLibelleTypeMouvement(movement.movementType)}</td>
      <td className="p-3 text-sm">
        <div className="flex items-center">
          {/* {afficherIconeAction(movement.movementAction)}
          <span className={movement.movementAction === 'increase' ? 'text-green-500 mr-2' : 'text-red-500 mr-2'}>
            {movement.movementAction === 'increase' ? 'Augmentation' : 'Diminution'}
          </span> */}
          <>
            {movement.movementAction === 'both' &&  id_iventory === movement.inventoryId ? (
              <>
                
                {afficherIconeAction("decrease")}
                <span className="text-red-500 mr-2">Diminution</span>
              </>
            ) : movement.movementAction === 'both' ? (
              <>
                {afficherIconeAction("increase")}
                <span className="text-green-500 mr-2">Augmentation</span>
              </>
            ) : (
              <>
                {afficherIconeAction(movement.movementAction)}
                <span
                  className={
                    movement.movementAction === 'increase'
                      ? 'text-green-500 mr-2'
                      : 'text-red-500 mr-2'
                  }
                >
                  {movement.movementAction === 'increase' ? 'Augmentation' : 'Diminution'}
                </span>
              </>
            )}
          </>

        </div>
      </td>
      <td className="p-3 text-sm">
        {formatDate(movement.movementDate)}
      </td>
      <td className="p-3 text-sm">{movement.quantity} {movement.inventory.productUnit}</td>
      <td className="p-3 text-sm">
        {movement?.transfertToInventory?.sku && <>{movement?.inventory.sku} → {movement?.transfertToInventory?.sku}</> || '-'}
      </td>

      <td className="p-3 text-sm">{movement.notes || "-"}</td>
      <td className="p-3 text-sm">{movement.reason || "-"}</td>
      <td className="p-3 text-sm">{formatDate(movement.updatedAt)}</td>
    </tr>
  );

  const LigneMobile = ({ movement, isLast }) => {
    const estEtendue = lignesExtendues[movement.id];

    return (
      <>
        <tr 
          className={`md:hidden grid grid-cols-1 gap-2 p-2 ${!isLast ? 'border-b' : ''} cursor-pointer`}
          onClick={() => basculerExtensionLigne(movement.id)}
        >
          <td className="font-bold">
            {movement.inventory.productName}
          </td>
          <td className="text-right flex justify-end items-center">
            <div className="flex items-center">
              <>
                {movement.movementAction === 'both' &&  id_iventory === movement.inventoryId ? (
                  <>
                    
                    {afficherIconeAction("decrease")}
                    <span className="text-red-500 mr-2">Diminution</span>
                  </>
                ) : movement.movementAction === 'both' ? (
                  <>
                    {afficherIconeAction("increase")}
                    <span className="text-green-500 mr-2">Augmentation</span>
                  </>
                ) : (
                  <>
                    {afficherIconeAction(movement.movementAction)}
                    <span
                      className={
                        movement.movementAction === 'increase'
                          ? 'text-green-500 mr-2'
                          : 'text-red-500 mr-2'
                      }
                    >
                      {movement.movementAction === 'increase' ? 'Augmentation' : 'Diminution'}
                    </span>
                  </>
                )}
              </>
              {estEtendue ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
            </div>
          </td>
        </tr>
        {estEtendue && (
          <tr className="md:hidden">
            <td colSpan="2" className="p-2 bg-gray-50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-semibold">Type de Mouvement:</div>
                <div>{obtenirLibelleTypeMouvement(movement.movementType)}</div>
                <div className="font-semibold">Date du Mouvement:</div>
                <div>
                  {formatDate(movement.movementDate)}
                </div>
                
                <div className="font-semibold">Quantité:</div>
                <div>{movement.quantity} {movement.inventory.productUnit}</div>
                <div className="font-semibold">Transfert :</div>
                <div>{movement?.transfertToInventory?.sku || "-"}</div>
                
                <div className="font-semibold">Notes:</div>
                <div>{movement.notes || "-"}</div>
                
                <div className="font-semibold">Raison:</div>
                <div>{movement.reason || "-"}</div>
              
                <div className="font-semibold">Date de création</div>
                <div>{formatDate(movement.updatedAt)}</div>
                
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mouvements d'Inventaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Aucun mouvement d'inventaire</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-5 shadow-none border-0">
      <CardHeader>
        <CardTitle>Mouvements d'Inventaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm">Type</th>
                <th className="p-3 text-left text-sm">Action</th>
                <th className="p-3 text-left text-sm">Date Movement</th>
                <th className="p-3 text-left text-sm">Quantité</th>
                <th className="p-3 text-left text-sm">Transfert</th>
                <th className="p-3 text-left text-sm">Notes</th>
                <th className="p-3 text-left text-sm">Raison</th>
                <th className="p-3 text-left text-sm">Date de création</th>
              </tr>
            </thead>
            <tbody>
              {data.map((movement, index) => (
                <React.Fragment key={movement.id}>
                  <LigneDesktop 
                    movement={movement} 
                    isLast={index === data.length - 1} 
                  />
                  <LigneMobile 
                    movement={movement} 
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