import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PaginationNav = ({
    currentPage,
    totalPages,
    startItem,
    endItem,
    numberOfData,
    onPreviousPage,
    onNextPage
}) => {
    return (
        <nav className="flex flex-col items-center justify-between space-y-4  mt-5 sm:flex-row sm:space-y-0 sm:px-6 lg:px-8">
            <div className="text-sm text-muted-foreground">
                Affichage de <span className="font-medium">{startItem}</span> à{' '}
                <span className="font-medium">{endItem}</span> sur{' '}
                <span className="font-medium">{numberOfData}</span> résultats
            </div>

            <div className="flex items-center space-x-2 text-sm font-medium">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                </Button>

                <div className="text-muted-foreground">
                    <span className='text-sm'> Page</span>  <span className="font-bold text-sm">{currentPage}</span> sur{' '}
                    <span className="font-bold text-sm">{totalPages}</span>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </nav>
    );
};

export default PaginationNav;
