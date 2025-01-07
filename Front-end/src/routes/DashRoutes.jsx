import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayoutDash';
import ProtectedRoute from '../ProtectRoutes/ProtectedRouteDash';
import Spinner from '../components/Spinner/SpinnerPages'; 

// Lazy load pages
const Home = lazy(() => import('../modules/Dash/Home/Home'));
const Login = lazy(() => import('../modules/Dash/LoginPage/Login'));
const AllUsers = lazy(() => import('@/modules/Dash/UserManagments/User/AllUsersPage'));
const DeletedUsers = lazy(() => import('@/modules/Dash/UserManagments/User/DeletedUsersPage'));
const Zones1 = lazy(() => import('@/modules/ZoneAndTable/Zones'));
const AddUserForm = lazy(() => import('@/modules/Dash/UserManagments/User/Components/AddUserForm'));
const AllRoles=lazy(() => import('@/modules/Dash/UserManagments/Role/AllRoles'));
const UpdateUserpage = lazy(() => import('@/modules/Dash/UserManagments/User/Components/UpdateUserpage'))
const AddRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/AddRole'))
const UpdateRole = lazy(()=> import ('@/modules/Dash/UserManagments/Role/Components/UpdateRole'))
const RoleDetails = lazy(()=> import ('@/modules/Dash/UserManagments/Role/RoleDetails'))
const Zones = lazy(()=> import ('@/modules/Dash/Zone&Table/Zones/Zones'))
const AddZone = lazy(()=> import ("@/modules/Dash/Zone&Table/Zones/Components/AddZone"))
const UpdateZone = lazy(()=> import ("@/modules/Dash/Zone&Table/Zones/Components/UpdateZone"))
const DeletedZone = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/Components/DeletedZone'))
const ZoneDetails = lazy(()=>  import ('@/modules/Dash/Zone&Table/Zones/ZoneDetails/ZoneDetails'))
const AddTable = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/AddTable'))
const UpdateTable = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/UpdateTable'))
const Suplier = lazy(()=> import ("@/modules/Dash/Suplier&Stockage/Suplier/Suplier"))
const DetailsSuplier = lazy(()=> import ("@/modules/Dash/Suplier&Stockage/Suplier/Details/DetailsSupplier"))
const AddSuplier = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Suplier/Components/AddSuplier'))
const UpdateSuplier = lazy(()=>import('@/modules/Dash/Suplier&Stockage/Suplier/Components/UpdateSuplier'))
const SuplierDeleted = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Suplier/Components/SuppliersDeleted'))
const Storage = lazy(()=> import ('@/modules/Dash/Suplier&Stockage/Stockage/Storage'))
const AddStorage = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/AddStorage'))
const UpdateStorage = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/UpdateStorage'))
const StorageDeleted = lazy(()=> import('@/modules/Dash/Suplier&Stockage/Stockage/Components/StorageDeleted'))
const Tables = lazy(()=>import('@/modules/Dash/Zone&Table/Tables/Tables'))
const TableDeleted = lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/TableDeleted'))
const Units = lazy(()=> import ('@/modules/Dash/Units/Units'))
const AddUnits = lazy(()=> import('@/modules/Dash/Units/Components/AddUnits'))
const UpdateUnits = lazy(()=>import('@/modules/Dash/Units/Components/UpdateUnits'))
const DeletedUnits = lazy(()=>import('@/modules/Dash/Units/Components/DeletedUnits'))
const RoleDeleted = lazy(()=>import('@/modules/Dash/UserManagments/Role/Components/RoleDeleted'))
const Products =lazy(()=> import('@/modules/Dash/Products/Product'))
const AddProduct = lazy(()=> import('@/modules/Dash/Products/Components/AddProduct'))
const UpdateProduct = lazy(()=> import('@/modules/Dash/Products/Components/UpdateProduct'))
const DeletedProduct = lazy(()=>import('@/modules/Dash/Products/Components/DeletedProduct'))
const Category = lazy(()=> import('@/modules/Dash/Category/Category'))
const AddCategory = lazy(()=>import('@/modules/Dash/Category/Components/AddCategory'))
const UpdateCategorie =lazy(()=>import('@/modules/Dash/Category/Components/UpdateCategorie'))
const DeletedCategory = lazy(()=>import('@/modules/Dash/Category/Components/DeletedCategorie'))
const Inventory =lazy(()=>import('@/modules/Dash/Inventory/Inventory/inventory'))
const AddInventory = lazy(()=>import('@/modules/Dash/Inventory/Inventory/Components/AddIventory'))
const UpdateInventory = lazy(()=> import('@/modules/Dash/Inventory/Inventory/Components/UpdateInventory'))
const DeletedInventory =lazy(()=> import('@/modules/Dash/Inventory/Inventory/Components/DeletedInventory'))
const DatailsProduct =lazy(()=>import('@/modules/Dash/Products/DetailsProduct/DetailsProduct'))
const AddAdjustment =lazy(()=>import('@/modules/Dash/Products/DetailsProduct/Components/AddAdjustment'))
const AddInventoryInDetailsProdcut =lazy(()=>import('@/modules/Dash/Products/DetailsProduct/Components/AddInventory'))
const AddInventoryMovement =lazy(()=>import('@/modules/Dash/Inventory/Inventory/Components/AddInventoryMovement'))
const DetailInventory =lazy(()=>import('@/modules/Dash/Inventory/Inventory/Details/DetailInventory'))
const Fund = lazy(()=>import('@/modules/Dash/Fund/Fund'))
const AddFund =lazy(()=>import('@/modules/Dash/Fund/Components/AddFund'))
const UpdateFund =lazy(()=>import('@/modules/Dash/Fund/Components/UpdateFund'))
const DeletedFund =lazy(()=>import('@/modules/Dash/Fund/Components/DeletedFund')) 
const DetailsFund =lazy(()=>import('@/modules/Dash/Fund/Details/DetailsFund'))
const AddOperation =lazy(()=>import('@/modules/Dash/Fund/Details/Components/AddOperation'))
const Operation =lazy(()=>import('@/modules/Dash/Operation/Operation'))
const ADDOperation = lazy(()=>import('@/modules/Dash/Operation/Components/AddOperation'))
const Expense=lazy(()=>import('@/modules/Dash/Expense/Expense'))
const AddExpense =lazy(()=>import('@/modules/Dash/Expense/Components/AddExpense'))
const ShiftZone =lazy(()=>import('@/modules/Dash/Shift Zone/ShiftZone'))
const Transfert=lazy(()=>import('@/modules/Dash/Transfert/Transfert'))
const TransfertOperation =lazy(()=>import('@/modules/Dash/Transfert-Operations/TransfertOperations'))
const AddTransfertOperation =lazy(()=>import('@/modules/Dash/Transfert-Operations/Components/AddTransfertOperation'))
const AddMultiTable =  lazy(()=> import('@/modules/Dash/Zone&Table/Zones/ZoneDetails/AddMultiTable'))
const AddAchat = lazy(()=> import('@/modules/Dash/Achats/Components/AddAchats'))
const Achats = lazy(()=> import('@/modules/Dash/Achats/Achats'))
const AchatDetails =lazy(()=> import('@/modules/Dash/Achats/Details/AchatDetail'))
const Tags =lazy(()=> import('@/modules/Dash/MenuItem/Tags/Tags'))
const TagsDeleted =lazy(()=> import('@/modules/Dash/MenuItem/Tags/Components/DeletedTags'))
const MenuItems =lazy(()=> import('@/modules/Dash/MenuItem/menu-item/MenuItems'))
const AddProductMenu  =lazy(()=> import('@/modules/Dash/MenuItem/menu-item/Components/AddProducts'))
const Discount = lazy(()=> import('@/modules/Dash/MenuItem/Discount/Discount'))
const AddDiscount =lazy(()=> import('@/modules/Dash/MenuItem/Discount/Components/AddDiscount'))
const UpdateDiscounts =lazy(()=> import('@/modules/Dash/MenuItem/Discount/Components/UpdateDiscount'))
const DeletedDiscount =lazy(()=> import('@/modules/Dash/MenuItem/Discount/Components/DeletedDiscount'))

const ClientRoutes = () => {
  return (
    <Suspense fallback={<Spinner title="Chargement en cours..." />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Create-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllUsers />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedUsers />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-User" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddUserForm />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-User/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateUserpage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Gestion-des-roles" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AllRoles/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-Role" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddRole/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-Role/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateRole />
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-Role" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Gestion-des-roles/role-details/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <RoleDetails/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/zones" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Zones/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Add-Zone" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 

        <Route 
          path="/Update-Zone/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 
        <Route 
          path="/Deleted-Zone" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  
        <Route 
          path="/Zone/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ZoneDetails/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Add-table/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddTable/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/ajouter-tables-multiples" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddMultiTable/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Update-table/:id_table" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateTable/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Zone/:id/Table-deleted" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TableDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Tables" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tables/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/Supliers" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Suplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        /> 

        <Route 
          path="/Add-Suplier" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddSuplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />    

        <Route 
          path="/Update-Suplier/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateSuplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Deleted-Suplier" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <SuplierDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   
        
        <Route 
          path="/fournisseurs/fournisseur-details/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailsSuplier/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Storage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Add-Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddStorage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Update-Storage/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateStorage/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Deleted-Storage" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <StorageDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />   

        <Route 
          path="/Units" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Units/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />  

        <Route 
          path="/Units/Add-Units" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Update-Units/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Deleted-Unites" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedUnits/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Products/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/Ajouter-Produits" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/Mettre-à-jour-Produit/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/produits-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/detail-produit/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DatailsProduct/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Produits/detail-produit/:id/ajouter-inventaire" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddInventoryInDetailsProdcut/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Produits/detail-produit/:id/adjustment/:id_iventory" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddAdjustment/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Produits/detail-produit/:id/inventaire/:id_iventory" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailInventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        
        <Route 
          path="/categories-Produits/" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Category/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/categories-Produits/ajouter-categorie" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddCategory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/categories-Produits/Mettre-à-jour-categorie/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateCategorie/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/categories-Produits/categories-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedCategory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/inventaires" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Inventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/inventaires/ajouter-inventaire" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddInventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/inventaires/ajouter-adjustement/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddInventoryMovement/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/inventaires/mettre-à-jour-inventaire/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateInventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/inventaires/inventaire-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedInventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/inventaires/detail/:id_iventory" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailInventory/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/caisses" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Fund/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/caisses/ajouter-caisse" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddFund/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/caisses/mettre-à-jour-caisse/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateFund/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/caisses/caisse-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedFund/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/caisses/detail/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DetailsFund/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/caisses/detail/:id/ajouter-operation" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddOperation/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/opérations" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Operation/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/opérations/ajouter-opération" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ADDOperation/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dépenses" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Expense/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dépenses/ajouter-dépense" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddExpense/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/transfert-operations" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TransfertOperation/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transfert-operations/ajouter-transfert" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddTransfertOperation/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/quarts" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ShiftZone/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/transfert" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transfert/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />


        <Route 
          path="/achats" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Achats/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/ajoute-achat" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddAchat/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/achats/detail/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AchatDetails/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route
          path="/tags" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Tags/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tags/tag-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <TagsDeleted/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/produits-menu" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <MenuItems/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/produits-menu/ajouter-produit" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddProductMenu/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/code-promo" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Discount/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/code-promo/ajouter-promo" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <AddDiscount/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/code-promo/mettre-à-jour-codepromo/:id" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <UpdateDiscounts/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/code-promo/code-promo-supprimés" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <DeletedDiscount/>
              </MainLayout>
            </ProtectedRoute>
          } 
        />









      </Routes>
    </Suspense>
  );
};

export default ClientRoutes;
