import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock } from 'lucide-react';
import Card from '../components/Card';

interface PINLockProps {
  expectedPIN: string;
  onUnlock: () => void;
}

export default function PINLock({ expectedPIN, onUnlock }: PINLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePINInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === expectedPIN) {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 1000);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen bg-beige p-4 md:p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card backgroundColor="bg-white">
          <div className="text-center py-8">
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <Lock size={64} className={`mx-auto mb-6 ${error ? 'text-red-500' : 'text-brun-terreux'}`} />
              
              <h1 className="text-3xl font-playfair font-bold text-noir-chaud mb-4">
                TheraSpace
              </h1>
              
              <p className="text-brun-terreux mb-8">
                Entre ton code PIN
              </p>

              {/* PIN Display */}
              <div className="flex justify-center gap-4 mb-8">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all ${
                      pin.length > index 
                        ? error 
                          ? 'bg-red-500' 
                          : 'bg-brun-terreux'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-4">
                  Code incorrect
                </p>
              )}

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <motion.button
                    key={digit}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handlePINInput(digit.toString())}
                    className="w-16 h-16 rounded-full bg-beige text-noir-chaud text-xl font-bold hover:bg-brun-terreux hover:text-white transition-colors"
                    disabled={pin.length >= 4}
                  >
                    {digit}
                  </motion.button>
                ))}
                
                <div />
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePINInput('0')}
                  className="w-16 h-16 rounded-full bg-beige text-noir-chaud text-xl font-bold hover:bg-brun-terreux hover:text-white transition-colors"
                  disabled={pin.length >= 4}
                >
                  0
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="w-16 h-16 rounded-full bg-gray-200 text-brun-terreux text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  ⌫
                </motion.button>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
