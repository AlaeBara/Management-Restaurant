import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter , CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dot } from 'lucide-react';


const Profile = () => {
    // Example user data
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

  return (
    <div className="flex items-center justify-center p-4">

        <Card className="w-full max-w-7xl border-0 shadow-none">

            <CardHeader className="flex flex-col items-center border-b space-y-4">
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

            <CardContent className="pt-6">
                <Tabs defaultValue="info" className="w-full">
                    
                    <TabsList className="grid w-full grid-cols-2 mb-5 gap-3 h-max">
                        <TabsTrigger value="info" className="text-sm h-full py-2">Info</TabsTrigger>
                        <TabsTrigger value="password" className="text-sm h-full py-2">Change Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">Last Name</Label>
                                    <Input
                                        id="nom"
                                        value={user.nom}
                                        onChange={(e) => setUser({ ...user, nom: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prenom">First Name</Label>
                                    <Input
                                        id="prenom"
                                        value={user.prenom}
                                        onChange={(e) => setUser({ ...user, prenom: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="adress">Address</Label>
                                <Input
                                    id="adress"
                                    value={user.adress}
                                    onChange={(e) => setUser({ ...user, adress: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tele">Phone</Label>
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
                                    <Button onClick={handleSaveInfo}>Save</Button>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                                )}
                            </div>

                        </div>
                    </TabsContent>

                    <TabsContent value="password">
                        <div className="space-y-4">

                            <div className="space-y-2">
                                <Label htmlFor="oldPassword">Old Password</Label>
                                <Input
                                    id="oldPassword"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleChangePassword}>Change Password</Button>
                            </div>
                        </div>
                        
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
};

export default Profile;