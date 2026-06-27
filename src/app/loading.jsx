// app/loading.js
"use client";

import { motion } from "framer-motion";
import { Loader2, Home, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50/50 via-white to-white">
      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />

      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-md mx-auto px-4"
      >
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            delay: 0.2 
          }}
          className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_8px_30px_rgba(37,99,235,0.25)]"
        >
          <Home className="w-12 h-12 text-white" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-extrabold text-gray-900"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
            RentEase
          </span>
        </motion.h2>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" strokeWidth={2.5} />
          <span className="text-sm text-gray-500 font-medium">Loading...</span>
        </motion.div>

        {/* Loading Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-4 w-full max-w-xs mx-auto h-1.5 bg-gray-200 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ width: "50%" }}
          />
        </motion.div>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-2"
        >
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Finding your dream home
          </p>
          {/* <div className="flex justify-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-500 border border-gray-100">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Loading
            </span>
          </div> */}
        </motion.div>
      </motion.div>
    </div>
  );
}