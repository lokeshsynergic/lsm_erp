import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";
import "../../../styles/productAdd.css";
import {
  saveProduct,
  getProductById,
  addProductImage,
  getProductImages,
  deleteProductImage,
  addProductDocument,
  getProductDocuments,
  deleteProductDocument,
} from "../../../services/inventory/products";
import {
  getCategory,
  getSubCategory,
  getManufacturer,
  getUnit,
} from "../../../services/inventory/master";
import { useNavigate, useParams } from "react-router-dom";

const tabs = [
  "Core Identification",
  "Classification & Tax",
  "Pricing",
  "Status & Lifecycle",
  "Images & Documents",
];

function ProductAdd() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Master Data ---
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [units, setUnits] = useState([]);

  // --- Core Identification ---
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [shortName, setShortName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [barcode, setBarcode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [productType, setProductType] = useState("Finished Good");
  const [isAssetEligible, setIsAssetEligible] = useState(false);
  const [isSellable, setIsSellable] = useState(true);
  const [isPurchasable, setIsPurchasable] = useState(true);
  const [description, setDescription] = useState("");

  // --- Classification & Tax ---
  const [hsnCode, setHsnCode] = useState("");
  const [gstCategory, setGstCategory] = useState("");
  const [gstRate, setGstRate] = useState("");

  // --- Pricing ---
  const [costPrice, setCostPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [currency, setCurrency] = useState("INR");

  // --- Status & Lifecycle ---
  const [status, setStatus] = useState("Draft");
  const [launchDate, setLaunchDate] = useState("");
  const [discontinueDate, setDiscontinueDate] = useState("");

  // --- Images & Documents ---
  const [productImages, setProductImages] = useState([]);
  const [productDocuments, setProductDocuments] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const catData = await getCategory();
        setCategories(Array.isArray(catData) ? catData : []);

        const subCatData = await getSubCategory();
        setSubCategories(Array.isArray(subCatData) ? subCatData : []);

        const mfgData = await getManufacturer();
        setManufacturers(Array.isArray(mfgData) ? mfgData : []);

        const unitData = await getUnit();
        setUnits(Array.isArray(unitData) ? unitData : []);
      } catch (err) {
        console.error("Error fetching master data:", err);
      }
    };
    fetchMasterData();
  }, []);

  // Load product if editing
  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      if (data) {
        setProductCode(data.productCode || "");
        setProductName(data.productName || "");
        setShortName(data.shortName || "");
        setCategoryId(data.categoryId || "");
        setSubCategoryId(data.subCategoryId || "");
        setManufacturerId(data.manufacturerId || "");
        setUnitId(data.unitId || "");
        setModelNumber(data.modelNumber || "");
        setBarcode(data.barcodeEanUpc || "");
        setQrCode(data.qrCodeRef || "");
        setProductType(data.productType || "Finished Good");
        setIsAssetEligible(data.isAssetEligible || false);
        setIsSellable(data.isSellable !== undefined ? data.isSellable : true);
        setIsPurchasable(data.isPurchasable !== undefined ? data.isPurchasable : true);
        setDescription(data.description || "");
        setHsnCode(data.hsnCode || "");
        setGstCategory(data.gstCategory || "");
        setGstRate(data.gstRate || "");
        setCostPrice(data.costPrice || "");
        setMrp(data.mrp || "");
        setSellingPrice(data.sellingPrice || "");
        setCurrency(data.currency || "INR");
        setStatus(data.status || "Draft");
        setLaunchDate(data.launchDate || "");
        setDiscontinueDate(data.discontinueDate || "");

        // Load images and documents
        try {
          const images = await getProductImages(id);
          setProductImages(Array.isArray(images) ? images : []);

          const docs = await getProductDocuments(id);
          setProductDocuments(Array.isArray(docs) ? docs : []);
        } catch (err) {
          console.error("Error loading images/documents:", err);
        }
      }
    } catch (error) {
      console.error("Failed to load product details:", error);
    }
  };

  const handleAddImage = async () => {
    if (!imageName.trim() || !imageFile) {
      console.error("Image name and file are required");
      return;
    }

    try {
      const newImage = await addProductImage(id || productCode, {
        document_name: imageName,
        document_url: imageFile.name,
      });
      setProductImages([...productImages, newImage]);
      setImageName("");
      setImageFile(null);
    } catch (error) {
      console.error("Failed to add image:", error);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await deleteProductImage(imageId);
      setProductImages(productImages.filter((img) => img.document_id !== imageId));
    } catch (error) {
      console.error("Failed to remove image:", error);
    }
  };

  const handleAddDocument = async () => {
    if (!documentName.trim() || !documentUrl.trim()) {
      console.error("Document name and URL are required");
      return;
    }

    try {
      const newDoc = await addProductDocument(id || productCode, {
        document_name: documentName,
        document_url: documentUrl,
      });
      setProductDocuments([...productDocuments, newDoc]);
      setDocumentName("");
      setDocumentUrl("");
      setDocumentFile(null);
    } catch (error) {
      console.error("Failed to add document:", error);
    }
  };

  const handleRemoveDocument = async (docId) => {
    try {
      await deleteProductDocument(docId);
      setProductDocuments(productDocuments.filter((doc) => doc.document_id !== docId));
    } catch (error) {
      console.error("Failed to remove document:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName.trim()) {
      console.error("Product name is required");
      return;
    }

    if (!productCode.trim()) {
      console.error("Product code is required");
      return;
    }

    const payload = {
      productCode: productCode,
      productName: productName,
      shortName: shortName,
      categoryId: Number(categoryId) || null,
      subCategoryId: Number(subCategoryId) || null,
      manufacturerId: Number(manufacturerId) || null,
      unitId: Number(unitId) || null,
      modelNumber: modelNumber,
      barcodeEanUpc: barcode,
      qrCodeRef: qrCode,
      productType: productType,
      isAssetEligible: isAssetEligible,
      isSellable: isSellable,
      isPurchasable: isPurchasable,
      description: description,
      hsnCode: hsnCode,
      gstCategory: gstCategory,
      gstRate: Number(gstRate) || 0,
      costPrice: Number(costPrice) || null,
      mrp: Number(mrp) || null,
      sellingPrice: Number(sellingPrice) || null,
      currency: currency,
      status: status,
      launchDate: launchDate,
      discontinueDate: discontinueDate,
    };

    try {
      const response = await saveProduct(payload, id);
      console.log("✓ SUCCESS - Product saved:", response);
      navigate("/inventory/products");
    } catch (error) {
      console.error("✗ ERROR - Failed to save product:", error);
    }
  };

  return (
    <Layout>
      <div className="product-add">
        <div className="product-add-breadcrumb">
          <span>INVENTORY</span>
          <span className="separator">›</span>
          <span>Product</span>
          <span className="separator">›</span>
          <span>{id ? "Edit Product" : "New Product"}</span>
        </div>

        <div className="product-add-heading">
          <div>
            <h1>{id ? "Edit Product" : "New Product"}</h1>
            <span className="not-saved-badge">{id ? "Editing" : "Not Saved"}</span>
          </div>
          <button type="button" className="save-btn" onClick={handleSubmit}>
            {id ? "Update" : "Save"}
          </button>
        </div>

        <div className="product-add-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`product-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="product-add-form">
          {/* CORE IDENTIFICATION TAB */}
          {activeTab === "Core Identification" && (
            <>
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Product Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    disabled={id ? true : false}
                    placeholder="Enter product code"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Product Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="form-field">
                  <label>Short Name</label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    placeholder="Enter short name"
                  />
                </div>

                <div className="form-field">
                  <label>Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Sub-Category</label>
                  <select value={subCategoryId} onChange={(e) => setSubCategoryId(e.target.value)}>
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat.subcategory_id} value={subCat.subcategory_id}>
                        {subCat.subcategory_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Manufacturer</label>
                  <select value={manufacturerId} onChange={(e) => setManufacturerId(e.target.value)}>
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map((mfg) => (
                      <option key={mfg.manufacturer_id} value={mfg.manufacturer_id}>
                        {mfg.manufacturer_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>UOM (Unit of Measure)</label>
                  <select value={unitId} onChange={(e) => setUnitId(e.target.value)}>
                    <option value="">Select Unit</option>
                    {units.map((unit) => (
                      <option key={unit.unit_id} value={unit.unit_id}>
                        {unit.unit_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Model Number</label>
                  <input
                    type="text"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    placeholder="Enter model number"
                  />
                </div>

                <div className="form-field">
                  <label>Barcode (EAN/UPC)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter barcode"
                  />
                </div>

                <div className="form-field">
                  <label>QR Code Reference</label>
                  <input
                    type="text"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    placeholder="Enter QR code reference"
                  />
                </div>

                <div className="form-field">
                  <label>Product Type</label>
                  <select value={productType} onChange={(e) => setProductType(e.target.value)}>
                    <option value="Finished Good">Finished Good</option>
                    <option value="Spare Parts">Spare Parts</option>
                    <option value="Consumable">Consumable</option>
                    <option value="Service">Service</option>
                  </select>
                </div>

                <div className="form-field checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAssetEligible}
                      onChange={(e) => setIsAssetEligible(e.target.checked)}
                    />
                    Is Asset Eligible
                  </label>
                </div>

                <div className="form-field checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isSellable}
                      onChange={(e) => setIsSellable(e.target.checked)}
                    />
                    Is Sellable
                  </label>
                </div>

                <div className="form-field checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isPurchasable}
                      onChange={(e) => setIsPurchasable(e.target.checked)}
                    />
                    Is Purchasable
                  </label>
                </div>
              </div>

              <div className="form-field full-width">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>
            </>
          )}

          {/* CLASSIFICATION & TAX TAB */}
          {activeTab === "Classification & Tax" && (
            <div className="form-grid">
              <div className="form-field">
                <label>HSN Code</label>
                <input
                  type="text"
                  value={hsnCode}
                  onChange={(e) => setHsnCode(e.target.value)}
                  placeholder="Enter HSN code"
                />
              </div>

              <div className="form-field">
                <label>GST Category</label>
                <input
                  type="text"
                  value={gstCategory}
                  onChange={(e) => setGstCategory(e.target.value)}
                  placeholder="Enter GST category"
                />
              </div>

              <div className="form-field">
                <label>GST Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  placeholder="Enter GST rate"
                />
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === "Pricing" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Standard Cost Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="Enter cost price"
                />
              </div>

              <div className="form-field">
                <label>MRP</label>
                <input
                  type="number"
                  step="0.01"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="Enter MRP"
                />
              </div>

              <div className="form-field">
                <label>Standard Selling Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Enter selling price"
                />
              </div>

              <div className="form-field">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="INR">INR (Indian Rupee)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="GBP">GBP (British Pound)</option>
                </select>
              </div>
            </div>
          )}

          {/* STATUS & LIFECYCLE TAB */}
          {activeTab === "Status & Lifecycle" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Discontinued">Discontinued</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div className="form-field">
                <label>Launch Date</label>
                <input
                  type="date"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Discontinue Date</label>
                <input
                  type="date"
                  value={discontinueDate}
                  onChange={(e) => setDiscontinueDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* IMAGES & DOCUMENTS TAB */}
          {activeTab === "Images & Documents" && (
            <>
              <div className="section-title">Product Images (Max 2)</div>
              <div className="image-upload-section">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Image Name</label>
                    <input
                      type="text"
                      value={imageName}
                      onChange={(e) => setImageName(e.target.value)}
                      placeholder="Enter image name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAddImage}
                  disabled={productImages.length >= 2}
                >
                  Add Image
                </button>
              </div>

              {productImages.length > 0 && (
                <div className="images-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Image Name</th>
                        <th>URL</th>
                        <th>Uploaded At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productImages.map((img) => (
                        <tr key={img.document_id}>
                          <td>{img.document_name}</td>
                          <td>{img.document_url}</td>
                          <td>{new Date(img.uploaded_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleRemoveImage(img.document_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="section-title" style={{ marginTop: "30px" }}>
                Product Documents (Max 2)
              </div>
              <div className="document-upload-section">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Document Name</label>
                    <input
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="e.g., Technical Specification"
                    />
                  </div>

                  <div className="form-field">
                    <label>Document URL</label>
                    <input
                      type="text"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="Enter document URL or path"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="add-btn"
                  onClick={handleAddDocument}
                  disabled={productDocuments.length >= 2}
                >
                  Add Document
                </button>
              </div>

              {productDocuments.length > 0 && (
                <div className="documents-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>URL</th>
                        <th>Uploaded At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDocuments.map((doc) => (
                        <tr key={doc.document_id}>
                          <td>{doc.document_name}</td>
                          <td>{doc.document_url}</td>
                          <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleRemoveDocument(doc.document_id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ProductAdd;
