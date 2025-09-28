/**
 * CSE API Integration Module for Investera
 * Handles all Colombo Stock Exchange API calls and data processing
 */

class CSEApi {
  constructor() {
    this.baseUrl = 'https://www.cse.lk/api';
    this.cache = new Map();
    this.cacheTimeout = 30000; // 30 seconds cache
  }

  /**
   * Generic API call method with error handling
   */
  async makeApiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error calling CSE API ${endpoint}:`, error);
      return null;
    }
  }

  /**
   * Get market summary data
   */
  async getMarketSummary() {
    const cacheKey = 'marketSummary';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await this.makeApiCall('/marketSummery');
    if (data) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }

  /**
   * Get top gainers
   */
  async getTopGainers() {
    const cacheKey = 'topGainers';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await this.makeApiCall('/topGainers');
    if (data) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }

  /**
   * Get top losers
   */
  async getTopLosers() {
    const cacheKey = 'topLosers';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await this.makeApiCall('/topLosers');
    if (data) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }

  /**
   * Get most active stocks
   */
  async getMostActive() {
    const cacheKey = 'mostActive';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = await this.makeApiCall('/mostActive');
    if (data) {
      this.setCachedData(cacheKey, data);
    }
    return data;
  }

  /**
   * Cache management
   */
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }

  /**
   * Format percentage change with color coding
   */
  formatPercentageChange(change) {
    const num = parseFloat(change);
    const formatted = num.toFixed(2);
    return {
      value: formatted,
      isPositive: num >= 0,
      color: num >= 0 ? 'positive' : 'negative'
    };
  }

  /**
   * Format currency value
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(value);
  }

  /**
   * Format large numbers (market cap, turnover)
   */
  formatLargeNumber(value) {
    const num = parseFloat(value);
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  }
}

/**
 * UI Update Functions
 */
class CSEUI {
  constructor() {
    this.api = new CSEApi();
  }

  /**
   * Update ASPI index display
   */
  async updateASPI() {
    const data = await this.api.getMarketSummary();
    if (!data) {
      this.showError('ASPI', 'Unable to fetch ASPI data');
      return;
    }

    const aspiElement = document.getElementById('aspi-index');
    const changeElement = document.getElementById('aspi-change');
    
    if (aspiElement && data.ASPI) {
      aspiElement.textContent = data.ASPI.toFixed(2);
    }

    if (changeElement && data.ASPIChange) {
      const change = this.api.formatPercentageChange(data.ASPIChange);
      changeElement.textContent = `${change.value}%`;
      changeElement.className = `cse-change ${change.color}`;
    }
  }

  /**
   * Update top gainers table
   */
  async updateTopGainers() {
    const data = await this.api.getTopGainers();
    if (!data) {
      this.showError('gainers', 'Unable to fetch top gainers data');
      return;
    }

    const container = document.getElementById('top-gainers');
    if (!container) return;

    container.innerHTML = this.createStocksTable(data.slice(0, 5), 'Gainers');
  }

  /**
   * Update top losers table
   */
  async updateTopLosers() {
    const data = await this.api.getTopLosers();
    if (!data) {
      this.showError('losers', 'Unable to fetch top losers data');
      return;
    }

    const container = document.getElementById('top-losers');
    if (!container) return;

    container.innerHTML = this.createStocksTable(data.slice(0, 5), 'Losers');
  }

  /**
   * Update most active stocks
   */
  async updateMostActive() {
    const data = await this.api.getMostActive();
    if (!data) {
      this.showError('active', 'Unable to fetch most active data');
      return;
    }

    const container = document.getElementById('most-active');
    if (!container) return;

    container.innerHTML = this.createStocksTable(data.slice(0, 5), 'Most Active');
  }

  /**
   * Create stocks table HTML
   */
  createStocksTable(stocks, title) {
    if (!stocks || stocks.length === 0) {
      return `<div class="text-center text-muted">No ${title.toLowerCase()} data available</div>`;
    }

    let html = `
      <div class="card-custom">
        <div class="card-header-custom">
          <h5 class="mb-0">Top ${title}</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>% Change</th>
                </tr>
              </thead>
              <tbody>
    `;

    stocks.forEach(stock => {
      const change = this.api.formatPercentageChange(stock.change || stock.percentageChange || 0);
      html += `
        <tr>
          <td><strong>${stock.symbol || stock.name || 'N/A'}</strong></td>
          <td>${this.api.formatCurrency(stock.price || stock.lastPrice || 0)}</td>
          <td class="${change.color}">${this.api.formatCurrency(stock.change || 0)}</td>
          <td class="${change.color}">${change.value}%</td>
        </tr>
      `;
    });

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Update market summary dashboard
   */
  async updateMarketSummary() {
    const data = await this.api.getMarketSummary();
    if (!data) {
      this.showError('summary', 'Unable to fetch market summary');
      return;
    }

    // Update ASPI
    const aspiElement = document.getElementById('market-aspi');
    if (aspiElement) {
      aspiElement.textContent = data.ASPI ? data.ASPI.toFixed(2) : 'N/A';
    }

    // Update turnover
    const turnoverElement = document.getElementById('market-turnover');
    if (turnoverElement && data.turnover) {
      turnoverElement.textContent = this.api.formatLargeNumber(data.turnover);
    }

    // Update market cap
    const marketCapElement = document.getElementById('market-cap');
    if (marketCapElement && data.marketCap) {
      marketCapElement.textContent = this.api.formatLargeNumber(data.marketCap);
    }

    // Update change
    const changeElement = document.getElementById('market-change');
    if (changeElement && data.ASPIChange) {
      const change = this.api.formatPercentageChange(data.ASPIChange);
      changeElement.textContent = `${change.value}%`;
      changeElement.className = `cse-change ${change.color}`;
    }
  }

  /**
   * Create ticker content
   */
  async createTickerContent() {
    const [gainers, losers] = await Promise.all([
      this.api.getTopGainers(),
      this.api.getTopLosers()
    ]);

    let tickerItems = [];

    if (gainers && gainers.length > 0) {
      gainers.slice(0, 3).forEach(stock => {
        const change = this.api.formatPercentageChange(stock.change || stock.percentageChange || 0);
        tickerItems.push(`${stock.symbol || stock.name}: ${this.api.formatCurrency(stock.price || stock.lastPrice || 0)} (+${change.value}%)`);
      });
    }

    if (losers && losers.length > 0) {
      losers.slice(0, 3).forEach(stock => {
        const change = this.api.formatPercentageChange(stock.change || stock.percentageChange || 0);
        tickerItems.push(`${stock.symbol || stock.name}: ${this.api.formatCurrency(stock.price || stock.lastPrice || 0)} (${change.value}%)`);
      });
    }

    return tickerItems.join(' • ');
  }

  /**
   * Update ticker
   */
  async updateTicker() {
    const tickerElement = document.getElementById('ticker-content');
    if (!tickerElement) return;

    const content = await this.createTickerContent();
    if (content) {
      tickerElement.textContent = content;
    } else {
      tickerElement.textContent = 'CSE Market Data • Live Updates • Real-time Trading';
    }
  }

  /**
   * Show error message
   */
  showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<div class="text-center text-danger">${message}</div>`;
    }
    console.error(`CSE UI Error: ${message}`);
  }

  /**
   * Initialize all data updates
   */
  async initialize() {
    try {
      await Promise.all([
        this.updateASPI(),
        this.updateTopGainers(),
        this.updateTopLosers(),
        this.updateMostActive(),
        this.updateMarketSummary(),
        this.updateTicker()
      ]);
    } catch (error) {
      console.error('Error initializing CSE data:', error);
    }
  }

  /**
   * Start auto-refresh
   */
  startAutoRefresh(interval = 60000) {
    setInterval(() => {
      this.initialize();
    }, interval);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const cseUI = new CSEUI();
  cseUI.initialize();
  cseUI.startAutoRefresh(60000); // Refresh every 60 seconds
});

// Export for use in other scripts
window.CSEApi = CSEApi;
window.CSEUI = CSEUI;

