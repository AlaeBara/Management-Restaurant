import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import Spinner from '../../../../../components/Spinner/Spinner';
import useFetchUserData from '../hooks/useFetchUserData';
import useUpdateUser from '../hooks/useUpdateUser';



export default function UpdateUser() {
  const { id } = useParams();
  const { formData, setFormData, originalData, roles, isLoading, setOriginalData , messageError } = useFetchUserData(id);
  const { updateSubmit, errors } = useUpdateUser(id, formData, setFormData, originalData, setOriginalData);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  if (isLoading) {
    return <Spinner/>;
  }


  return (
    <>
        <ToastContainer />
        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à Jour les Informations Utilisateur</h1>
            <p className="text-base text-gray-600">Complétez les champs ci-dessous pour actualiser les informations de l’utilisateur.</p>
        </div>

        {messageError ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Erreur</p>
                <p className="break-words">{messageError}</p>
            </div>
        ) : (

            <div className="container p-0 max-w-2xl">
                <Card className="w-full border-none shadow-none">
                    <CardContent className="pt-6">
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

                            <Button type="submit" className="w-full">
                                Mettre à jour
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        ) }
    </>
  );
}