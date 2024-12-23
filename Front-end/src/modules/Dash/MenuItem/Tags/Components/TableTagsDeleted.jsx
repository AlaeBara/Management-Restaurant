import React ,{ useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import{ RotateCcw } from 'lucide-react'
import { formatDate } from '@/components/dateUtils/dateUtils'

const Tableau = ({tags ,  RestoreTag}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tagSelected , setTagSelected] =useState(false);

    const handleRestore = (tag) => {
        setIsModalVisible(true);
        setTagSelected(tag)
    };
    const confirmRestore = () => {
        RestoreTag(tagSelected.id); 
        setIsModalVisible(false)
        setTagSelected(null);
    };

return (
    <>
        <Card className='border-none shadow-none'>
            <CardContent>
                <Table>
                    <TableHeader className="border border-gray-200">
                        <TableRow className='hover:bg-transparent'>
                            <TableHead className="text-center border">Nom du Tag</TableHead>
                            <TableHead className="text-center border">Date Creation</TableHead>
                            <TableHead className="text-center border">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            tags.length > 0 ? (
                                tags.map((tag) => (
                                <TableRow key={tag.id} className="font-sans font-medium">
                                    <TableCell className="text-center p-4 border">{tag.tag}</TableCell>
                                    <TableCell className="text-center p-4 border">{formatDate(tag.createdAt)}</TableCell>
                                    <TableCell className="text-center p-4 text-nowrap border">
                                        <div className="flex justify-center items-center">
                                            <button
                                                onClick={() => handleRestore(tag)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Supprimer"
                                            >
                                                <RotateCcw  className="h-5 w-5" />
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
                        Êtes-vous sûr de vouloir restaurer le tag "{tagSelected.tag}" ?
                    </p>
                    <div className="mt-9 flex justify-end gap-3">
                        <button
                            onClick={() => setIsModalVisible(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={()=> confirmRestore()}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Restaurer
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

export default Tableau