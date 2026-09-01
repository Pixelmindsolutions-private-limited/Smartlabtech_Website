// src/components/ServiceModal.js

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

export default function ServiceModal({ isOpen, onClose }) {
  const [showModal, setShowModal] = useState(false);

  const [popupData, setPopupData] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch Popup API
  const fetchPopup = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://api.smartlabtech.com/api/servicepage/popup"
      );

      if (response.data?.data?.isActive === true) {
        setPopupData(response.data.data);

        setTimeout(() => {
          setShowModal(true);

          if (onClose) {
            // optional if needed
          }
        }, 1000);
      }
    } catch (error) {
      console.log("Popup API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPopup();
    } else {
      setShowModal(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);

    if (onClose) onClose();
  };

  return (
    <>
      <FontLink />

      <AnimatePresence>
        {!loading &&
          popupData?.isActive === true &&
          showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]"
                onClick={handleClose}
              />

              {/* Modal */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                transition={{
                  duration: 0.4,
                  type: "spring",
                  damping: 25,
                }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
              >
                <div
                  className="relative max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl bg-white pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <X size={20} />
                  </button>

                  {/* Popup Image */}
                  <div className="relative w-full">
                    <img
                      src={popupData.image}
                      alt="Popup"
                      className="w-full h-auto max-h-[90vh] object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
      </AnimatePresence>
    </>
  );
}