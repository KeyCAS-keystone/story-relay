import React from 'react';
import type { CSSProperties } from 'react';

const Loader = () => {
  const wrapperStyle: CSSProperties = {
    minHeight: '3rem',
    minWidth: '14rem',
    fontSize: '2rem',
    position: 'relative',
    overflow: 'hidden',
    maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0))',
    WebkitMaskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0))',
    fontFamily: 'monospace'
  };

  const letterBaseStyle: CSSProperties = {
    width: '1ch',
    position: 'absolute',
    top: '50%',
    transform: 'translate(0px, -50%)',
    left: '100%',
    animation: 'scroll 2.5s linear infinite, rainbow 2.5s infinite'
  };

  const animationStyle = `
    @keyframes scroll {
      to {
        left: -1ch;
      }
    }
    
    @keyframes rainbow {
      0% { color: white; }
      10% { color: #ff0000; }
      20% { color: #ff8700; }
      30% { color: #ffd300; }
      40% { color: #deff0a; }
      50% { color: #a1ff0a; }
      60% { color: #0aff99; }
      70% { color: #0aefff; }
      80% { color: #147df5; }
      90% { color: #580aff; }
      100% { color: #be0aff; }
    }
  `;

  // Create letter delay styles
  const getLetterStyle = (index: number): CSSProperties => ({
    ...letterBaseStyle,
    animationDelay: `calc(2.5s / 10 * (10 - ${index}) * -1)`
  });

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: animationStyle }} />
      <div style={wrapperStyle}>
        <span style={getLetterStyle(1)}>L</span>
        <span style={getLetterStyle(2)}>o</span>
        <span style={getLetterStyle(3)}>a</span>
        <span style={getLetterStyle(4)}>d</span>
        <span style={getLetterStyle(5)}>i</span>
        <span style={getLetterStyle(6)}>n</span>
        <span style={getLetterStyle(7)}>g</span>
        <span style={getLetterStyle(8)}>.</span>
        <span style={getLetterStyle(9)}>.</span>
        <span style={getLetterStyle(10)}>.</span>
      </div>
    </div>
  );
}

export default Loader; 