import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Frown} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen p-4">
        <div className="text-6xl text-black-700 mb-4">
            <Frown className="h-24 w-24" />
        </div>

        <h1 className="text-4xl font-bold text-black-800 mb-2">Page Non Trouvée</h1>

        <p className="text-lg text-gray-600 mb-8 text-center">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg"
        >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Retour à la page précédente
        </button>
    </div>
  );
};

export default NotFound;