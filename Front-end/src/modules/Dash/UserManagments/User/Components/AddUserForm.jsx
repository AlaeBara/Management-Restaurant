import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AddUserForm = ({ formData, handleChange, handleSubmit, setShowPassword, showPassword, errors, CloseForm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="p-4 sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Créer nouveau utilisateur
            </CardTitle>
            <button
              onClick={CloseForm}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.firstname && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstname}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.lastname && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nom d'utilisateur"
                className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Gender Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Genre
              </label>
              <Select name="gender" value={formData.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } })}>
                <SelectTrigger>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 h-9 rounded-md text-sm font-medium transition-colors  disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              Ajouter
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddUserForm;