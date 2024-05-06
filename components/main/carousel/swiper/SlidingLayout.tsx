// import React, { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";

// interface SlideProps {
//   text: string;
//   style: React.CSSProperties;
// }

// const Slide: React.FC<SlideProps> = ({ text, style }) => {
//   return <motion.div style={style}>{text}</motion.div>;
// };

// // src/components/VerticalTextSlider.tsx

// interface SliderProps {
//   texts: string[];
// }

// const sliderVariants = {
//   hidden: (direction: number) => ({
//     y: direction > 0 ? 300 : -300,
//     opacity: 0,
//   }),
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       y: { type: "spring", stiffness: 300, damping: 30 },
//       opacity: { duration: 0.2 },
//     },
//   },
//   exit: (direction: number) => ({
//     y: direction < 0 ? 300 : -300,
//     opacity: 0,
//   }),
// };

// export const VerticalTextSlider: React.FC<SliderProps> = ({ texts }) => {
//   const [[page, direction], setPage] = useState<[number, number]>([0, 0]);

//   const paginate = (newDirection: number) => {
//     setPage([
//       Math.max(0, Math.min(page + newDirection, texts.length - 3)),
//       newDirection,
//     ]);
//   };

//   return (
//     <div
//       className="slider-container"
//       style={{ position: "relative", height: "300px", overflow: "hidden" }}
//     >
//       <AnimatePresence initial={false} custom={direction}>
//         {[...Array(3)].map((_, i) => (
//           <Slide
//             key={page + i}
//             text={texts[(page + i) % texts.length]}
//             style={{
//               position: "absolute",
//               top: `${33.3 * i}%`,
//               width: "100%",
//               height: "100px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "24px",
//             }}
//           />
//         ))}
//       </AnimatePresence>
//       <motion.div
//         drag="y"
//         dragConstraints={{ top: 0, bottom: 0 }}
//         onDragEnd={(e, { offset, velocity }) => {
//           const swipe = Math.abs(offset.y);
//           if (swipe > 50) {
//             paginate(offset.y > 0 ? -1 : 1);
//           }
//         }}
//         style={{ width: "100%", height: "100%", position: "absolute", top: 0 }}
//       ></motion.div>
//       <div className="controls">
//         <button onClick={() => paginate(-1)}>Prev</button>
//         <button onClick={() => paginate(1)}>Next</button>
//       </div>
//     </div>
//   );
// };
