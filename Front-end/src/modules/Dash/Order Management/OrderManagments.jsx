import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import newOrders from "./assests/new.png"
import processing from "./assests/processing.png"
import ready from "./assests/ready.png"
import served from "./assests/served.png"
import NewOrderCart from "./components/NewOrderCart"
import ProcessingCart from "./components/ProcessingCart"
import ReadyCart from "./components/ReadyCarts"
import ServedCart from "./components/ServedCarts"

const ManagmentsOrders = () => {


  return (
    <>
    
        <div className='flex flex-col p-4'>
            <h1 className='text-2xl font-bold font-sans'>Gestion des Commandes</h1>
        </div>

        <Tabs defaultValue="new orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 h-max">
                <TabsTrigger value="all"  className='text-xs h-full py-3'>Tout</TabsTrigger>
                <TabsTrigger value="new orders"  className='text-xs h-full py-2'> <img src={newOrders} alt="new orders" className='h-5 sm:h-10 mr-1' /> Nouvelles Commandes</TabsTrigger>
                <TabsTrigger value="processing" className='text-xs h-full py-2 col-span-2 sm:col-span-1'> <img src={processing} alt="processing" className='h-5 sm:h-10 mr-1' /> En Cours de Préparation</TabsTrigger>
                <TabsTrigger value="ready" className='text-xs h-full py-2'> <img src={ready} alt="ready" className='h-5 sm:h-10 mr-1' /> Prêt à Servir</TabsTrigger>
                <TabsTrigger value="served" className='text-xs h-full py-2'> <img src={served} alt="served" className='h-5 sm:h-10 mr-1' /> Servi</TabsTrigger>
            </TabsList>


            <TabsContent value="new orders">
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <NewOrderCart key={index} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="processing">
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ProcessingCart key={index} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="ready">
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ReadyCart key={index} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="served">  
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ServedCart key={index} />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="all">
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <NewOrderCart key={index} />
                    ))}
                </div>
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ProcessingCart key={index} />
                    ))}
                </div>
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ReadyCart key={index} />
                    ))}
                </div>
                <div className='grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] justify-items-center'>
                    {Array.from({length: 10}).map((_, index) => (
                        <ServedCart key={index} />
                    ))}
                </div>
            </TabsContent>

        </Tabs>
    </>
  )
}

export default ManagmentsOrders