import React, { useEffect, useState } from 'react';

export default function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 18 floating ambient memory particles
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 14 + 6,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.45 + 0.25
    }));
    setParticles(generated);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.id % 3 === 0 
              ? 'radial-gradient(circle, rgba(212,175,55,0.7) 0%, rgba(212,175,55,0) 70%)'
              : p.id % 2 === 0 
              ? 'radial-gradient(circle, rgba(122,46,53,0.5) 0%, rgba(122,46,53,0) 70%)'
              : 'radial-gradient(circle, rgba(63,111,100,0.6) 0%, rgba(63,111,100,0) 70%)',
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );
}
