import { Route, Routes } from "react-router-dom";
import CreateArrival from "./components/CreateArrival/CreateArrivals";
import FinishedArrivals from "./components/FinishedArrivals/FinishedArrivals";
import UpcomingArrivals from "./components/UpcomingArrivals/UpcomingArrivals";
import Navbar from "./navbar/Navbar";
import ProductForm from "./components/products/Products";
import ProductUpdated from "./components/products/Productslist";

function App() {
  return (
    <>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<CreateArrival />} />
          <Route path="/upcomingarrivals" element={<UpcomingArrivals />} />
          <Route path="/finishedarrivals" element={<FinishedArrivals />} />
          <Route path="/products" element={<ProductForm />} />
          <Route path="/productsupdated" element={<ProductUpdated />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
