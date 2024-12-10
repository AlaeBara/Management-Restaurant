import React, { useState , useEffect} from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../../../../components/Spinner/Spinner';
import useFetchUserData from '../hooks/useFetchUserData';
import useUpdateUser from '../hooks/useUpdateUser';
import UserStatus from './UserStatus'; 
import {useRoles} from '../hooks/useFetchRoles'



export default function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams();

    

    const { roles, fetchRoles } = useRoles();

    useEffect(() => {
        fetchRoles();
    }, []);
    const { formData, setFormData, originalData, isLoading, setOriginalData , messageError } = useFetchUserData(id);
    const { updateSubmit, errors ,alert } = useUpdateUser(id, formData, setFormData, originalData, setOriginalData);

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


  return (
    <>
        <ToastContainer />
        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à Jour les Informations Utilisateur</h1>
            <p className="text-base text-gray-600">Complétez les champs ci-dessous pour actualiser les informations de l’utilisateur.</p>
        </div>


        {isLoading ? (
            <div className="flex flex-col items-center justify-center my-10">
                <Spinner title="Chargement des données, veuillez patienter..." />
            </div>
        ) : messageError ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Erreur</p>
                <p className="break-words">{messageError}</p>
            </div>
        ) : (

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">

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
                        <form onSubmit={updateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstname">Prénom</Label>
                                    <Input
                                        id="firstname"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="Prénom"
                                    />
                                    {errors.firstname && <p className="text-xs text-red-500 mt-1">{errors.firstname}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastname">Nom</Label>
                                    <Input
                                        id="lastname"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="Nom"
                                    />
                                    {errors.lastname && <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nom d'utilisateur</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Nom d'utilisateur"
                                    />
                                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Genre</Label>
                                    <Select
                                        name="gender"
                                        value={formData.gender}
                                        onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}
                                    >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Sélectionnez le genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Masculin</SelectItem>
                                        <SelectItem value="female">Féminin</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adresse</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        placeholder="Adresse"
                                    />
                                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        placeholder="Numéro de Téléphone"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    placeholder="Mot de passe"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            

                            <div className="space-y-2">
                                <Label htmlFor="status">Statut</Label>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Sélectionner le statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(UserStatus)
                                          .filter((statusValue) => statusValue !== 'email-unverified' || formData.status === 'email-unverified')
                                            .map((statusValue) => (
                                                <SelectItem key={statusValue} value={statusValue}>
                                                    {statusValue.charAt(0).toUpperCase() + statusValue.slice(1).replace(/-/g, ' ')}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="roleId">Rôle</Label>
                                <Select
                                    value={formData.roleId ? formData.roleId.toString() : ''}
                                    onValueChange={(value) => handleChange({ target: { name: 'roleId', value: parseInt(value) } })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un rôle">
                                            {
                                                roles.find((role) => role.id === formData.roleId)?.name ||
                                                'Sélectionnez un rôle'
                                            }
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        {roles
                                            .filter((role) => role.id && role.name) 
                                            .map((role) => (
                                                <SelectItem key={role.id} value={role.id.toString()}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>

                                </Select>
                                {errors.roleId && <p className="text-xs text-red-500 mt-1">{errors.roleId}</p>}
                            </div>

                            <div className='flex gap-4'>
                                <Button type="submit" onClick={()=>navigate('/dash/Create-User')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                                    Retour
                                </Button>

                                <Button type="submit" className="w-full">
                                    Mettre à jour
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        ) }
    </>
  );
}