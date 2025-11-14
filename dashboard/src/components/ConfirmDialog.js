import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel, title = "Confirm Action" }) => {
  return (
    <>
      {/* Backdrop overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onCancel}
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}
        </style>

        {/* Dialog box */}
        <div
          style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            minWidth: '400px',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s ease-out',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#333'
          }}>
            {title}
          </h3>

          {/* Message */}
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '0.95rem',
            color: '#666',
            lineHeight: '1.5'
          }}>
            {message}
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 24px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                background: '#fff',
                color: '#666',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f5f5f5';
                e.target.style.borderColor = '#999';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff';
                e.target.style.borderColor = '#ddd';
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 24px',
                border: 'none',
                borderRadius: '6px',
                background: '#dc3545',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#c82333';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#dc3545';
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;