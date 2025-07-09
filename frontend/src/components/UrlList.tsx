import { useState } from 'react';
import './UrlList.css';
import QRCodeComponent from './QRCode';

interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface UrlListProps {
  urls: Url[];
}

export default function UrlList({ urls }: UrlListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`https://2261-152-59-119-156.ngrok-free.app/${url}`);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatUrl = (url: string) => {
    if (url.length > 50) {
      return url.substring(0, 50) + '...';
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="url-list">
      <div className="list-header">
        <h2>Your Shortened URLs</h2>
        <div className="list-stats">
          <span className="stat-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {urls.length} URLs
          </span>
          <span className="stat-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {urls.reduce((total, url) => total + url.clicks, 0)} Clicks
          </span>
        </div>
      </div>

      <div className="urls-container">
        {urls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No URLs yet</h3>
            <p>Start by shortening your first URL above to see it here</p>
          </div>
        ) : (
          <div className="urls-grid">
            {urls.map((url) => (
              <div key={url._id} className="url-card">
                <div className="url-header">
                  <div className="url-info">
                                         <div className="original-url">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                         <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                         <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                         <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                       </svg>
                       <span className="url-domain">{formatUrl(url.originalUrl)}</span>
                     </div>
                    <div className="url-meta">
                      <span className="url-date">{formatDate(url.createdAt)}</span>
                    </div>
                  </div>
                  <div className="url-stats">
                                         <div className="click-count">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                       </svg>
                       <span>{url.clicks} clicks</span>
                     </div>
                  </div>
                </div>
                
                <div className="short-url-section">
                  <div className="short-url-container">
                                         <a 
                       href={`https://2261-152-59-119-156.ngrok-free.app/${url.shortUrl}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="short-url-link"
                     >
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                         <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                       localhost:5000/{url.shortUrl}
                     </a>
                    <div className="short-url-actions">
                      <button 
                        onClick={() => copyToClipboard(url.shortUrl)}
                        className={`copy-btn ${copiedUrl === url.shortUrl ? 'copied' : ''}`}
                        title="Copy to clipboard"
                      >
                                               {copiedUrl === url.shortUrl ? (
                           <>
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                             Copied!
                           </>
                         ) : (
                           <>
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                               <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                             </svg>
                             Copy
                           </>
                         )}
                      </button>
                      <button 
                        onClick={() => setQrModalUrl(`https://2261-152-59-119-156.ngrok-free.app/${url.shortUrl}`)}
                        className="qr-btn"
                        title="Generate QR Code"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                          <rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                          <rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                          <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
                          <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
                          <rect x="11" y="15" width="2" height="2" fill="currentColor"/>
                          <rect x="15" y="11" width="2" height="2" fill="currentColor"/>
                          <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
                          <rect x="13" y="17" width="2" height="2" fill="currentColor"/>
                          <rect x="17" y="17" width="2" height="2" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {qrModalUrl && (
        <QRCodeComponent 
          value={qrModalUrl} 
          showModal={true}
          onClose={() => setQrModalUrl(null)}
        />
      )}
    </div>
  );
} 