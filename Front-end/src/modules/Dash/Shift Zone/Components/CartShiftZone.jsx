import React, { useState } from 'react';
import style from "./CartShiftZone.module.css";
import { LandPlot } from 'lucide-react';

const ZoneCart = ({ zone }) => {
    return (
        <>
            <div className={style.zoneCart} >

                <h1 className={style.nameOfZone}> <LandPlot className='mr-2'/> {zone.zoneLabel}</h1> 

                <div className={style.zone}>
                    
                    <div className={style.zoneInfo1}>
                        <p className={style.zoneItem}>Zone Status :</p>
                        <p className={style.zoneStatus}>Disponible</p>
                    </div>

                    <div className={style.zoneInfo2}>
                        <p className={style.zoneItem}>Serveur Actuel : </p>
                        <p className={style.zoneLabel}>Ahmed</p>
                        <div className={`${style.actions}`}>
                            <button
                                className={`${style.actionButton} ${style.editButton}`}
                            >
                                Start Shift
                            </button>
                        </div>
                    </div>

                </div>

            </div>












            
        </>
    );
};

export default ZoneCart;