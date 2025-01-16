import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserSchema } from '../schemas/UserSchema'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import {useRoles} from '../hooks/useFetchRoles'
import UserStatus from './UserStatus'; 
import {Loader} from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from 'lucide-react';



export default function Component() {

  const { roles, fetchRoles } = useRoles();

  useEffect(() => {
    fetchRoles();
  }, []);

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    gender: '',
    address: null,
    phone: null,
    status: null,
    roleId: null,
    avatar: null,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ message: null, type: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      UserSchema.parse(formData)

      const preparedData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (value !== null && value !== "") {
          preparedData.append(key, value);
          console.log(key," - ",value)
        }
      }
      setIsLoading(true);
      const token = Cookies.get('access_token')
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, preparedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setFormData({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
        address: null,
        phone: null,
        status: null,
        roleId: null,
        avatar: null,
      })
      setErrors({})
      toast.success(response.data.message  || 'Employé créé avec succès!', {
        icon: '✅',
        position: "top-right",
        autoClose: 1500,
        onClose: () => navigate(`/dash/Create-User`),
      });

      setIsLoading(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach(({ path, message }) => {
          fieldErrors[path[0]] = message
        })
        setErrors(fieldErrors)
      } else {
        console.error('Error creating user:', error)
        setAlert({
          message: error.response?.data?.message,
          type: "error",
        });

        setIsLoading(false);
      }
    }
  }

  return (

    <>

      <ToastContainer />
      
      <div className="space-y-2 m-3">
        <h1 className="text-2xl font-bold text-black font-sans">Ajouter un Employé</h1>
        <p className="text-base text-gray-600">
          Remplissez les informations ci-dessous pour ajouter un nouvel employé au système.
        </p>
      </div>

  
      <div className="container p-0 max-w-2xl">

        <Card className="w-full border-none shadow-none">

          <CardContent className="pt-6 ">

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

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="firstname">Prénom <span className='text-red-500 text-base'>*</span></Label>
                  <Input
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    placeholder="Exemple: Ahmed"
                  />
                  {errors.firstname && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstname}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname">Nom <span className='text-red-500 text-base'>*</span></Label>
                  <Input
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    placeholder="Exemple: El Mansouri"
                  />
                  {errors.lastname && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>
                  )}
                </div>
                
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur <span className='text-red-500 text-base'>*</span></Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Exemple: ahmed elmansouri"
                  />
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Genre <span className='text-red-500 text-base'>*</span></Label>
                  <Select name="gender" value={formData.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Sélectionnez le genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculin</SelectItem>
                      <SelectItem value="female">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                  )}
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="firstname">Adresse</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    placeholder="Exemple: 45 Rue Mohamed Iqbal, Agadir"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastname">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="+212 6 12 34 56 78"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                    name="status"
                    value={formData.status || ""}
                    onValueChange={(value) =>  handleChange({ target: { name: "status", value: value || null } })}
                >
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={null}>
                          Annuler (Par défaut)
                        </SelectItem>
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
                      value={formData.roleId?.toString() || ''}
                      onValueChange={(value) => handleChange({ target: { name: 'roleId', value: parseInt(value) || null } })}
                  >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>
                          Annuler (Par défaut)
                        </SelectItem>
                          {roles
                          .map((role) => (
                              <SelectItem key={role.id.toString()} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {errors.roleId && <p className="text-xs text-red-500 mt-1">{errors.roleId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email <span className='text-red-500 text-base'>*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Exemple: ahmed.elmansouri@gmail.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe <span className='text-red-500 text-base'>*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Exemple: MotDePasse123!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="avatar"
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-500 text-center">Cliquez pour télécharger ou glisser-déposer</span>
                      <span className="text-sm text-gray-400">PNG, JPG, JPEG</span>
                    </div>
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData((prevData) => ({ ...prevData, avatar: file }));
                        }
                      }}
                    />
                  </label>
                </div>

                {formData.avatar && (
                  <div className="mt-4 flex flex-col items-center justify-center">
                    {/* Display Image Preview or File Name */}
                    {formData.avatar.type.startsWith('image/') ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(formData.avatar)}
                          alt="Avatar Preview"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prevData) => ({ ...prevData, avatar: null }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" /> 
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                        <span className="text-sm text-gray-700">{formData.avatar.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData((prevData) => ({ ...prevData, avatar: null }))}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" /> 
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {errors.avatar && (
                  <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" onClick={()=>navigate('/dash/Create-User')} className="w-full bg-[#f1f1f1] text-[#333] hover:bg-[#f1f1f1]">
                  Annuler
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                      <div className="flex items-center gap-2">
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Création en cours...</span>
                      </div>
                      ) : (
                      "Ajouter"
                  )}
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </div>
    </>
    
  )
}