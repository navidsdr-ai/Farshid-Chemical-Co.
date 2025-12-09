
import React from 'react';

export const FarshidLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 250" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Flask Outline */}
    <path d="M75 25 L125 25 L125 60 L165 150 Q100 165 35 150 L75 60 L75 25 Z" 
      stroke="currentColor" strokeWidth="5" strokeLinejoin="round" fill="none"/>
    
    {/* Flask Rim */}
    <path d="M70 25 H130" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>

    {/* Hexagon */}
    <path d="M100 70 L132 88 V124 L100 142 L68 124 V88 Z" 
      stroke="currentColor" strokeWidth="3.5" fill="none"/>

    {/* Inner Monogram (FCC) - Stylized */}
    <g fill="currentColor">
       {/* Large F */}
       <path d="M82 90 H105 V98 H90 V106 H102 V114 H90 V130 H82 V90 Z" />
       {/* C nested */}
       <path d="M125 100 C125 90 112 90 108 100 L114 103 C116 98 119 98 119 100 C119 104 116 106 114 105 L108 108 C110 115 125 115 125 100 Z" />
       {/* C lower */}
       <path d="M125 120 C125 110 112 110 108 120 L114 123 C116 118 119 118 119 120 C119 124 116 126 114 125 L108 128 C110 135 125 135 125 120 Z" />
    </g>

    {/* Bubbles */}
    <circle cx="115" cy="50" r="4" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="130" cy="40" r="6" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="120" cy="25" r="3" stroke="currentColor" strokeWidth="2.5"/>

    {/* Text */}
    <text x="100" y="195" fontFamily="sans-serif" fontSize="26" fontWeight="900" fill="currentColor" textAnchor="middle">FARSHID</text>
    <text x="100" y="225" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="currentColor" textAnchor="middle" letterSpacing="1">SHAHREZA</text>
  </svg>
);
