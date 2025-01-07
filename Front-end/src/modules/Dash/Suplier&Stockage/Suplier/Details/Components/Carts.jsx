import React, { useEffect } from 'react';
import { Wallet, Coins, Calendar } from 'lucide-react';
import {useFetchPurchasesOfSuppler} from '../hooks/useFetchPurchasesOfSuppler'
import { useParams } from 'react-router-dom';

const Carts = () => {

    const {id} =useParams()
    const {supplierPurchases, loading, error, fetchSupplierPurchases} = useFetchPurchasesOfSuppler(id)
    useEffect(()=>{
        fetchSupplierPurchases()
    },[])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      
        <div className="bg-white rounded-xl border p-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gray-100 rounded-full  flex items-center justify-center">
                <span className="text-4xl absolute top-10 right-10"><Wallet className="w-8 h-8" /></span> 
            </div>
            <h2 className="text-base font-medium text-gray-600"> Montant Total TTC</h2>
            <p className="text-3xl font-semibold mt-2">{Number(supplierPurchases.totalAmountTTC)} DH</p>
        </div>

        <div className="bg-white rounded-xl border p-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl absolute top-10 right-10 "><Coins className="w-8 h-8" /></span> 
            </div>
            <h2 className="text-base font-medium text-gray-600">Montant Total Payé</h2>
            <p className="text-3xl font-semibold mt-2">{Number(supplierPurchases.totalPaidAmount)} DH</p>
        </div>

        <div className="bg-white rounded-xl border p-6 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gray-100 rounded-full  flex items-center justify-center">
                <span className="text-4xl absolute top-10 right-10 "><Calendar className="w-8 h-8" /></span> 
            </div>
            <h2 className="text-base font-medium text-gray-600">Montant Restant à Payer</h2>
            <p className="text-3xl font-semibold mt-2">{Number(supplierPurchases.totalRemainingAmount)} DH</p>
        </div>
    </div>
  );
};

export default Carts;