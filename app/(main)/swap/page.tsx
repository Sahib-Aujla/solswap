import { getAllTokens } from "@/utils/jup";
import React, { useEffect } from "react";

const Swap = () => {
  useEffect(() => {
    getAllTokens().then((res) => console.log(res));
  }, []);
  return <div></div>;
};

export default Swap;
