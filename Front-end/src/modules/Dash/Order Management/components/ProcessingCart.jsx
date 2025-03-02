import { useState } from "react"
import { Clock, ChevronDown, ChevronUp, Receipt, User, Pizza, Salad, UtensilsCrossed, CheckCircle2, Table2, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ProcessingCart = () => {
    const [showItems, setShowItems] = useState(false)

    const toggleItemsVisibility = () => {
        setShowItems(!showItems)
    }

  
  return (
    <Card className="relative p-4 m-4 w-80 h-fit cursor-pointer group transition-all duration-300 hover:shadow-lg border-l-[5px] border-l-amber-500">
        <div className="flex flex-col" onClick={toggleItemsVisibility}>
        
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className='ml-auto'>
                        No paiement
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                        <Timer className="w-3 h-3 mr-1 animate-pulse" />
                        En Cours
                    </Badge>
                </div>
            </div>

            {/* Order Time */}
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">12:30 PM</span>
            </div>

            {/* Order Number */}
            <div className="flex items-center gap-2 mt-1">
                <Receipt className="w-4 h-4 text-primary" />
                <span className="font-bold text-lg">Commande #1001</span>
            </div>

            {/* Customer Info */}
            <div className="mt-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                    <Table2 className="w-4 h-4" />
                    <span>Table 1</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>John Smith</span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">3 articles</span>
                    </div>
                    <span className="font-semibold text-lg">26.48 Dh</span>
                </div>
            </div>

            {/* Toggle Details */}
            <div className="flex justify-center mt-4">
                <div className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                    {showItems ? (
                    <>
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Masquer les détails</span>
                    </>
                    ) : (
                    <>
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-sm font-medium">Voir les détails</span>
                    </>
                    )}
                </div>
            </div>
        </div>

        {showItems && (
            <div className={`grid transition-all duration-300`}>
                <div className="overflow-hidden">
                    <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-md">
                                    <Pizza className="w-4 h-4 text-primary" />
                                </div>
                                <span>1x Pizza Margherita</span>
                            </div>
                            <span className="font-medium">12.99 Dh</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-md">
                                    <Salad className="w-4 h-4 text-primary" />
                                </div>
                                <span>1x Salade César</span>
                            </div>
                            <span className="font-medium">8.50 Dh</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/10 rounded-md">
                                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                                </div>
                                <span>1x Pain à l'ail</span>
                            </div>
                            <span className="font-medium">4.99 Dh</span>
                        </div>
                    </div>
                </div>
            </div>
        )}



        {/* Action Button */}
        <div className="mt-4 pt-4 border-t border-border">
            <Button
                variant='default'
                className="w-full transition-all bg-orange-100 text-orange-600 hover:bg-orange-200"
            >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marquer comme prêt
            </Button>
        </div>
      
    
    </Card>
  )
}

export default ProcessingCart

