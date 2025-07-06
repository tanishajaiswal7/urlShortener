import { useState, useEffect } from 'react'
import './App.css'

interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
}

function App() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [urls, setUrls] = useState<Url[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/urls')
      const data = await response.json()
      setUrls(data)
    } catch (error) {
      console.error('Error fetching URLs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      })

      if (response.ok) {
        setOriginalUrl('')
        fetchUrls()
      }
    } catch (error) {
      console.error('Error shortening URL:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`http://localhost:5000/${url}`)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const formatUrl = (url: string) => {
    if (url.length > 50) {
      return url.substring(0, 50) + '...'
    }
    return url
  }

  return (
    <div className="app">
      <div className="hero-section">
        <div className="hero-content">
          <div className="logo">
            <h1>LinkShrinker</h1>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="main-card">
          <div className="card-header">
            <h2>Create Short Link</h2>
            <p>Enter your URL below to generate a shortened version</p>
          </div>
          
          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <div className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
                </svg>
              </div>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/your-very-long-url"
                required
                className="url-input"
              />
              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13H5V11H19V13Z" fill="currentColor"/>
                      <path d="M6 19L18 12L6 5V19Z" fill="currentColor"/>
                    </svg>
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="urls-section">
          <div className="section-header">
            <h2>Your Shortened URLs</h2>
            <div className="stats">
              <span className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
                </svg>
                {urls.length} Links
              </span>
              <span className="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                </svg>
                {urls.reduce((total, url) => total + url.clicks, 0)} Total Clicks
              </span>
            </div>
          </div>

          <div className="urls-grid">
            {urls.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
                </svg>
                <h3>No URLs yet</h3>
                <p>Start by shortening your first URL above</p>
              </div>
            ) : (
              urls.map((url) => (
                <div key={url._id} className="url-card">
                  <div className="url-content">
                    <div className="url-header">
                      <div className="url-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="currentColor"/>
                        </svg>
                        <span className="url-domain">{formatUrl(url.originalUrl)}</span>
                      </div>
                      <div className="click-count">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                        </svg>
                        {url.clicks} clicks
                      </div>
                    </div>
                    
                    <div className="short-url-section">
                      <div className="short-url-container">
                        <a 
                          href={`http://localhost:5000/${url.shortUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="short-url-link"
                        >
                          localhost:5000/{url.shortUrl}
                        </a>
                        <button 
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className={`copy-btn ${copiedUrl === url.shortUrl ? 'copied' : ''}`}
                          title="Copy to clipboard"
                        >
                          {copiedUrl === url.shortUrl ? (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
