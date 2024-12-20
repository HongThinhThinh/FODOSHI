import { navbar } from "../../../assets/contant";
import { Link } from "react-router-dom";
import "./styles.scss";
function Hero() {
  return (
    <ul className="navbar">
      {navbar.map((item, index) => (
        <li className="navbar-item" key={index}>
          <Link to={item.path}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Hero;
