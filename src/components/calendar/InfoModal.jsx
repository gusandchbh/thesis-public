import React, { useEffect, useRef } from "react";

const InfoModal = ({ isOpen, onClose }) => {
  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="flex h-full items-center justify-center">
        <div
          ref={modalRef}
          className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full"
        >
          <div className="flex justify-between items-center">
            <h2
              className="text-2xl font-bold text-center mx-auto"
              style={{ color: "#333" }}
            >
              Information about the study
            </h2>

            <button
              onClick={onClose}
              className="text-lg font-semibold"
              style={{ color: "#333" }}
            >
              ✖
            </button>
          </div>
          <div className="mt-4" style={{ color: "#333", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "16px" }}>
              Information can be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
