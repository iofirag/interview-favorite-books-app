import React, { useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { isLogin } from "../tools";
import { useNavigate } from "react-router-dom";

export default function Root() {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isLogin()) {return navigate('/app')}
        return navigate('/')
    }, [navigate])
    
  return (
    <>
      {/* all the other elements */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}