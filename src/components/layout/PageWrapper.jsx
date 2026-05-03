import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export default function PageWrapper({ title, children }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      <Sidebar />
      <div className="main-wrap flex-1">
        <TopBar title={title} />
        <motion.main
          className="flex-1 p-6"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
