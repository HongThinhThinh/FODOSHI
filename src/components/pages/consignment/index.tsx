import ProductDetail from "../admin/product-detail";

function ConsignmentPage() {
  return (
    <div className="flex items-center justify-center p-3">
      <ProductDetail isCustomWidth isHidding isConsigment />
    </div>
  );
}

export default ConsignmentPage;
