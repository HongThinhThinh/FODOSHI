import "./index.scss";
function LoadingUI() {
  return (
    <div className="bg-transparent  w-full h-[80vh] flex items-center justify-center ">
      <div className="loader ">
        <p className="text">FoDoShi Uploading...</p>
      </div>
    </div>
  );
}

export default LoadingUI;
