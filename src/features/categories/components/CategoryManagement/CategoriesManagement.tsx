'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Grid2X2, 
  List, 
  Plus, 
  ChevronRight, 
  Trash2, 
  AlertCircle,
  Folder,
  FolderPlus
} from 'lucide-react';
import clsx from 'clsx';
import styles from './CategoriesManagement.module.css';
import { mockCategories, Category } from '../../mockData';
import { CategorySummary } from './CategorySummary';
import { CategoryTree } from './CategoryTree';
import { CategoryDetailSheet } from './CategoryDetailSheet';
import { CategoryFormDrawer } from '../CategoryForm/CategoryFormDrawer';
import { DataTable } from '../../../../components/tables/DataTable';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Modal } from '../../../../components/ui/Modal';
import { useToast } from '../../../../components/ui/Toast';
import { CategoryFormData } from '../../schemas/category.schema';

export function CategoriesManagement() {
  const { showToast } = useToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'flat'>('tree');
  
  // Selected / Edit states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentForSub, setParentForSub] = useState<Category | null>(null);
  
  // Delete state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Computed
  const filteredFlatList = useMemo(() => {
    return categories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skuPrefix.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  // Handlers
  const handleOpenForm = (cat?: Category | null, parent?: Category | null) => {
    setEditingCategory(cat || null);
    setParentForSub(parent || null);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (cat: Category) => {
    setSelectedCategory(cat);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (cat: Category) => {
    setDeletingCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const hasChildrenOrProducts = (cat: Category) => {
    const hasChildren = categories.some(c => c.parentId === cat.id);
    return hasChildren || cat.productCount > 0;
  };

  const handleConfirmDelete = () => {
    if (!deletingCategory) return;
    
    setCategories(prev => prev.filter(c => c.id !== deletingCategory.id));
    showToast({ message: 'Categoría eliminada con éxito', type: 'success' });
    setIsDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleFormSubmit = async (data: CategoryFormData) => {
    // Simulate API
    await new Promise(r => setTimeout(r, 1000));
    
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? {
        ...c,
        ...data,
      } : c));
      showToast({ message: 'Categoría actualizada', type: 'success' });
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: data.name,
        description: data.description,
        parentId: parentForSub?.id || data.parentId,
        skuPrefix: data.name.trim().toUpperCase().slice(0, 4),
        productCount: 0,
        icon: data.icon,
        color: data.color,
        createdAt: new Date().toISOString(),
      };
      setCategories(prev => [...prev, newCat]);
      showToast({ message: 'Categoría creada con éxito', type: 'success' });
    }
    setIsFormOpen(false);
    setEditingCategory(null);
    setParentForSub(null);
  };

  // Flat Table Columns
  const flatColumns = [
    { 
      key: 'name', 
      header: 'Nombre',
      render: (c: Category) => (
        <div className={styles.flatNameCell}>
          <span className={styles.flatName}>{c.name}</span>
          {c.parentId && <span className={styles.flatType}>Subcategoría</span>}
          {!c.parentId && <span className={styles.flatTypeMain}>Principal</span>}
        </div>
      )
    },
    { 
      key: 'parent', 
      header: 'Padre',
      render: (c: Category) => {
        const parent = categories.find(p => p.id === c.parentId);
        return parent ? parent.name : '-';
      }
    },
    { 
      key: 'sku', 
      header: 'Prefijo SKU',
      render: (c: Category) => <code className={styles.skuInline}>{c.skuPrefix}-</code>
    },
    { key: 'productCount', header: 'Productos' },
    { 
      key: 'createdAt', 
      header: 'Creación',
      render: (c: Category) => new Date(c.createdAt).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (c: Category) => (
        <div className={styles.flatActions}>
          <button className={styles.iconBtn} onClick={() => handleOpenForm(c)}><Plus size={16} /></button>
          <button className={styles.iconBtn} onClick={() => handleDeleteClick(c)}><Trash2 size={16} /></button>
        </div>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <CategorySummary categories={categories} />

      <div className={styles.toolbar}>
        <div className={styles.searchWrapper}>
          <Input 
            placeholder="Buscar categoría o subcategoría..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className={styles.controls}>
          <div className={styles.viewToggle}>
            <button 
              className={clsx(styles.toggleBtn, { [styles.toggleActive]: viewMode === 'tree' })}
              onClick={() => setViewMode('tree')}
              title="Vista de Árbol"
            >
              <ChevronRight size={18} />
            </button>
            <button 
              className={clsx(styles.toggleBtn, { [styles.toggleActive]: viewMode === 'flat' })}
              onClick={() => setViewMode('flat')}
              title="Vista de Lista"
            >
              <List size={18} />
            </button>
          </div>
          <Button onClick={() => handleOpenForm()}>
             <FolderPlus size={18} style={{ marginRight: '8px' }} />
             Nueva categoría
          </Button>
        </div>
      </div>

      <div className={styles.viewContainer}>
        {viewMode === 'tree' ? (
          <CategoryTree 
            categories={categories}
            searchQuery={searchQuery}
            onEdit={(cat) => handleOpenForm(cat)}
            onDelete={handleDeleteClick}
            onAddSub={(parent) => handleOpenForm(null, parent)}
            onSelect={handleOpenDetail}
          />
        ) : (
          <DataTable 
            data={filteredFlatList}
            columns={flatColumns}
          />
        )}
      </div>

      {/* Detail Sheet */}
      <CategoryDetailSheet 
        category={selectedCategory}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(cat) => { setIsDetailOpen(false); handleOpenForm(cat); }}
        onDelete={(cat) => { setIsDetailOpen(false); handleDeleteClick(cat); }}
      />

      {/* Form Drawer */}
      <CategoryFormDrawer 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
        parentCategory={parentForSub}
      />

      {/* Delete Modal Logic */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={deletingCategory && hasChildrenOrProducts(deletingCategory) ? "No se puede eliminar" : "Eliminar categoría"}
        footer={
          deletingCategory && hasChildrenOrProducts(deletingCategory) ? (
            <Button onClick={() => setIsDeleteModalOpen(false)}>Entendido</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancelar</Button>
              <Button variant="danger" onClick={handleConfirmDelete}>Confirmar eliminación</Button>
            </>
          )
        }
      >
        {deletingCategory && (
          <div className={styles.deleteModalBody}>
             {hasChildrenOrProducts(deletingCategory) ? (
               <div className={styles.blockingError}>
                  <div className={styles.errorIconBox}><AlertCircle size={32} /></div>
                  <p className={styles.errorMsg}>
                    No es posible eliminar esta categoría. Primero reasigna o elimina los elementos asociados.
                  </p>
                  <div className={styles.associatedList}>
                     <div className={styles.assocItem}>
                        <strong>{categories.filter(c => c.parentId === deletingCategory.id).length}</strong> Subcategorías
                     </div>
                     <div className={styles.assocItem}>
                        <strong>{deletingCategory.productCount}</strong> Productos
                     </div>
                  </div>
               </div>
             ) : (
               <div className={styles.confirmMsg}>
                  ¿Estás seguro que deseas eliminar la categoría <strong>{deletingCategory.name}</strong>? Esta acción no se puede deshacer.
               </div>
             )}
          </div>
        )}
      </Modal>
    </div>
  );
}
