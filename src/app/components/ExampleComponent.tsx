// src/components/ExampleComponent.tsx
import React from "react";

const ExampleComponent = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Merhaba, Tailwind!</h1>
        <p className="text-lg">
          CSS değişkenleri ve Tailwind CSS kullanarak temalı bir arayüz.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Tıklayın
        </button>
      </div>
    </div>
  );
};

export default ExampleComponent;
