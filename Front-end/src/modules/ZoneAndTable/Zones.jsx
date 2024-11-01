import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode } from "lucide-react"

const generateRandomData = (numZones, tablesPerZone) => {
  const zoneNames = [
    "Salle Principale", "Terrasse", "Bar", "Salon Privé", "Mezzanine", 
    "Jardin", "Véranda", "Lounge", "Salle VIP", "Espace Famille",
    "Bistro", "Café", "Brasserie", "Salle de Banquet", "Coin Cosy"
  ];
  const menuItems = [
    { name: "Steak Frites", price: 25 },
    { name: "Salade César", price: 12 },
    { name: "Soupe à l'Oignon", price: 8 },
    { name: "Coq au Vin", price: 22 },
    { name: "Crème Brûlée", price: 7 },
    { name: "Vin Rouge", price: 6 },
    { name: "Café", price: 3 }
  ];

  return Array.from({ length: numZones }, (_, zoneIndex) => ({
    id: zoneIndex + 1,
    name: zoneNames[zoneIndex % zoneNames.length],
    tables: Array.from({ length: tablesPerZone }, (_, tableIndex) => ({
      id: zoneIndex * tablesPerZone + tableIndex + 1,
      number: tableIndex + 1,
      status: ['Disponible', 'Occupée', 'Réservée'][Math.floor(Math.random() * 3)],
      order: Math.random() > 0.5 ? {
        items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
          const item = menuItems[Math.floor(Math.random() * menuItems.length)];
          return { ...item, quantity: Math.floor(Math.random() * 3) + 1 };
        })
      } : null
    }))
  }));
};

const zones = generateRandomData(15, 10);

const getStatusColor = (status) => {
  switch (status) {
    case 'Disponible':
      return 'bg-green-500'
    case 'Occupée':
      return 'bg-red-500'
    case 'Réservée':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
}

export default function Component() {
  const [selectedZone, setSelectedZone] = useState(zones[0])
  const [selectedTable, setSelectedTable] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTableClick = (table) => {
    setSelectedTable(table)
    setIsDialogOpen(true)
  }

  const totalOrderPrice = useMemo(() => {
    if (selectedTable && selectedTable.order) {
      return selectedTable.order.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
    return 0;
  }, [selectedTable]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Gestion de Restaurant</h1>

            <Select onValueChange={(value) => setSelectedZone(zones.find(zone => zone.id === parseInt(value)))}>
            <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Sélectionner une zone" />
            </SelectTrigger>
            <SelectContent>
                {zones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id.toString()}>
                    {zone.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

        {selectedZone && (
            <Card className="w-full border-0 shadow-none">

                <CardContent className="">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4">{selectedZone.name}</h2>
                    <ScrollArea className="h-[60vh] w-full">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                            {selectedZone.tables.map((table) => (
                            <Button
                                key={table.id}
                                onClick={() => handleTableClick(table)}
                                variant="outline"
                                className="w-full h-24 text-sm sm:text-base font-semibold relative"
                            >
                                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(table.status)}`}></div>
                                Table {table.number}
                                {table.order && (
                                <Badge variant="secondary" className="absolute bottom-2 left-2 right-2 text-xs sm:text-sm">
                                    {table.order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} €
                                </Badge>
                                )}
                            </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>

            </Card>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Détails de la Table</DialogTitle>
                </DialogHeader>

                {selectedTable && (
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Zone:</span>
                            <span className="col-span-3">{selectedZone.name}</span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Table:</span>
                            <span className="col-span-3">{selectedTable.number}</span>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Statut:</span>
                            <Badge variant="secondary" className={`col-span-3 ${getStatusColor(selectedTable.status)}`}>
                            {selectedTable.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Commande:</span>
                            <span className="col-span-3">
                            {selectedTable.order ? (
                                <div>
                                {selectedTable.order.items.map((item, index) => (
                                    <p key={index} className="text-sm">
                                    {item.quantity}x {item.name} - {(item.price * item.quantity).toFixed(2)} €
                                    </p>
                                ))}
                                <p className="font-semibold mt-2">Total: {totalOrderPrice.toFixed(2)} €</p>
                                </div>
                            ) : 'Pas de commande active'}
                            </span>
                        </div>

                        <div className="flex justify-center items-center mt-4">
                            <QrCode size={128} />
                        </div>

                        <DialogDescription className="text-center text-sm">
                            Scannez ce code QR pour accéder au menu de la table ou passer une commande
                        </DialogDescription>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    </div>
  )
}