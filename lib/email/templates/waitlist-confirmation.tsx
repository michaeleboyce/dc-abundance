import * as React from 'react';

interface WaitlistConfirmationProps {
  firstName: string;
  eventTitle: string;
  eventDate: string;
  waitlistPosition: number;
  cancelUrl: string;
}

export function WaitlistConfirmationEmail({
  firstName,
  eventTitle,
  eventDate,
  waitlistPosition,
  cancelUrl,
}: WaitlistConfirmationProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e3a5f', marginBottom: '24px' }}>
        You're on the waitlist
      </h1>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        Hi {firstName},
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        <strong>{eventTitle}</strong> is currently full, but you're #{waitlistPosition} on the waitlist.
      </p>

      <div style={{
        background: '#fff8e6',
        padding: '20px',
        borderRadius: '8px',
        margin: '24px 0',
        borderLeft: '4px solid #f59e0b'
      }}>
        <p style={{ margin: '0', fontSize: '14px', color: '#92400e' }}>
          We'll email you immediately if a spot opens up before the event on <strong>{eventDate}</strong>.
        </p>
      </div>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        Thank you for your interest in DC Abundance events!
      </p>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '32px' }}>
        No longer interested? <a href={cancelUrl} style={{ color: '#1e3a5f' }}>Remove me from the waitlist</a>
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />

      <p style={{ fontSize: '12px', color: '#999' }}>
        DC Abundance - Building a more abundant DC
      </p>
    </div>
  );
}
