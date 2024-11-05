import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UpdateSchema } from '../schemas/UpdateSchema';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { z } from 'zod';
import { useParams } from 'react-router-dom';

export default function UpdateUser() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
        address: '',
        phone: '',
        roleId: null,
    });
    const [originalData, setOriginalData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('access_token');
                const [userResponse, rolesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/roles`, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }),
                ]);
                setOriginalData(userResponse.data);
                setFormData((prevData) => ({
                    ...prevData,
                    firstname: userResponse.data.firstname,
                    lastname: userResponse.data.lastname,
                    username: userResponse.data.username,
                    address: userResponse.data.address || '',
                    password: userResponse.data.password,
                    phone: userResponse.data.phone || '',
                    gender: userResponse.data.gender,
                    email: userResponse.data.email,
                    roleId: userResponse.data.roleIds && userResponse.data.roleIds.length > 0 ? userResponse.data.roleIds[0] : null,
                }));
                setRoles(rolesResponse.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Échec de la récupération des données.", {
                    icon: '❌',
                    position: 'top-right',
                    autoClose: 3000,
                });
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const updateSubmit = async (e) => {
        e.preventDefault();
        try {
        UpdateSchema.parse(formData);
        const updatedData = {};
        for (const key in formData) {
            if (formData[key] !== originalData[key]) {
            updatedData[key] = formData[key] || null;
            }
        }
        if (Object.keys(updatedData).length === 0) {
            toast.info('Aucune mise à jour nécessaire.', {
                icon: 'ℹ️',
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }
        const token = Cookies.get('access_token');
        await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
            updatedData,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        setOriginalData({ ...originalData, ...updatedData });
        setErrors({});
        toast.success('Utilisateur mis à jour avec succès!', {
            icon: '✅',
            position: 'top-right',
            autoClose: 3000,
        });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                error.errors.forEach(({ path, message }) => {
                fieldErrors[path[0]] = message;
                });
                setErrors(fieldErrors);
            } else {
                console.error('Error updating user:', error);
                toast.error("Échec de la mise à jour de l'utilisateur.", {
                    icon: '❌',
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

  return (
    <>
        <ToastContainer />
        <div className="space-y-2 m-3">
            <h1 className="text-2xl font-bold text-black font-sans">Mettre à Jour les Informations Utilisateur</h1>
            <p className="text-base text-gray-600">Complétez les champs ci-dessous pour actualiser les informations de l’utilisateur.</p>
        </div>

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
    </>
  );
}