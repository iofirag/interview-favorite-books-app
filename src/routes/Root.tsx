import { Outlet } from "react-router-dom";
import { isLogin } from "../tools";
import { useNavigate } from "react-router-dom";

export default function Root() {
    
    
  return (
    <>
      {/* all the other elements */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}