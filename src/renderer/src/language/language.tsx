import React from "react";

export const SpanishFlag: React.FC = () => (
  <svg
    xmlns="http://w3.org"
    viewBox="0 0 750 500"
    preserveAspectRatio="xMidYMid slice"
    style={{ width: "100%", height: "100%" }}
  >
    <rect width="750" height="500" fill="#c60b1e" />
    <rect width="750" height="250" y="125" fill="#ffc400" />
  </svg>
);

export const EnglishFlag: React.FC = () => (
  <svg
    xmlns="http://w3.org"
    viewBox="0 0 60 30"
    preserveAspectRatio="xMidYMid slice"
    style={{ width: "100%", height: "100%" }}
  >
    <path d="M0 0v30h60V0z" fill="#012169" />
    <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
    <path d="M0 0l60 30M60 0L0 30" stroke="#012169" strokeWidth="4" />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
  </svg>
);

export const FlagContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      overflow: "hidden"
    }}
  >
    {children}
  </div>
);
