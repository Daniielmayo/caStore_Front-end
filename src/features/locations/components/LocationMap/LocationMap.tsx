'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Info, 
  Edit3, 
  Trash2,
  Box as BoxIcon
} from 'lucide-react';
import clsx from 'clsx';
import { Location, mockLocations } from '../../mockData';
import styles from './LocationMap.module.css';

interface LocationMapProps {
  onShelfClick: (shelf: Location) => void;
}

export function LocationMap({ onShelfClick }: LocationMapProps) {
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set());

  // Organize hierarchy
  const hierarchy = useMemo(() => {
    const warehouse = mockLocations.find(l => l.type === 'WAREHOUSE');
    if (!warehouse) return null;

    const zones = mockLocations.filter(l => l.type === 'ZONE' && l.parentId === warehouse.id);
    
    return {
      warehouse,
      zones: zones.map(z => ({
        ...z,
        aisles: mockLocations.filter(l => l.type === 'AISLE' && l.parentId === z.id).map(a => ({
          ...a,
          shelves: mockLocations.filter(l => l.type === 'SHELF' && l.parentId === a.id)
        }))
      }))
    };
  }, []);

  const toggleZone = (id: string) => {
    const newSet = new Set(collapsedZones);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCollapsedZones(newSet);
  };

  if (!hierarchy) return null;

  return (
    <div className={styles.mapContainer}>
      {/* Header with Warehouse Name */}
      <header className={styles.warehouseHeader}>
        <div className={styles.warehouseInfo}>
          <h2 className={styles.warehouseName}>{hierarchy.warehouse.name}</h2>
          <span className={styles.warehouseCode}>{hierarchy.warehouse.code}</span>
        </div>
        <div className={styles.minimap}>
          {hierarchy.zones.map(z => (
            <div 
              key={z.id} 
              className={clsx(styles.miniZone, styles[`zoneColorMini_${z.code.split('-')[0]}`])} 
              title={z.name}
            />
          ))}
        </div>
      </header>

      <div className={styles.zonesGrid}>
        {hierarchy.zones.map(zone => {
          const isCollapsed = collapsedZones.has(zone.id);
          const zonePrefix = zone.code.split('-')[0]; // e.g., "ZA"

          return (
            <div key={zone.id} className={clsx(styles.zoneBlock, styles[`zoneBg_${zonePrefix}`], { [styles.collapsed]: isCollapsed })}>
              <header className={styles.zoneHeader} onClick={() => toggleZone(zone.id)}>
                <div className={styles.zoneTitleRow}>
                  <span className={styles.zoneCode}>{zone.code}</span>
                  <h3 className={styles.zoneName}>{zone.name}</h3>
                  <button className={styles.collapseBtn}>
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>
                </div>
                
                <div className={styles.zoneOccupancy}>
                  <div className={styles.occupancyText}>
                    <span>Ocupación: {zone.occupancyPercent}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={clsx(styles.progressFill, {
                        [styles.bgRed]: zone.occupancyPercent > 90,
                        [styles.bgYellow]: zone.occupancyPercent > 70,
                        [styles.bgGreen]: zone.occupancyPercent <= 70
                      })}
                      style={{ width: `${zone.occupancyPercent}%` }}
                    />
                  </div>
                </div>
              </header>

              {!isCollapsed && (
                <div className={styles.zoneContent}>
                  {zone.aisles.map(aisle => (
                    <div key={aisle.id} className={styles.aisleCol}>
                      <span className={styles.aisleLabel}>{aisle.code}</span>
                      <div className={styles.shelvesList}>
                        {aisle.shelves.map(shelf => (
                          <div 
                            key={shelf.id} 
                            className={clsx(styles.shelfBox, { [styles.empty]: shelf.productCount === 0 })}
                            onClick={() => onShelfClick(shelf)}
                          >
                            <div className={styles.shelfCode}>{shelf.code.split('-').pop()}</div>
                            <div className={styles.shelfOccupancy}>
                              <div 
                                className={clsx(styles.occupancyIndicator, {
                                  [styles.dotRed]: shelf.occupancyPercent >= 90,
                                  [styles.dotYellow]: shelf.occupancyPercent >= 70 && shelf.occupancyPercent < 90,
                                  [styles.dotGreen]: shelf.occupancyPercent < 70 && shelf.productCount > 0,
                                  [styles.dotGray]: shelf.productCount === 0
                                })}
                              />
                              <span>{shelf.productCount}/{shelf.capacity}</span>
                            </div>

                            {/* Hover Tooltip */}
                            <div className={styles.tooltip}>
                              <div className={styles.tooltipHeader}>
                                <strong>{shelf.name}</strong>
                                <code>{shelf.code}</code>
                              </div>
                              <div className={styles.tooltipContent}>
                                <div className={styles.tooltipItem}>
                                  <Maximize2 size={12} />
                                  <span>Capacidad: {shelf.capacity}</span>
                                </div>
                                <div className={styles.tooltipItem}>
                                  <BoxIcon size={12} />
                                  <span>Productos: {shelf.productCount}</span>
                                </div>
                              </div>
                              <div className={styles.tooltipFooter}>
                                <button className={styles.tooltipBtnPrimary}>Ver detalle</button>
                                <button className={styles.tooltipBtnSecondary}>Editar</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
