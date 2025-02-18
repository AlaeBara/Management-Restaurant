import React, { useEffect, useState } from 'react';
import style from './Tags.module.css'
import { useNavigate } from 'react-router-dom'
import {Plus , SearchX ,Loader,ExternalLink} from "lucide-react"
import { ToastContainer, toast } from 'react-toastify';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from '@/components/ui/alert';
import 'react-toastify/dist/ReactToastify.css';
import PaginationNav from '../../UserManagments/User/Components/PaginationNav'
import Spinner from '@/components/Spinner/Spinner';
import {useCreateTag} from './hooks/useCreateTag'
import {useFetchTags} from './hooks/useFetchTags'
import {useDeleteTag} from './hooks/useDeleteTag'
import Tableau from './Components/Table'


const Tags= () => {
    const  navigate = useNavigate()

    const [isModalVisible ,setIsModalVisible] =useState(false)
    const showModel =()=>{
        setIsModalVisible(true);
    }
    const [formData, setFormData] = useState({
        tag: '',
    });
    const CloseModel =()=>{
        setIsModalVisible(false);
        setFormData({
            tag: '',
        })
        resetErrors()
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { tags, totalTags, Isloading, message, fetchTags } = useFetchTags()

    const { issLoading, alert, errors,  fetchCreateTag , resetErrors}= useCreateTag(formData, CloseModel, fetchTags)



    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const totalPages = Math.ceil(totalTags / limit);
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
    const endItem = Math.min(currentPage * limit, totalTags);

    //fix problem of pagination (delete last item in page <=2  => he return to Previous page)
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);
  
    useEffect(() => {
        fetchTags({page: currentPage, limit :limit});
    }, [currentPage, limit, fetchTags]);


    const { deleteTag }= useDeleteTag(fetchTags , currentPage , limit)



  return (
    <div className={style.container}>

        <ToastContainer/>

        <div className={style.Headerpage}>
            <div>
                <h1 className={`${style.title} !mb-0 `}>Gestion Des Tags De Menu</h1>
                <p className="text-base text-gray-600 mt-0"> Gérer et organiser vos tags de menu pour une meilleure classification des plats. Vous pouvez ajouter, consulter et configurer les tags facilement.</p>
            </div>
        </div>
    

        <div className={style.Headerpage2}>
            <button onClick={() => navigate('/dash/tags/tag-supprimés')} className={style.showdeleteuser}>
                <ExternalLink className="mr-3 h-4 w-4 "/>Tag Supprimés
            </button> 
            <button onClick={() => showModel()} className={style.showFormButton}>
                <Plus className="mr-3 h-4 w-4 " /> Ajouter Tag
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
                    {tags.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1" >
                                <Tableau tags={tags} deleteTag={deleteTag} fetchTags={fetchTags}/>
                            </div>
                            <PaginationNav
                                currentPage={currentPage}
                                totalPages={totalPages}
                                startItem={startItem}
                                endItem={endItem}
                                numberOfData={totalTags}
                                onPreviousPage={handlePreviousPage}
                                onNextPage={handleNextPage}
                            />
                        </>
                    ) : (
                    <div className={style.notfound}>
                        <SearchX className={style.icon} />
                        <h1>Aucun Tag trouvé</h1>
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
                        <h3 className="text-lg font-semibold text-gray-800">Ajouter un nouveau tag</h3>
                        <p className="mt-2 text-sm text-gray-600">
                        Veuillez entrer les détails du tag ci-dessous. Cette action aidera à organiser efficacement votre menu.
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
                                    Nom du tag <span className='text-red-500 text-base'>*</span>
                                </Label>
                                <Input
                                    id="tag"
                                    name="tag"
                                    placeholder="Nom du tag"
                                    className="w-full"
                                    onChange={handleChange}
                                    value={formData.tag}
                                />
                                {errors.tag && (
                                    <p className="text-xs text-red-500 mt-1">{errors.tag}</p>
                                )} 
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
                                    fetchCreateTag ();
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

export default Tags