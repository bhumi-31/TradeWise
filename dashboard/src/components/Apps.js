import React, { useState } from "react";
import axios from "axios";

const Apps = () => {
  const [activeTab, setActiveTab] = useState("tools");

  return (
    <div className="apps-container" style={{ padding: '20px' }}>
      <h3 className="title">Apps & Tools</h3>
      
      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #eee'
      }}>
        <button
          onClick={() => setActiveTab("tools")}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === "tools" ? '#4184f3' : 'transparent',
            color: activeTab === "tools" ? '#fff' : '#666',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0',
            fontWeight: '500'
          }}
        >
          Trading Tools
        </button>
        <button
          onClick={() => setActiveTab("calculators")}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === "calculators" ? '#4184f3' : 'transparent',
            color: activeTab === "calculators" ? '#fff' : '#666',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0',
            fontWeight: '500'
          }}
        >
          Calculators
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === "analytics" ? '#4184f3' : 'transparent',
            color: activeTab === "analytics" ? '#fff' : '#666',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0',
            fontWeight: '500'
          }}
        >
          Analytics
        </button>
      </div>

      {/* Trading Tools Tab */}
      {activeTab === "tools" && (
        <div className="row">
          <ToolCard
            icon="📊"
            title="Market Scanner"
            description="Scan stocks based on technical indicators"
            action="Launch Scanner"
          />
          <ToolCard
            icon="📈"
            title="Technical Charts"
            description="Advanced charting with 50+ indicators"
            action="Open Charts"
          />
          <ToolCard
            icon="🔔"
            title="Price Alerts"
            description="Set custom price alerts for stocks"
            action="Create Alert"
          />
          <ToolCard
            icon="📰"
            title="Market News"
            description="Real-time news and updates"
            action="View News"
          />
          <ToolCard
            icon="💡"
            title="Stock Screener"
            description="Filter stocks by fundamental criteria"
            action="Screen Stocks"
          />
          <ToolCard
            icon="🎯"
            title="Watchlist Manager"
            description="Organize multiple watchlists"
            action="Manage Lists"
          />
        </div>
      )}

      {/* Calculators Tab */}
      {activeTab === "calculators" && (
        <div className="row">
          <CalculatorCard
            title="Brokerage Calculator"
            description="Calculate trading charges"
            icon="💰"
          />
          <CalculatorCard
            title="Margin Calculator"
            description="Check required margin for trades"
            icon="📊"
          />
          <CalculatorCard
            title="SIP Calculator"
            description="Calculate SIP returns"
            icon="📈"
          />
          <CalculatorCard
            title="Tax Calculator"
            description="Estimate capital gains tax"
            icon="🧾"
          />
          <CalculatorCard
            title="Returns Calculator"
            description="Calculate investment returns"
            icon="💹"
          />
          <CalculatorCard
            title="Risk Calculator"
            description="Assess portfolio risk"
            icon="⚠️"
          />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="row">
          <AnalyticsCard
            title="Portfolio Analytics"
            value="View detailed portfolio breakdown"
            icon="📊"
          />
          <AnalyticsCard
            title="P&L Report"
            value="Generate profit/loss statements"
            icon="📈"
          />
          <AnalyticsCard
            title="Tax Report"
            value="Download tax documents"
            icon="📄"
          />
          <AnalyticsCard
            title="Trade History"
            value="Complete trading history"
            icon="📜"
          />
          <AnalyticsCard
            title="Performance Metrics"
            value="Track your trading performance"
            icon="🎯"
          />
          <AnalyticsCard
            title="Dividend Tracker"
            value="Track dividend income"
            icon="💵"
          />
        </div>
      )}
    </div>
  );
};

// Tool Card Component
const ToolCard = ({ icon, title, description, action }) => (
  <div className="col-md-4 mb-4">
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{icon}</div>
      <h5 style={{ marginBottom: '10px', color: '#333' }}>{title}</h5>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
        {description}
      </p>
      <button style={{
        background: '#4184f3',
        color: '#fff',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem'
      }}>
        {action}
      </button>
    </div>
  </div>
);

// Calculator Card Component
const CalculatorCard = ({ title, description, icon }) => (
  <div className="col-md-4 mb-4">
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: '#fff'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f8f9fa';
      e.currentTarget.style.borderColor = '#4184f3';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fff';
      e.currentTarget.style.borderColor = '#ddd';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '2.5rem' }}>{icon}</div>
        <div>
          <h6 style={{ margin: 0, color: '#333' }}>{title}</h6>
          <small style={{ color: '#666' }}>{description}</small>
        </div>
      </div>
    </div>
  </div>
);

// Analytics Card Component
const AnalyticsCard = ({ title, value, icon }) => (
  <div className="col-md-6 mb-4">
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f0f7ff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fff';
    }}
    >
      <div>
        <h6 style={{ margin: 0, marginBottom: '5px' }}>{title}</h6>
        <small style={{ color: '#666' }}>{value}</small>
      </div>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
    </div>
  </div>
);

export default Apps;