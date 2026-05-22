
import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import InsightsTab from './components/InsightsTab.jsx';
import CompareTab from './components/CompareTab.jsx';
import ChatWidget from './components/ChatWidget.jsx';
import PreviewPanel from './components/PreviewPanel.jsx';
import SignInPage from './components/SignInPage.jsx';
import { firebaseReady } from './firebase.js';

function App() {
  const [user, setUser] = useState(null);
  const [rawData, setRawData] = useState([]);
  const [parish, setParish] = useState('All Parishes');
  const [district, setDistrict] = useState('All Districts');
  const [sortKey, setSortKey] = useState('poverty');
  const [downloadLabel, setDownloadLabel] = useState('filtered-data');
  const [compareParishes, setCompareParishes] = useState(['Kingston', 'St. Andrew', 'St. Catherine']);
  const [tab, setTab] = useState('insights');

  useEffect(() => {
    fetch('/public/poverty.json')
      .then(res => res.json())
      .then(data => setRawData(data))
      .catch(() => setRawData([]));
  }, []);

  const handleSignIn = (userObj) => setUser(userObj);
  const handleSignOut = () => setUser(null);

  if (!user) {
    return <SignInPage onSignIn={handleSignIn} />;
  }

  return (
    <div className="app-shell" style={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
      <Navbar user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} />
      <HeroSection onParishSelect={setParish} />
      <div className="main">
        <div className="tab-nav" style={{ marginBottom: 24 }}>
          <button
            className={`tab-button${tab === 'insights' ? ' active' : ''}`}
            onClick={() => setTab('insights')}
          >
            Insights
          </button>
          <button
            className={`tab-button${tab === 'compare' ? ' active' : ''}`}
            onClick={() => setTab('compare')}
          >
            Compare Parishes
          </button>
        </div>

        {tab === 'insights' && (
          <div className="dashboard-main" style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <InsightsTab
                rawData={rawData}
                parish={parish}
                district={district}
                sortKey={sortKey}
                downloadLabel={downloadLabel}
                savedStats={{}}
                onParishChange={setParish}
                onDistrictChange={setDistrict}
                onDownloadLabelChange={setDownloadLabel}
                onSortKeyChange={setSortKey}
              />
            </div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ marginTop: 0 }}>
                <ChatWidget />
              </div>
            </div>
          </div>
        )}

        {tab === 'compare' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <CompareTab
              rawData={rawData}
              compareParishes={compareParishes}
              parish={parish}
              district={district}
              onCompareParishesChange={setCompareParishes}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
