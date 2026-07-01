"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";

export function Hero() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background gradient orbs */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ textAlign: "center", position: "relative", zIndex: 1 }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "rgba(168, 85, 247, 0.1)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            borderRadius: 100,
            marginBottom: 24,
          }}
        >
          <span style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            animation: "pulse 2s infinite",
          }} />
          <span style={{ fontSize: 14, color: "#a78bfa" }}>Available for opportunities</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: "clamp(48px, 10vw, 96px)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 16,
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ILONA
          <br />
          KUZNETSOVA
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            fontSize: "clamp(18px, 3vw, 24px)",
            color: "#a1a1aa",
            marginBottom: 32,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Data Scientist
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: 18,
            color: "#71717a",
            maxWidth: 600,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Building intelligent systems that bridge the gap between complex data and meaningful insights. Based in Kyiv, working globally.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
        >
          <a
            href="#projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
              borderRadius: 8,
              fontWeight: 600,
              color: "#fff",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(168, 85, 247, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            View Projects
          </a>
          <a
            href="#contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              background: "transparent",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              fontWeight: 500,
              color: "#e4e4e7",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a855f7";
              e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#3f3f46";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            marginTop: 48,
          }}
        >
          <a
            href="mailto:ilonakuz@proton.me"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #27272a",
              color: "#a1a1aa",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a855f7";
              e.currentTarget.style.color = "#a855f7";
              e.currentTarget.style.background = "rgba(168, 85, 247, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#27272a";
              e.currentTarget.style.color = "#a1a1aa";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
          >
            <Mail size={20} />
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "#52525b",
        }}
      >
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
