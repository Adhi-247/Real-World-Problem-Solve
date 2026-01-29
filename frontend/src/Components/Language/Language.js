import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Language.css';

const Language = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSuccess, setShowSuccess] = useState(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      direction: 'ltr'
    },
    {
      code: 'si',
      name: 'Sinhala',
      nativeName: 'සිංහල',
      flag: '🇱🇰',
      direction: 'ltr'
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇱🇰',
      direction: 'ltr'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      direction: 'ltr'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      direction: 'rtl'
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      direction: 'ltr'
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr'
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      direction: 'ltr'
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      direction: 'ltr'
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      direction: 'ltr'
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      direction: 'ltr'
    }
  ];

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setSelectedLanguage(savedLanguage);

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
  };

  const handleSave = () => {
    localStorage.setItem('preferredLanguage', selectedLanguage);
    
    // Here you would typically update the app's language context
    // For now, we'll just show a success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optionally reload or redirect to apply language changes
      // window.location.reload();
    }, 2000);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
  };

  return (
    <div className="language-container">
      <div className="language-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🌐 Language Settings</h1>
        <p>Choose your preferred language for the platform</p>
      </div>

      {showSuccess && (
        <div className="success-banner">
          ✓ Language preference saved! Changes will take effect on next page load.
        </div>
      )}

      <div className="language-content">
        {/* Current Language */}
        <div className="current-language-section">
          <h2>Current Language</h2>
          <div className="current-language-card">
            <span className="language-flag">{getCurrentLanguage()?.flag}</span>
            <div className="language-info">
              <h3>{getCurrentLanguage()?.name}</h3>
              <p>{getCurrentLanguage()?.nativeName}</p>
            </div>
            <span className="check-icon">✓</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="language-selection-section">
          <h2>Available Languages</h2>
          <p className="section-description">
            Select a language from the list below. The interface will be translated to your 
            chosen language, including buttons, menus, and notifications.
          </p>

          <div className="languages-grid">
            {languages.map((language) => (
              <div
                key={language.code}
                className={`language-card ${selectedLanguage === language.code ? 'selected' : ''}`}
                onClick={() => handleLanguageSelect(language.code)}
              >
                <span className="language-flag">{language.flag}</span>
                <div className="language-details">
                  <h3>{language.name}</h3>
                  <p>{language.nativeName}</p>
                </div>
                {selectedLanguage === language.code && (
                  <span className="selected-icon">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Regional Settings */}
        <div className="regional-settings-section">
          <h2>⚙️ Regional Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Date Format</h4>
                <p>DD/MM/YYYY (Default: Based on language)</p>
              </div>
              <select className="setting-select">
                <option value="auto">Auto (Based on language)</option>
                <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Time Format</h4>
                <p>24-hour or 12-hour format</p>
              </div>
              <select className="setting-select">
                <option value="24">24-hour (14:30)</option>
                <option value="12">12-hour (2:30 PM)</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Timezone</h4>
                <p>Your local timezone</p>
              </div>
              <select className="setting-select">
                <option value="Asia/Colombo">Asia/Colombo (GMT +5:30)</option>
                <option value="UTC">UTC (GMT +0:00)</option>
                <option value="America/New_York">America/New York (GMT -5:00)</option>
                <option value="Europe/London">Europe/London (GMT +0:00)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (GMT +9:00)</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Number Format</h4>
                <p>How numbers are displayed</p>
              </div>
              <select className="setting-select">
                <option value="auto">Auto (Based on language)</option>
                <option value="1,234.56">1,234.56 (Western)</option>
                <option value="1.234,56">1.234,56 (European)</option>
                <option value="1 234,56">1 234,56 (French)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Translation Info */}
        <div className="translation-info-section">
          <div className="info-banner">
            <span className="info-icon">ℹ️</span>
            <div className="info-content">
              <h3>Translation Coverage</h3>
              <p>
                We're continuously working to improve translations for all languages. 
                If you notice any translation errors or have suggestions, please contact 
                our support team. Emergency alerts and critical messages are available in 
                all supported languages.
              </p>
            </div>
          </div>

          <div className="help-translate">
            <h3>🤝 Help Us Translate</h3>
            <p>
              Want to help improve translations for your language? Join our translation 
              community and make the platform more accessible to everyone.
            </p>
            <button className="volunteer-translate-btn">
              Become a Translation Volunteer
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="language-actions">
          <button className="save-language-btn" onClick={handleSave}>
            Save Language Preference
          </button>
        </div>
      </div>
    </div>
  );
};

export default Language;
