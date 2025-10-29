import React from "react";

const Credit = () => {
  const credits = [
    { name: "Trusha", role: "Developer" },
    { name: "Saim", role: "Product Manager" },
    { name: "Govind", role: "Developer" },
    

    
  ];

  return (
    <div className="mb-10 border-t border-[#636CCB]/20 pt-4 text-center text-xs text-[#2A2A2A]/60 space-y-1">
      <p>&copy; {new Date().getFullYear()} Bunty's Unisex Saloon. All rights reserved.</p>
      <p className="mt-1">
        {credits.map((person, index) => (
          <span key={index}>
            {person.name} ({person.role})
            {index < credits.length - 1 ? " | " : ""}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Credit;
