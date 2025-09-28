# Investera (Private) Limited - Website

A professional 5-page responsive website for Investera (Private) Limited, a Sharia-compliant investment firm focused on Colombo Stock Exchange (CSE) investments in Sri Lanka.

## Features

- **5 Complete Pages**: Home, About Us, Our Strategy, Market Insights, and Contact
- **Live CSE Data Integration**: Real-time market data from Colombo Stock Exchange API
- **Responsive Design**: Mobile-first approach using Bootstrap 5
- **Professional Branding**: Navy and gold color scheme with premium design
- **Sharia Compliance Focus**: Ethical investment principles throughout
- **Interactive Elements**: Contact forms, live ticker, market dashboards

## Pages

### 1. Home (`index.html`)
- Hero banner with company branding
- Live CSE ASPI index widget
- Company overview and focus areas
- Vision & Mission cards
- Investment approach highlights
- Live ticker strip

### 2. About Us (`about.html`)
- Company overview and foundation
- Vision & Mission statements
- Sharia & Ethical principles
- Company timeline
- Core values

### 3. Our Strategy (`strategy.html`)
- CSE market explanation
- Investment rationale
- Risk management approach
- Sharia compliance process
- Live market data (gainers/losers)
- Investment process timeline

### 4. Market Insights (`insights.html`)
- Live market summary dashboard
- Top gainers, losers, and most active stocks
- Research reports section
- Market commentary
- Auto-refresh functionality (60 seconds)

### 5. Contact (`contact.html`)
- Contact form with validation
- Multiple email addresses for different inquiries
- Office hours and response times
- Google Maps integration
- FAQ section

## Technical Features

### CSE API Integration (`cseApi.js`)
- Market summary data
- Top gainers and losers
- Most active stocks
- Real-time ASPI index
- Auto-refresh every 60 seconds
- Error handling and caching

### Styling (`style.css`)
- Custom navy and gold branding
- Responsive design
- Professional typography
- Smooth animations and transitions
- Mobile-optimized layouts

### Technologies Used
- HTML5
- CSS3 (Custom + Bootstrap 5)
- JavaScript (ES6+)
- Bootstrap 5.3.3
- Font Awesome 6.4.0
- CSE API integration

## Setup Instructions

1. Download all files to a web server or local development environment
2. Ensure all files are in the same directory
3. Open `index.html` in a web browser
4. The CSE API integration will automatically load live market data

## File Structure

```
/
├── index.html          # Home page
├── about.html          # About Us page
├── strategy.html       # Our Strategy page
├── insights.html       # Market Insights page
├── contact.html        # Contact page
├── style.css           # Custom styles
├── cseApi.js          # CSE API integration
└── README.md          # This file
```

## CSE API Endpoints Used

- `/api/marketSummery` - Market summary data
- `/api/topGainers` - Top gaining stocks
- `/api/topLosers` - Top losing stocks
- `/api/mostActive` - Most actively traded stocks

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

© 2025 Investera (Private) Limited. All rights reserved.

## Contact

- **General**: info@investera.lk
- **Investments**: investors@investera.lk
- **Partnerships**: partners@investera.lk
