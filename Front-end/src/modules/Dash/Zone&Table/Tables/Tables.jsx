import React, { useEffect, useState } from 'react';
import style from './Tables.module.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '@/components/Spinner/Spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFetchZone } from './Hooks/useFetchZone';
import { useFetchTableOfZone } from './Hooks/useFetchTableOfZone';
import { Ban, SearchX,AlertTriangle} from "lucide-react"
import TableCart from './Components/TableCart'
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'


const Zones = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    // Fetch zones state
    const { zones, isloading: isLoadingZones, message, fetchZones } = useFetchZone();

    // Fetch tables state
    const { tables,  totalTables, isloading: isLoadingTables, error, fetchTableOfZone } = useFetchTableOfZone();

    const [selectedZone, setSelectedZone] = useState(null);

    //pagination
    const totalPages = Math.ceil(totalTables / limit);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
    };
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, totalTables);

    useEffect(() => {
        fetchZones({fetchAll:true});
    }, [fetchZones]);

    useEffect(() => {
        if (selectedZone) {
            fetchTableOfZone({ page: currentPage, limit, id: selectedZone })
                .catch((err) => console.error("Erreur lors du chargement des tables :", err));
        }
    }, [currentPage, selectedZone, limit, fetchTableOfZone]);
    
    const handleZoneChange = (zoneId) => {
        setSelectedZone(zoneId);
        setCurrentPage(1); // Reset to page 1 when zone changes
    };
    

    return (
        <div className={style.container}>
            <ToastContainer />

            <div className={style.Headerpage}>
                <div>
                    <h1 className={`${style.title} !mb-0`}>Gestion Des Tables</h1>
                    <p className="text-base text-gray-600 mt-0">
                    Simplifiez la gestion de vos zones grâce à cette interface intuitive. Sélectionnez une zone pour visualiser ses tables. Ajoutez, modifiez ou configurez les zones de manière simple et efficace.
                    </p>
                </div>

            </div>



            {isLoadingZones ? (
                <Spinner title="Chargement des Zones..." />
            ) : message ? (
                <div className={style.notfound}>
                    <Ban className={style.icon} />
                    <span>{message }</span>
                </div>
                ) : (
                <div className="p-0 max-w-sm mb-10">
                    <div className="space-y-2">
                        <Label htmlFor="parentZone">Zone</Label>
                            <Select
                                id="parentZone"
                                name="parentZone"
                                onValueChange={handleZoneChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner la zone parent" />
                                </SelectTrigger>
                                <SelectContent>
                                    {zones.map((zone) => (
                                        <SelectItem key={zone.id} value={zone.id}>
                                            {zone.zoneLabel}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <p className="text-xs text-gray-600 mt-0">
                            Sélectionnez une zone pour afficher les tables qui y sont associées. Cela vous permettra de gérer les tables spécifiques à chaque espace.
                        </p>
                    </div>
                </div>
            )}


            {selectedZone ? 
                <div>
                    {isLoadingTables ? (
                        <div className={style.spinner}>
                            <Spinner title="Chargement des Tables..." />
                        </div>
                        ) : error ? (
                        <div className={style.notfound}>
                            <Ban className={style.icon} />
                            <span>{error}</span>
                        </div>
                    ) : (
                        <>
                            {tables.length > 0 ? (
                            <>
                                <div className={style.userGrid}>
                                    {tables.map(table => (
                                        <TableCart key={table.id} table={table}/>
                                    ))}
                                </div>

                                <PaginationNav
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    startItem={startItem}
                                    endItem={endItem}
                                    numberOfData={totalTables}
                                    onPreviousPage={handlePreviousPage}
                                    onNextPage={handleNextPage}
                                />
                            </>
                            ) : (
                            <div className={style.notfound}>
                                <SearchX className={style.icon} />
                                <h1>Aucun Zone trouvé</h1>
                            </div>
                            )}
                        </>
                    )}
                </div>
                :
                    <div className={style.notfound}>
                        <AlertTriangle className={style.icon2} />
                        <h1>Veuillez choisir une zone avant d'afficher les tables.</h1>
                    </div>

            }






        </div>
    );
};

export default Zones;
