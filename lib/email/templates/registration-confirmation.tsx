import * as React from 'react';

interface RegistrationConfirmationProps {
  firstName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  cancelUrl: string;
}

export function RegistrationConfirmationEmail({
  firstName,
  eventTitle,
  eventDate,
  location,
  cancelUrl,
}: RegistrationConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e3a5f', marginBottom: '24px' }}>
        You're registered!
      </h1>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        Hi {firstName},
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        You're confirmed for <strong>{eventTitle}</strong>.
      </p>

      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        margin: '24px 0'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
          <strong>When:</strong> {eventDate}
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
          <strong>Where:</strong> {location}
        </p>
      </div>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        We look forward to seeing you there!
      </p>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '32px' }}>
        Need to cancel? <a href={cancelUrl} style={{ color: '#1e3a5f' }}>Click here</a>
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />

      <p style={{ fontSize: '12px', color: '#999' }}>
        DC Abundance - Building a more abundant DC
      </p>
    </div>
  );
}
