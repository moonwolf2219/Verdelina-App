import { motion } from 'motion/react';
import logo from 'figma:asset/e2aa89cda6be816b6f4fece936390b94eff751f6.png';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <img 
          src={logo} 
          alt="Verdelina Agri Hub" 
          className="w-[500px] max-w-full mx-auto object-contain"
        />
      </motion.div>
    </div>
  );
}
