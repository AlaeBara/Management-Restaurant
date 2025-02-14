import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dot, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState({
        image: 'https://via.placeholder.com/150',
        nom: 'Doe',
        prenom: 'John',
        username: 'johndoe',
        adress: '123 Main St, City, Country',
        tele: '+123 456 7890',
        email: 'john.doe@example.com',
        password: '********',
        role: 'Admin',
        status: 'Active',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const handleSaveInfo = () => {
        setIsEditing(false);
        console.log('User info saved:', user);
    };

    const handleChangePassword = () => {
        if (newPassword === confirmPassword) {
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert('Passwords do not match!');
        }
    };

    const toggleShowPassword = (passwordField) => {
        switch (passwordField) {
            case 'oldPassword':
                setShowPassword1(!showPassword1);
                break;
            case 'newPassword':
                setShowPassword2(!showPassword2);
                break;
            case 'confirmPassword':
                setShowPassword3(!showPassword3);
                break;
            default:
                break;
        }
    };
    return (
        <div className="flex items-center justify-center h-full p-4">
            <Card className="w-full max-w-7xl border-0 shadow-none">
                <div className="flex flex-col md:flex-row">
                    <CardHeader className="flex flex-col items-center border-b space-y-4 md:border-b-0 md:border-r md:w-1/3">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user.image} alt={`${user.prenom} ${user.nom}`} />
                            <AvatarFallback>{user.prenom[0]}{user.nom[0]}</AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-center">
                            <CardTitle className="text-2xl">{user.prenom} {user.nom}</CardTitle>
                            <CardDescription className="text-gray-600">@{user.username}</CardDescription>
                        </div>

                        <CardFooter className="flex justify-center gap-1 mt-5">
                            <Badge className="text-sm">{user.role}</Badge>
                            <Dot className="w-5 h-5" />
                            <Badge variant="outline" className={user.status === 'Active' ? 'text-sm text-green-500 border-none' : 'text-sm text-red-500 border-none'}>{user.status}</Badge>
                        </CardFooter>
                    </CardHeader>

                    <CardContent className="pt-6 md:w-2/3">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-5 gap-3 h-max">
                                <TabsTrigger value="info" className="text-sm h-full py-2">Info</TabsTrigger>
                                <TabsTrigger value="password" className="text-sm h-full py-2">Change Password</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom</Label>
                                            <Input
                                                id="nom"
                                                value={user.nom}
                                                onChange={(e) => setUser({ ...user, nom: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="prenom">Prénom</Label>
                                            <Input
                                                id="prenom"
                                                value={user.prenom}
                                                onChange={(e) => setUser({ ...user, prenom: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="adress">Adresse</Label>
                                        <Input
                                            id="adress"
                                            value={user.adress}
                                            onChange={(e) => setUser({ ...user, adress: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="tele">Téléphone</Label>
                                            <Input
                                                id="tele"
                                                value={user.tele}
                                                onChange={(e) => setUser({ ...user, tele: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user.email}
                                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4">
                                        {isEditing ? (
                                            <Button onClick={handleSaveInfo}>Sauvegarder</Button>
                                        ) : (
                                            <Button onClick={() => setIsEditing(true)}>Modifier</Button>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="password">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="oldPassword">Ancien mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="oldPassword"
                                                name="oldPassword" 
                                                type={showPassword1 ? "text" : "password"}
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShowPassword("oldPassword")}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            >
                                                {showPassword1 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="newPassword"
                                                type={showPassword2 ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShowPassword("newPassword")}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            >
                                                {showPassword2 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword3 ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShowPassword("confirmPassword")}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            >
                                                {showPassword3 ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={handleChangePassword}>Changer le mot de passe</Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

export default Profile;