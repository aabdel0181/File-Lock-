import { useState } from "react";
import Navbar from "./Navbar";

const Marketplace = () => {
  const [dataType, setDataType] = useState(null);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        {/* Marketplace content here */}
        <p>Marketplace content will be displayed here.</p>
      </div>
    </div>
  );
};

export default Marketplace;
