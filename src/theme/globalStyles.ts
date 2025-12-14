import { css } from "@emotion/react";

export const globalStyles = css`
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Selection color */
  ::selection {
    background-color: rgba(37, 99, 235, 0.2);
    color: inherit;
  }

  /* Smooth focus outline */
  :focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Remove default focus outline for mouse users */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Better image rendering */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Smooth transitions for all interactive elements */
  a,
  button,
  input,
  textarea,
  select {
    transition: all 0.2s ease-in-out;
  }

  /* Prevent text overflow */
  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Responsive table */
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* Print styles */
  @media print {
    .no-print {
      display: none !important;
    }

    .page-break {
      page-break-before: always;
    }
  }

  /* Accessibility improvements */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Loading skeleton animation */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Custom utility classes */
  .glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .gradient-text {
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .shadow-soft {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .shadow-medium {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  .shadow-large {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;
