import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode } from "lucide-react"

const TableShape = ({ colors }) => {
  // Default colors if none provided
  const defaultColors = {
    table: 'fill-gray-100 stroke-gray-500',
    chair: 'fill-gray-50 stroke-gray-400',
    surface: 'fill-gray-50/50'
  };

  const tableColors = colors || defaultColors;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* Four chairs rotated around the table */}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 100 100)`}>
          <g transform="translate(100 45)" filter="url(#shadow)">
            <rect
              x="-12"
              y="-5"
              width="24"
              height="8"
              rx="2"
              className={tableColors.chair}
            />
            <rect
              x="-10"
              y="5"
              width="20"
              height="16"
              rx="2"
              className={tableColors.chair}
            />
          </g>
        </g>
      ))}

      {/* Central table */}
      <g filter="url(#shadow)">
        {/* Outer circle */}
        <circle
          cx="100"
          cy="100"
          r="25"
          className={tableColors.table}
        />
        
        {/* Inner surface */}
        <circle
          cx="100"
          cy="100"
          r="20"
          className={tableColors.surface}
        />

        {/* Dotted border */}
        <circle
          cx="100"
          cy="100"
          r="25"
          fill="none"
          className="stroke-current"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </g>
    </svg>
  );
};

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

const TableVisual = ({ number, status, onClick }) => {
  const getStatusColors = (status) => {
    switch (status) {
      case 'Disponible':
        return {
          table: 'fill-green-100 stroke-green-500',
          chair: 'fill-green-50 stroke-green-400',
          surface: 'fill-green-50/50'
        }
      case 'Occupée':
        return {
          table: 'fill-red-100 stroke-red-500',
          chair: 'fill-red-50 stroke-red-400',
          surface: 'fill-red-50/50'
        }
      case 'Réservée':
        return {
          table: 'fill-yellow-100 stroke-yellow-500',
          chair: 'fill-yellow-50 stroke-yellow-400',
          surface: 'fill-yellow-50/50'
        }
      default:
        return {
          table: 'fill-gray-100 stroke-gray-500',
          chair: 'fill-gray-50 stroke-gray-400',
          surface: 'fill-gray-50/50'
        }
    }
  }

  return (
    <div 
      className="relative w-full aspect-square cursor-pointer transform transition-all hover:scale-105"
      onClick={onClick}
    >
      <TableShape colors={getStatusColors(status)} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{number}</span>
      </div>
    </div>
  )
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
    <div className="container mx-auto max-w-full">
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
        <Card className="w-full border-0 shadow-none mt-8">
          <CardContent>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">{selectedZone.name}</h2>
            <ScrollArea className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 p-4">
                {selectedZone.tables.map((table) => (
                  <TableVisual
                    key={table.id}
                    number={table.number}
                    status={table.status}
                    onClick={() => handleTableClick(table)}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
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
                <Badge variant="secondary" className={`col-span-3 w-fit ${
                  selectedTable.status === 'Disponible' ? 'bg-green-500' : 
                  selectedTable.status === 'Occupée' ? 'bg-red-500' : 'bg-yellow-500'
                }`}>
                  {selectedTable.status}
                </Badge>
              </div>

              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <span className="font-bold">Commande:</span>
                <span className="col-span-5">
                  {selectedTable.order ? (
                    <div>
                      {selectedTable.order.items.map((item, index) => (
                        <p key={index} className="text-sm text-center">
                          {item.quantity}x {item.name} - {(item.price * item.quantity).toFixed(2)} €
                        </p>
                      ))}
                      <p className="font-semibold mt-2 text-center">Total: {totalOrderPrice.toFixed(2)} €</p>
                    </div>
                  ) : <p className="text-sm text-center">Pas de commande active</p>}
                </span>
              </div>

              
              <hr />
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