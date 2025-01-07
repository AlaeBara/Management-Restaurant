import React, { useEffect } from 'react'
import {useInfoSupplier} from './hooks/fetchOneSupplier'
import { useParams } from 'react-router-dom'
import styles from './DeailsSupplier.module.css'
import Spinner from '@/components/Spinner/Spinner';
import{Ban}from 'lucide-react'
import Info from './Components/info'
import Carts from './Components/Carts'

const DetailsSupplier = () => {

    const {id} = useParams()
    const {supplier, loading, error, fetchInfoSupplier}=useInfoSupplier(id)

    useEffect(()=>{
        fetchInfoSupplier()
    },[])

  return (
    <>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Détails de la  Fournisseur</h1>
                <p>Consultez les informations détaillées de la  Fournisseur sélectionné</p>
            </div>

            {loading ? (
                <div className="mt-5">
                    <Spinner title="Chargement des données..." />
                </div>
            ) : error ? (
                <div className={styles.notfound}>
                    <Ban className={styles.icon} />
                    <span>{error}</span>
                </div>
            ) : (
                <>
                    <Info supplier={supplier} />
                    <Carts/>
                </>
            )}
        </div>
    </>
  )
}

export default DetailsSupplier