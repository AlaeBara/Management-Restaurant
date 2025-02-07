import React, { useEffect, useState } from 'react';
import style from './Choice.module.css'
import { useNavigate } from 'react-router-dom'
import { Plus, SearchX, Loader, ExternalLink, XIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';


import {useCreateChoice} from './hooks/useCreateChoice'
import {useFetchChoices} from './hooks/useFetchChoice'
import {useDeleteChoice} from './hooks/useDeleteChoice'
import Tableau from './Components/Table'


const Choice = () => {
    const  navigate = useNavigate()

    // InputTags Logic 
    const [pendingChoice, setPendingChoice] = useState('');

    const [isModalVisible ,setIsModalVisible] =useState(false)
    const showModel =()=>{
        setIsModalVisible(true);
    }
    const [formData, setFormData] = useState({
        attribute: '',
        choices: [],
    });

    const CloseModel =()=>{
        setIsModalVisible(false);
        setFormData({
            attribute: '',
        })
        resetErrors()
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { choices, totalChoices, Isloading, message, fetchChoices } = useFetchChoices()

    const { issLoading, alert, errors,  fetchCreateChoice , resetErrors}= useCreateChoice(formData, CloseModel, fetchChoices)



    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalChoices / limit);
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
    const endItem = Math.min(currentPage * limit, totalChoices);
  
    useEffect(() => {
        fetchChoices({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchChoices]);


    const { deleteChoice }= useDeleteChoice(fetchChoices , currentPage , limit)


    const addChoice = () => {
        if (pendingChoice.trim()) {
          const newChoices = new Set([...(formData.choices || []), pendingChoice.trim()]); 
          setFormData({ ...formData, choices: Array.from(newChoices) }); // Update choices in formData
          setPendingChoice(''); 
        }
    };

      
    const removeChoice = (choiceToRemove) => {
        const updatedChoices = formData.choices.filter((choice) => choice !== choiceToRemove); // Remove the choice
        setFormData({ ...formData, choices: updatedChoices }); // Update choices in formData
    };


    


  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Choix</h1>
                <p className="text-base text-gray-600 mt-0"> Gérer et organiser vos choix de menu pour une meilleure classification des plats. Vous pouvez ajouter, consulter et configurer les choix facilement.</p>
            </div>      
        </div>
    

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/choix/choix-supprimés')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Choix Supprimés
            </button> 
            <button onClick={() => showModel()} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Choix
            </button> 
        </div>

        <div>
            {Isloading ? (
                <div className="mt-5">
                    <Spinner title="Chargement des données..." />
                </div>
            ) : message ? (
            <div className={style.notfound}>
                <Ban className={style.icon} />
                <span>{message}</span>
            </div>
            ) : (
                <>
                    {choices.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau choices={choices}  deleteChoice={deleteChoice} fetchChoices={fetchChoices}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalChoices}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Choix trouvé</h1>
                    </div>
                    )}
                </>
            )}
        </div>


        {isModalVisible && (
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center"
                role="dialog"
                aria-modal="true"
            >
                <div 
                    className="fixed inset-0 bg-black/50 transition-opacity"
                    onClick={CloseModel}
                />
                
                <div 
                    className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Ajouter un nouveau Choix</h3>
                        <p className="mt-2 text-sm text-gray-600">
                        Veuillez entrer les détails du Choix ci-dessous. Cette action aidera à organiser efficacement votre menu.
                        </p>
                    </div>

                    {alert?.message && (
                        <Alert
                            variant={alert.type === "error" ? "destructive" : "success"}
                            className={`mt-4 mb-4 text-center ${
                                alert.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                            }`}
                        >
                            <AlertDescription>{alert.message}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="tag" className="text-sm font-medium text-gray-700">
                                    Nom du Choix <span className='text-red-500 text-base'>*</span>
                                </Label>
                                <Input
                                    id="attribute"
                                    name="attribute"
                                    placeholder="Exemple : Sauce"
                                    className="w-full"
                                    onChange={handleChange}
                                    value={formData.attribute}
                                />
                                {errors.attribute && (
                                    <p className="text-xs text-red-500 mt-1">{errors.attribute}</p>
                                )} 
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tag" className="text-sm font-medium text-gray-700">
                                    Choix
                                </Label>
                                <div className="flex gap-2">

                                    <Input
                                        value={pendingChoice}
                                        onChange={(e) =>  setPendingChoice(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ',') {
                                                e.preventDefault();
                                                addChoice();
                                            }
                                        }}
                                        placeholder="Exemple : Sauce andalose , Sauce biggy"
                                    />

                                    <Button type="button" variant="secondary" className="border" onClick={addChoice}>
                                        Ajouter
                                    </Button>
                                </div>

                                <div className="rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center mt-2">
                                    {formData.choices?.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {tag}
                                            <button type="button" className="w-3 ml-2" onClick={() => removeChoice(tag)}>
                                                <XIcon className="w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={CloseModel}
                                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                            >
                                Annuler
                            </button>
                            <Button
                                type="submit"
                                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                                onClick={(e) => {
                                    e.preventDefault();
                                    fetchCreateChoice();
                                }}
                                disabled={issLoading}
                            >
                                {issLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader className="h-4 w-4 animate-spin" />
                                        <span>En traitement...</span>
                                    </div>
                                    ) : (
                                    "Ajouter"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  )
}

export default Choice