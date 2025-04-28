import { motion } from 'framer-motion';

export default function DesertModal({ onAccept, onDecline }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 50,
      background: 'rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(2px)'
    }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 16,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
          padding: '2.5rem 2rem',
          minWidth: 320,
          maxWidth: 380,
          textAlign: 'center',
          border: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16, color: '#222' }}>
          Wow, you actually made it? I'm shocked.
        </h2>
        <p style={{ fontSize: 17, color: '#444', marginBottom: 32 }}>
          Ready to try a <span style={{ textDecoration: 'underline' }}>real</span> challenge, or are you just here for the easy stuff?
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 8,
              border: 'none',
              background: '#222',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onClick={onAccept}
          >
            Prove Me Wrong
          </button>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 8,
              border: 'none',
              background: '#fff',
              color: '#222',
              cursor: 'pointer',
              border: '1px solid #bbb',
              transition: 'background 0.2s',
            }}
            onClick={onDecline}
          >
            I'll Stay Safe
          </button>
        </div>
      </motion.div>
    </div>
  );
} 