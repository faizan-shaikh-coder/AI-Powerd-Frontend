import React from 'react'
import { Brain, Trash2 } from 'lucide-react';

const Navbar = ({ onClearReview }) => {
  return (
    <header>
      <nav className='fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 bg-white/5 backdrop-blur-lg z-50'>

        {/* navbar logo */}
        <div className='flex items-center gap-1'>
          <Brain size={26} className='text-cyan-400' />
          <h1 className='text-cyan-400 font-semibold text-xl'>Revivr<span className='text-white'>.AI</span></h1>
        </div>

        {/*Claer Button*/}
        <button onClick={onClearReview} className='flex items-center gap-2 bg-red-500 hover:bg-red-400
         text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200'><Trash2 size={16} /></button>
      </nav>
    </header>
  )
}

export default Navbar
