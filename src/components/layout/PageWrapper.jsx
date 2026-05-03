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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      {/* main area shifts right to clear fixed sidebar (260px expanded default) */}
      <div className="main-wrap flex-1" style={{ marginLeft: 260, minWidth: 0 }}>
        <TopBar title={title} />
        <motion.main
          style={{ padding: '1.5rem', flex: 1 }}
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
