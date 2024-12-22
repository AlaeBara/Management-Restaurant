import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Phone, MapPin, Printer, Mail,ChevronRight} from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Suplier = ({purchase}) => {
  return (
    <>
        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl'>

            <CardHeader className='border-b border-gray-100 bg-gray-50 mb-5 rounded-tl-2xl rounded-tr-2xl'>
                <CardTitle className='text-xl lg:text-2xl font-bold text-gray-800 flex items-center'>
                    <ChevronRight className='mr-2 text-primary' />
                    Informations Fournisseur
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarFallback>{purchase?.supplier?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-base font-medium">{purchase?.supplier?.name}</p>
                        <p className="text-sm text-muted-foreground">Fournisseur</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-4 text-base  font-normal">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{purchase?.supplier?.phone || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-base font-normal">
                        <Printer className="h-4 w-4 text-muted-foreground" />
                        <span>{purchase?.supplier?.fax || "-"}</span>
                    </div>
                    <a href="mailto:baraalaeddine@gmail.com" className="flex items-center space-x-4 text-base  hover:underline font-normal">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{purchase?.supplier?.email}</span>
                    </a>
                    <div className="flex items-center space-x-4 text-base  font-normal">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{purchase?.supplier?.address || "-"}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    
    
    </>
  )
}

export default Suplier