// components/PageTransition.tsx
import { motion, AnimatePresence } from "framer-motion"
import { PropsWithChildren } from "react"

export default function PageTransition({ children }: PropsWithChildren) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
                className="w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}