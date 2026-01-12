import * as React from 'react';

interface WaitlistPromotedProps {
  firstName: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  cancelUrl: string;
}

export function WaitlistPromotedEmail({
  firstName,
  eventTitle,
  eventDate,
  location,
  cancelUrl,
}: WaitlistPromotedProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#16a34a', marginBottom: '24px' }}>
        A spot opened up!
      </h1>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        Hi {firstName},
      </p>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        Great news! A spot opened up and you're now <strong>confirmed</strong> for <strong>{eventTitle}</strong>.
      </p>

      <div style={{
        background: '#f0fdf4',
        padding: '20px',
        borderRadius: '8px',
        margin: '24px 0',
        borderLeft: '4px solid #16a34a'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#166534' }}>
          <strong>When:</strong> {eventDate}
        </p>
        <p style={{ margin: '0', fontSize: '14px', color: '#166534' }}>
          <strong>Where:</strong> {location}
        </p>
      </div>

      <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333' }}>
        We look forward to seeing you there!
      </p>

      <p style={{ fontSize: '14px', color: '#666', marginTop: '32px' }}>
        Can no longer attend? <a href={cancelUrl} style={{ color: '#1e3a5f' }}>Cancel my registration</a>
      </p>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />

      <p style={{ fontSize: '12px', color: '#999' }}>
        DC Abundance - Building a more abundant DC
      </p>
    </div>
  );
}
