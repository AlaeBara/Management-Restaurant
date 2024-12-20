import React, { useEffect, useState } from 'react'
import {Ban,ArrowLeft} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "@/components/ui/button"
import {usePurchase} from './hooks/useFetchPurchase'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '@/components/Spinner/Spinner'
import Suplier  from './Components/Suplier'
import Payment from './Components/Payment'
import PurchaseComponent from './Components/purchase'

const AchatDetail = () => {

    const navigate = useNavigate()

    const { id } = useParams();

    const { purchase, isLoading, error, fetchPurchase} = usePurchase();

    useEffect(() => {
        fetchPurchase(id);
    }, [id]);

    
  return (

    <>
        <ToastContainer />
        <div className="sm:pl-0 md:pl-5 lg:pl-5 " onClick={()=>navigate('/dash/achats')}>
            <Button  variant="outline" size="ms" className='border-0 shadow-none hover:bg-transparent'>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux achats
            </Button>
        </div>

        {isLoading ? (
            <div className='flex items-center justify-center h-full'>
                <Spinner title="Chargement des Catégories..." />
            </div>
            ) : error ? (
            <div className='flex flex-col items-center justify-center h-full'>
                <Ban className="w-[80px] h-[80px] text-[#f44336] mb-[20px]" />
                <span>{error}</span>
            </div>
            ) : (

        <div className='grid grid-cols-1  gap-2 sm:p-0 md:p-5 lg:p-5 space-y-6'>
            <Suplier purchase={purchase}/>
            <PurchaseComponent purchase={purchase} />
            <Payment purchase={purchase} fetchPurchase={fetchPurchase}/>
        </div>

        )
    }
    </>
)
}

export default AchatDetail

