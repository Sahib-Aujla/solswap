import React from "react";

const TokenCreate = () => {
  return (
    <div className="border border-slate-300 rounded-lg">
      <input
        type="text"
        placeholder="name"
        className="bg-inherit border border-slate-500 p-4 m-4  "
      />
      <input
        type="text"
        placeholder="Symbol"
        className="bg-inherit border border-slate-500 p-4 m-4  "
      />
      <input
        type="text"
        placeholder="Initial Supply"
        className="bg-inherit border border-slate-500 p-4 m-4  "
      />
      <input
        type="text"
        placeholder="Image URL"
        className="bg-inherit border border-slate-500 p-4 m-4  "
      />
      <input
        type="text"
        placeholder="Decimals"
        className="bg-inherit border border-slate-500 p-4 m-4  "
      />
      <button className="bg-white text-black p-3 w-4/5 m-5 hover:bg-slate-100">
        Create Token
      </button>
    </div>
  );
};

export default TokenCreate;
