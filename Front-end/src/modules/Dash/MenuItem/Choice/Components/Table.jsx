import React ,{ useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, SearchX, Loader, ExternalLink, XIcon } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { Badge } from '@/components/ui/badge';
import{TrashIcon,PencilIcon } from 'lucide-react'
import { formatDate } from '@/components/dateUtils/dateUtils'
import {useUpdateChoice} from '../hooks/useUpdateChoice'



const Tableau = ({choices ,  deleteChoice , fetchChoices}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [choiceSelected , setchoiceSelected] =useState(false);

    const handleDelete = (choice) => {
        setIsModalVisible(true);
        setchoiceSelected(choice)
    };
    const confirmDelete = () => {
        deleteChoice(choiceSelected.id); 
        setIsModalVisible(false)
        setchoiceSelected(null);
    };

    //for Update
    const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
    const [formData, setFormData] = useState({  attribute: '', choices: [] });
    const [initialData, setInitialData] = useState({ attribute: '', choices: [] });
    const [id, setId] = useState(null);



    const handleUpdate = (choice) => {
        const data = choice.choices?.map(choice => choice.value) || []
        console.log(data)
        setFormData({ attribute: choice.attribute, choices: data });
        setInitialData({  attribute: choice.attribute, choices: data });
        setId(choice.id)
        setIsModalUpdateVisible(true);
    };


    const CloseModel =()=>{
        setIsModalUpdateVisible(false);
        setFormData({
            attribute: '',
            choices: []
        })
        resetErrors()
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const { errors, updateChoice, alert, resetErrors } = useUpdateChoice(id, formData, setFormData, initialData , setInitialData ,CloseModel ,fetchChoices)

    const [pendingChoice, setPendingChoice] = useState('');



    const addChoice = () => {
        if (pendingChoice.trim()) {
          const newChoices = new Set([...(formData.choices || []), pendingChoice.trim()]); 
          setFormData({ ...formData, choices: Array.from(newChoices) }); 
          setPendingChoice(''); 
        }
    };

      
    const removeChoice = (choiceToRemove) => {
        const updatedChoices = formData.choices.filter((choice) => choice !== choiceToRemove); 
        setFormData({ ...formData, choices: updatedChoices }); 
    };



    return (
    <>
        <Card className='border-none shadow-none'>
            <CardContent>
                <Table>
                    <TableHeader className="border bg-gray-100">
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Nom du Choix</TableHead>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Choix</TableHead>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Date Creation</TableHead>
                            <TableHead className="p-3 text-center border text-sm text-black font-bold">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            choices.length > 0 ? (
                                choices.map((choice) => (
                                <TableRow key={choice.id} className="font-sans">
                                    <TableCell className="text-center p-4 border">{choice?.attribute}</TableCell>
                                        <TableCell className="text-center p-4 border">{choice.choices?.map(choice => choice.value).join(' , ') || '-'}</TableCell>
                                    <TableCell className="text-center p-4 border">{formatDate(choice?.createdAt)}</TableCell>
                                    <TableCell className="text-center p-4 text-nowrap border">
                                        <div className="flex justify-center items-center gap-5 lg:gap-8">
                                            <button

                                                onClick={() => handleUpdate(choice)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Modifier"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(choice)}
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
                                        Aucun Choix trouvé.
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
                        Êtes-vous sûr de vouloir supprimer le choice : "{choiceSelected.attribute}""
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
                        <h3 className="text-lg font-semibold text-gray-800">Modifier le Choix "{initialData.attribute}" </h3>
                        <p className="mt-2 text-sm text-gray-600">Tout changement ici affectera les produits du menu.</p>
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
                                <Label htmlFor="attribute" className="text-sm font-medium text-gray-700">
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
                                    updateChoice(e);
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