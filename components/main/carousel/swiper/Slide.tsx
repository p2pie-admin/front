import React from "react";
import { motion } from "framer-motion";

interface SlideProps {
  text: string;
  style: React.CSSProperties;
}

export const Slide: React.FC<SlideProps> = ({ text, style }) => {
  return <div style={style}>{text}</div>;
};

// src/components/VerticalTextSlider.tsx
