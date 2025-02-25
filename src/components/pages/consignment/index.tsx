import ProductDetail from "../admin/product-detail";

function ConsignmentPage() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ProductDetail isHidding isConsigment />
    </div>
  );
}

export default ConsignmentPage;
