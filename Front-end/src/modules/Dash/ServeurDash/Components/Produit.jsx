import React from 'react'
import ImageSlider from './ImageSlider'
import { ShoppingBasket } from 'lucide-react'
import Styles from './Produit.module.css'


const Produit = () => {
  return (
    <>
        <div className={`${Styles.Produit} w-full h-full rounded-lg shadow p-2 space-y-4`}>
            <div className='rounded-lg overflow-hidden'>
                <ImageSlider />
            </div>

            <div className='space-y-2'>
                <h3 className='text-lg font-medium'>Sushi Yummy</h3>
                <p className='text-xs text-gray-500'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                </p>
            </div>

            <div className='flex justify-between items-center'>
                <p className='text-lg text-[#2d3748] font-medium'>1000 MAD</p>

                <button className='bg-[#f3f4f6] text-[#2d3748] px-3 py-2 rounded-md' title='Ajouter au panier'>
                    <ShoppingBasket />
                </button>
            </div>
        </div>
    </>
  )
}

export default Produit