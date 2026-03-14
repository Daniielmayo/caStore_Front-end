import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  CornerDownRight 
} from 'lucide-react';
import clsx from 'clsx';
import styles from './CategoryTree.module.css';
import { Category } from '../../mockData';
import { Badge } from '../../../../components/ui/Badge';

interface CategoryNodeProps {
  category: Category;
  subcategories: Category[];
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddSub: (cat: Category) => void;
  onSelect: (cat: Category) => void;
  level?: number;
  highlighted?: boolean;
  dimmed?: boolean;
}

export function CategoryNode({ 
  category, 
  subcategories, 
  isExpanded, 
  onToggle,
  onEdit,
  onDelete,
  onAddSub,
  onSelect,
  level = 0,
  highlighted = false,
  dimmed = false
}: CategoryNodeProps) {
  const hasSubcategories = subcategories.length > 0;
  const isSubcategory = !!category.parentId;

  return (
    <div className={clsx(styles.nodeWrapper, { [styles.dimmed]: dimmed })}>
      <div 
        className={clsx(styles.node, { 
          [styles.mainNode]: !isSubcategory,
          [styles.subNode]: isSubcategory,
          [styles.selected]: highlighted
        })}
        onClick={() => onSelect(category)}
      >
        <div className={styles.nodeLeft}>
          {hasSubcategories ? (
            <button 
              className={styles.chevron} 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          ) : (
            <div className={styles.chevronPlaceholder} />
          )}

          <div className={clsx(styles.iconBox, { [styles.iconSub]: isSubcategory })}>
            {isExpanded ? <FolderOpen size={18} /> : <Folder size={18} />}
          </div>

          <div className={styles.nameSection}>
            <span className={styles.name}>{category.name}</span>
            <div className={styles.badges}>
              {!isSubcategory && (
                <Badge variant="default" className={styles.smallBadge}>
                  {subcategories.length} sub.
                </Badge>
              )}
              <Badge variant="inactive" className={styles.tinyBadge}>
                {category.productCount} prod.
              </Badge>
            </div>
          </div>
        </div>

        <div className={styles.nodeRight}>
          <div className={styles.skuPrefix}>
            <span className={styles.skuLabel}>SKU prefix:</span>
            <code className={styles.skuValue}>{category.skuPrefix}-</code>
          </div>

          <div className={styles.actions}>
            {!isSubcategory && (
              <button 
                className={styles.actionBtn} 
                onClick={(e) => { e.stopPropagation(); onAddSub(category); }}
                title="Agregar subcategoría"
              >
                <Plus size={16} />
              </button>
            )}
            <button 
              className={styles.actionBtn} 
              onClick={(e) => { e.stopPropagation(); onEdit(category); }}
              title="Editar"
            >
              <Edit2 size={16} />
            </button>
            <button 
              className={clsx(styles.actionBtn, styles.deleteAction)} 
              onClick={(e) => { e.stopPropagation(); onDelete(category); }}
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {hasSubcategories && isExpanded && (
        <div className={styles.children}>
          <div className={styles.connectorLine} />
          {subcategories.map(sub => (
            <CategoryNode
              key={sub.id}
              category={sub}
              subcategories={[]} // We only support 2 levels for now as per requirements
              isExpanded={false}
              onToggle={() => {}}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddSub={onAddSub}
              onSelect={onSelect}
              level={level + 1}
              dimmed={dimmed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryTreeProps {
  categories: Category[];
  searchQuery: string;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onAddSub: (cat: Category) => void;
  onSelect: (cat: Category) => void;
}

export function CategoryTree({ 
  categories, 
  searchQuery,
  onEdit,
  onDelete,
  onAddSub,
  onSelect
}: CategoryTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const mainCategories = categories.filter(c => !c.parentId);
  
  const isSearching = searchQuery.length > 0;

  return (
    <div className={styles.treeContainer}>
      {mainCategories.map(cat => {
        const sub = categories.filter(s => s.parentId === cat.id);
        
        // Filtering logic
        const matchesQuery = (c: Category) => 
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          c.skuPrefix.toLowerCase().includes(searchQuery.toLowerCase());
        
        const catMatches = matchesQuery(cat);
        const subMatches = sub.some(s => matchesQuery(s));
        
        const highlighted = isSearching && catMatches;
        const dimmed = isSearching && !catMatches && !subMatches;
        
        // Auto-expand if subcategory matches search
        const isForceExpanded = isSearching && subMatches;
        const expanded = expandedNodes[cat.id] || isForceExpanded;

        return (
          <CategoryNode
            key={cat.id}
            category={cat}
            subcategories={sub}
            isExpanded={expanded}
            onToggle={() => toggleNode(cat.id)}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddSub={onAddSub}
            onSelect={onSelect}
            highlighted={highlighted}
            dimmed={dimmed}
          />
        );
      })}
    </div>
  );
}
