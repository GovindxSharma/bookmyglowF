import React from "react";

const Credit = () => {
  const credits = [
    { name: "Trusha", role: "Developer", link: "https://trusha-jadeja.onrender.com/" },
    { name: "Saim", role: "Product Manager" ,link:"https://www.linkedin.com/in/saim-khoja/"},
    { name: "Govind", role: "Developer", link: "https://govind-sharma.onrender.com/" },
  ];

  return (
    <div className="mb-10 border-t border-[#636CCB]/20 pt-4 text-center text-xs text-[#2A2A2A]/60 space-y-1">
      <p>
        &copy; {new Date().getFullYear()} Bunty's Unisex Saloon. All rights reserved.
      </p>

      <p className="mt-1">
        {credits.map((person, index) => (
          <span key={index}>
            {person.link ? (
              <a
                href={person.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2A2A2A]/80 hover:text-[#636CCB] hover:underline transition-colors"
              >
                {person.name}
              </a>
            ) : (
              person.name
            )}{" "}
            ({person.role})
            {index < credits.length - 1 ? " | " : ""}
          </span>
        ))}
      </p>
    </div>
  );
};

export default Credit;
