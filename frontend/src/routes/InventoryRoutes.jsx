import { Routes, Route } from "react-router-dom";
import Category from "../pages/inventory/master/Category";
import AddCategory from "../pages/inventory/master/AddCategory";
import SubCategory from "../pages/inventory/master/SubCategory";
import SubCategoryAdd from "../pages/inventory/master/SubCategoryAdd";
import AddManufacturer from "../pages/inventory/master/AddManufacturer";
import Manufacturer from "../pages/inventory/master/Manufacturer";
import Unit from "../pages/inventory/master/Unit";
import AddUnit from "../pages/inventory/master/AddUnit";
import ProductList from "../pages/inventory/products/ProductList";
import ProductAdd from "../pages/inventory/products/ProductAdd";


function InventoryRoutes() {
  return (
    <Routes>
      <Route path="/category" element={<Category />} />
      <Route path="/category/new" element={<AddCategory />} />
      <Route path="/category/edit/:id" element={<AddCategory />} />
      <Route path="/subcategory" element={<SubCategory />} />
      <Route path="/subcategory/new" element={<SubCategoryAdd />} />
      <Route path="/subcategory/edit/:id" element={<SubCategoryAdd />} />
      <Route path="/manufacturer" element={<Manufacturer />} />
      <Route path="/manufacturer/new" element={<AddManufacturer />} />
      <Route path="/manufacturer/edit/:id" element={<AddManufacturer />} />
      <Route path="/unit" element={<Unit />} />
      <Route path="/unit/new" element={<AddUnit />} />
      <Route path="/unit/edit/:id" element={<AddUnit />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/new" element={<ProductAdd />} />
      <Route path="/products/edit/:id" element={<ProductAdd />} />
      
    </Routes>
  );
}

export default InventoryRoutes;
