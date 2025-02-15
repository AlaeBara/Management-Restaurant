import React, { useEffect } from 'react';
import { useFetchUser } from './Hooks/useFetchUser';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dot, User, Mail, Phone, MapPin, Calendar, Shield, Lock, Check, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import Spinner from '@/components/Spinner/Spinner';
import style from '../AllUser.module.css';
import UserStatus from '../Components/UserStatus';
import { formatDate } from '@/components/dateUtils/dateUtils';
import stylee from '../Components/UserCarts.module.css'

const DetailsUser = () => {
    const { id } = useParams();
    const { user, loading, error, fetchUser } = useFetchUser(id);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id, fetchUser]);

    return (
        <>
            {loading ? (
                <Spinner title="Chargement des informations de l'utilisateur..." />
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (

                <>
                <div className={style.Headerpage}>
                    <div>
                        <h1 className={`${style.title} !mb-0 `}>Détails du ' {user?.firstname} {user?.lastname} '</h1>
                        <p className="text-base text-gray-600 mt-0">Consultez les informations détaillées de la utilisatuer sélectionné</p>
                    </div>
                </div> 

                <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
                    <Card className="w-full  border-none shadow-none">
                        <CardHeader className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.avatar?.localPath ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar.localPath}` : "https://e7.pngegg.com/pngimages/931/209/png-clipart-computer-icons-symbol-avatar-logo-person-with-helmut-miscellaneous-black.png"}/>
                                <AvatarFallback>{user?.firstname[0]}{user?.lastname[0]}</AvatarFallback>
                            </Avatar>

                            <div className="text-center">
                                <CardTitle className="text-2xl">{user?.firstname} {user?.lastname}</CardTitle>
                                <CardDescription className="text-gray-600">@{user?.username}</CardDescription>
                            </div>

                            <CardFooter className="flex justify-center gap-1">
                                <Badge className='pb-1' >{user?.roles[0]?.name || 'Aucun rôle'}</Badge>
                                <Dot className="w-5 h-5" />
                                <Badge variant="outline"  className={`${stylee[user?.status]}`}>
                                    {user?.status === UserStatus.ACTIVE ? "Actif" :
                                        user?.status === UserStatus.INACTIVE ? "Inactif" :
                                        user?.status === UserStatus.SUSPENDED ? "Suspendu" :
                                        user?.status === UserStatus.BANNED ? "Banni" :
                                        user?.status === UserStatus.ARCHIVED ? "Archivé" :
                                        user?.status === "email-unverified" ? "Non vérifié" :
                                        user?.status === "deleted" ? "Supprimé" : ""
                                    }
                                </Badge>
                            </CardFooter>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* First Name */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Prénom</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.firstname}</p>
                                </div>

                                {/* Last Name */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Nom</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.lastname}</p>
                                </div>

                                {/* Gender */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Genre</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.gender === 'male' ? 'Homme' : 'Femme'}</p>
                                </div>

                                {/* Email */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Email</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.email}</p>
                                </div>

                                {/* Phone */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Téléphone</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.phone || '-'}</p>
                                </div>

                                {/* Address */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Adresse</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.address || '-'}</p>
                                </div>

                                {/* Created At */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Date de création</Label>
                                    </div>
                                    <p className="text-lg font-medium">{formatDate(user?.createdAt)}</p>
                                </div>

                                {/* Role */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Rôle</Label>
                                    </div>
                                    <p className="text-lg font-medium">{user?.roles[0]?.label}</p>
                                </div>

                                {/* Email Verified */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        {user?.isEmailVerified ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                                        <Label className="text-sm text-gray-500">Email vérifié</Label>
                                    </div>
                                    <Badge variant='outline' className="text-sm w-fit  font-medium">{user?.isEmailVerified ? 'Oui' : 'Non'}</Badge>
                                </div>

                                {/* Account Blocked */}
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                        <Label className="text-sm text-gray-500">Compte bloqué</Label>
                                    </div>
                                    <Badge variant='outline' className={`text-sm w-fit text-white  font-medium ${user?.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}>{user?.isBlocked ? 'Oui' : 'Non'}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                </>
            )}
        </>
    );
};

export default DetailsUser;