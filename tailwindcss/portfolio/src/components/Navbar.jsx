import { IoIosContact } from "react-icons/io";
import { LuUserRound } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { LuHouse } from "react-icons/lu";
import { LuEarth } from "react-icons/lu";

function Navbar() {
  return (
    <div className="flex m-4 mx-8 p-2 gap-4 justify-between items-center text-xl">
      <div className="text-4xl font-medium text-blue-500">
        <LuEarth />
      </div>
      <div className="flex gap-6 ">
        <div className="flex items-center gap-2  hover:text-blue-500  hover:shadow-blue-500 cursor-pointer">
          <LuHouse />
          Home
        </div>
        <div className="flex items-center gap-2 hover:text-blue-500 hover:shadow-blue-500 cursor-pointer">
          <LuUserRound />
          About Me
        </div>
        <div className="flex items-center gap-2 hover:text-blue-500  hover:shadow-blue-500 cursor-pointer">
          <LuPhone />
          Contact Me
        </div>
      </div>
    </div>
  );
}

export default Navbar;
