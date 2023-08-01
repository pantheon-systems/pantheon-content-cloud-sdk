import React from "react";

export default function PageHeader({ title }) {
  return (
    <header className="mx-auto mt-20 text-2xl prose">
      <h1 className="mx-auto text-center">{title}</h1>
    </header>
  );
}
