import React, { useState } from 'react'
import { Menu, PlusCircle, Users } from 'lucide-react'
import MenuList from './components/MenuList'
import AddEditMenuItem from './components/AddEditMenuItem'
import ClientMenu from './components/ClientMenu'

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isClientView, setIsClientView] = useState(false);

  const handleAddItem = () => {
    setIsAddingItem(true);
    setEditingItem(null);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingItem(true);
  };

  const handleDeleteItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleSaveItem = (item: Omit<MenuItem, 'id'>, file: File | null) => {
    const newItem = {
      ...item,
      id: editingItem ? editingItem.id : Date.now(),
      imageUrl: file ? URL.createObjectURL(file) : item.imageUrl
    };

    if (editingItem) {
      setMenuItems(menuItems.map(menuItem => 
        menuItem.id === editingItem.id ? newItem : menuItem
      ));
    } else {
      setMenuItems([...menuItems, newItem]);
    }
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const toggleView = () => {
    setIsClientView(!isClientView);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Menu className="mr-2" /> Restaurant Menu Dashboard
        </h1>
        <div>
          <button
            onClick={toggleView}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center mr-2"
          >
            <Users className="mr-2" /> {isClientView ? 'Admin View' : 'Client View'}
          </button>
          {!isClientView && (
            <button
              onClick={handleAddItem}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <PlusCircle className="mr-2" /> Add Item
            </button>
          )}
        </div>
      </header>
      {isClientView ? (
        <ClientMenu menuItems={menuItems} />
      ) : (
        <>
          <MenuList
            menuItems={menuItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
          {isAddingItem && (
            <AddEditMenuItem
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setIsAddingItem(false);
                setEditingItem(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;