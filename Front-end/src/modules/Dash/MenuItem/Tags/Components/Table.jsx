import React ,{ useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import{TrashIcon,PencilIcon } from 'lucide-react'
import { formatDate } from '@/components/dateUtils/dateUtils'
import {useUpdateTag} from '../hooks/useUpdateTag'



const Tableau = ({tags , deleteTag , fetchTags}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tagSelected , setTagSelected] =useState(false);

    const handleDelete = (tag) => {
        setIsModalVisible(true);
        setTagSelected(tag)
    };
    const confirmDelete = () => {
        deleteTag(tagSelected.id); 
        setIsModalVisible(false)
        setTagSelected(null);
    };

    //for Update
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);

    const [formData, setFormData] = useState({ tag: '' });
    const [initialData, setInitialData] = useState({ tag: '' });
    const [id, setId] = useState(null);

    const handleUpdate = (tag) => {
        setFormData({ tag: tag.tag });
        setInitialData({ tag: tag.tag });
        setId(tag.id)
        setIsModalUpdateVisible(true);
    };

    const CloseModel =()=>{
        setIsModalUpdateVisible(false);
        setFormData({
            tag: '',
        })
        resetErrors()
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { errors, updateTag ,alert,resetErrors} = useUpdateTag(id, formData, setFormData, initialData, setInitialData ,CloseModel,fetchTags)





return (
    <>
        <Card className='border-none shadow-none'>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader className="border bg-gray-100">
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Nom du Tag</TableHead>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Date Creation</TableHead>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            tags.length > 0 ? (
                                tags.map((tag) => (
                                <TableRow key={tag.id} className="font-sans">
                                    <TableCell className="text-center p-4 border text-nowrap">{tag.tag}</TableCell>
                                    <TableCell className="text-center p-4 border text-nowrap">{formatDate(tag.createdAt)}</TableCell>
                                    <TableCell className="text-center p-4 text-nowrap border">
                                        <div className="flex justify-center items-center gap-5 lg:gap-8">
                                            <button
                                                onClick={() => handleUpdate(tag)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Modifier"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tag)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Supprimer"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="3" className="text-center p-4">
                                        Aucun Tag trouvé.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>


        {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
                    <p className="mb-4">
                        Êtes-vous sûr de vouloir supprimer le tag : "{tagSelected.tag}""
                    </p>
                    <div className="mt-9 flex justify-end gap-3">
                        <button
                            onClick={() => setIsModalVisible(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={()=> confirmDelete()}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Supprimer
                        </button>
                    </div>
                </div>
            </div>
        )}



        {isModalUpdateVisible && (
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
                        <h3 className="text-lg font-semibold text-gray-800">Modifier le tag "{initialData.tag}" </h3>
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
                                    updateTag(e);
                                }}
                            >
                                Mettre à jour
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </>
  )
}

export default Tableau