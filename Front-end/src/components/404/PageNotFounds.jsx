import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Frown} from 'lucide-react';
import { Illustration } from './Illustration';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2d3748] p-6">
        <Card className="w-full max-w-2xl bg-transparent shadow-none border-none">
            <CardHeader className="relative">
                <Illustration className="absolute inset-0 opacity-65 text-[#6e7c98]" />
                <div className="relative z-10 pt-10 sm:pt-32">
                    <h1 className="text-4xl text-center font-extrabold text-white">
                        Page non trouvée
                    </h1>
                </div>
            </CardHeader>
            <CardContent className="relative z-10 text-center">
                <h1 className="mx-auto max-w-md text-blue-100">
                    La page que vous essayez d'ouvrir n'existe pas. Vous avez peut-être mal tapé l'adresse, ou la page a été déplacée vers une autre URL. 
                </h1>
            </CardContent>
            <CardFooter className="relative z-10 flex justify-center">
                <Button  onClick={() => navigate(-1)} variant="outline" className="bg-white text-lg text-[#2d3748] py-6 px-4 rounded-ms">
                    Retour à la page précédente
                </Button>
            </CardFooter>
        </Card>
  </div>
  );
};

export default NotFound;