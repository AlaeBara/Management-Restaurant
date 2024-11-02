import React from 'react';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const UpdateUserForm = ({ formUpdateData, handleChangeUpdate, updateSubmit, errors, CloseFormOfUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="p-4 sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Modifier utilisateur
            </CardTitle>
            <button
              onClick={CloseFormOfUpdate}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <form onSubmit={updateSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formUpdateData.firstname}
                  onChange={handleChangeUpdate}
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
                  value={formUpdateData.lastname}
                  onChange={handleChangeUpdate}
                  placeholder="Nom"
                  className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                {errors.lastname && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastname}</p>
                )}
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                value={formUpdateData.address || ''}
                onChange={handleChangeUpdate}
                placeholder="Adresse"
                className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={formUpdateData.phone || ''}
                onChange={handleChangeUpdate}
                placeholder="Numéro de téléphone"
                className="h-9 w-full rounded-md border border-gray-200 px-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Gender Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Genre
              </label>
              <Select name="gender" value={formUpdateData.gender}  onValueChange={(value) => handleChangeUpdate({ target: { name: "gender", value } })}>
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
              Mettre à jour
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateUserForm;