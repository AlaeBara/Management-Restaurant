import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserSchema } from '../schemas/UserSchema'
import Cookies from 'js-cookie'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { z } from 'zod'

export default function Component() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    gender: '',
    address: null,
    phone: null
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      UserSchema.parse(formData)
      const token = Cookies.get('access_token')

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
        phone: null
      })
      setErrors({})

      toast.success('Utilisateur créé avec succès!', {
        icon: '✅',
        position: "top-right",
        autoClose: 3000,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach(({ path, message }) => {
          fieldErrors[path[0]] = message
        })
        setErrors(fieldErrors)
      } else {
        console.error('Error creating user:', error)
        let errorMessage = 'Erreur lors de la création de l\'utilisateur'

        if (error.response?.data?.message) {
          if (error.response.data.message.includes('User already exists')) {
            errorMessage = "L'utilisateur existe déjà"
          } else if (error.response.data.message.includes('Invalid token')) {
            errorMessage = "Token invalide"
          } else {
            errorMessage = error.response.data.message
          }
        }

        toast.error(errorMessage, {
          icon: '❌',
          position: "top-right",
          autoClose: 3000,
        })
      }
    }
  }

  return (

    <>
      <ToastContainer />
      <div className="space-y-2 m-3">
        <h1 className="text-2xl font-bold text-black font-sans">Ajouter un nouvel utilisateur</h1>
        <p className="text-base text-gray-600">
            Remplissez les informations ci-dessous pour ajouter un nouvel utilisateur au système.
        </p>
      </div>

      

      <div className="container p-0 max-w-2xl">

        <Card className="w-full border-none shadow-none">

          <CardContent className="pt-6 ">

            <form onSubmit={handleSubmit} className="space-y-4">

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
                  {errors.firstname && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstname}</p>
                  )}
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
                  {errors.lastname && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>
                  )}
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
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username}</p>
                  )}
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
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
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
                    placeholder="adresse"
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
                    placeholder="Numéro de Téléphone"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
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
                <Label htmlFor="gender">Genre</Label>
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

              <Button type="submit" className="w-full">
                Ajouter
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </>
    
  )
}