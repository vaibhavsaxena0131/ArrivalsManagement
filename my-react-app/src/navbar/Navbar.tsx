import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">CreateArrival</Link>
      <Link to="/home">Home</Link>
      <Link to="/upcomingarrivals">UpcomingArrivals</Link>
      <Link to="/finishedarrivals">FinishedArrivals</Link>
      <Link to="/products">Products</Link>
      <Link to="/productsupdated">ProductsList</Link>
    </div>
  );
};

export default Navbar;
