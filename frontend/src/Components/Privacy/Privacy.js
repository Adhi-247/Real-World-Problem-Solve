import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Privacy.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🔒 Privacy & Policy</h1>
        <p className="last-updated">Last Updated: January 25, 2026</p>
      </div>

      <div className="privacy-content">
        {/* Introduction */}
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Sri Lanka Disaster Relief. We are committed to protecting your personal 
            information and your right to privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our disaster management 
            platform.
          </p>
          <p>
            By using our services, you agree to the collection and use of information in 
            accordance with this policy. If you do not agree with our policies and practices, 
            please do not use our services.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
            <li><strong>Profile Information:</strong> Profile picture, location, emergency contacts</li>
            <li><strong>Identification:</strong> Government ID for volunteer verification</li>
          </ul>

          <h3>2.2 Location Data</h3>
          <ul>
            <li>Real-time location for emergency services</li>
            <li>Location history during disaster events</li>
            <li>Area-specific disaster alerts</li>
          </ul>

          <h3>2.3 Usage Information</h3>
          <ul>
            <li>Help requests and responses</li>
            <li>Missing person reports</li>
            <li>Volunteer activities and contributions</li>
            <li>Platform usage patterns and preferences</li>
          </ul>

          <h3>2.4 Technical Information</h3>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Access times and referring URLs</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🚨</div>
              <h4>Emergency Response</h4>
              <p>Coordinate rescue operations and provide timely disaster alerts</p>
            </div>
            <div className="info-card">
              <div className="info-icon">👥</div>
              <h4>Connect People</h4>
              <p>Match help requests with volunteers and resources</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📊</div>
              <h4>Improve Services</h4>
              <p>Analyze data to enhance disaster response efficiency</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h4>Communication</h4>
              <p>Send updates, alerts, and important notifications</p>
            </div>
          </div>
        </section>

        {/* Data Sharing */}
        <section className="privacy-section">
          <h2>4. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          
          <div className="sharing-list">
            <div className="sharing-item">
              <span className="sharing-icon">🏛️</span>
              <div>
                <h4>Government Agencies</h4>
                <p>Emergency services, disaster management authorities, and law enforcement 
                when necessary for public safety</p>
              </div>
            </div>

            <div className="sharing-item">
              <span className="sharing-icon">🤝</span>
              <div>
                <h4>Partner Organizations</h4>
                <p>NGOs, relief organizations, and verified volunteers to coordinate 
                disaster response</p>
              </div>
            </div>

            <div className="sharing-item">
              <span className="sharing-icon">⚖️</span>
              <div>
                <h4>Legal Requirements</h4>
                <p>When required by law or to protect rights, property, or safety</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="privacy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement robust security measures to protect your personal information:
          </p>
          <ul>
            <li>End-to-end encryption for sensitive data</li>
            <li>Secure SSL/TLS connections</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Encrypted data storage</li>
          </ul>
          <div className="security-note">
            <strong>Note:</strong> While we strive to protect your information, no method 
            of transmission over the internet is 100% secure. We cannot guarantee absolute 
            security.
          </div>
        </section>

        {/* Your Rights */}
        <section className="privacy-section">
          <h2>6. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <div className="rights-grid">
            <div className="right-item">
              <span className="right-icon">👁️</span>
              <h4>Access</h4>
              <p>View your personal data</p>
            </div>
            <div className="right-item">
              <span className="right-icon">✏️</span>
              <h4>Correct</h4>
              <p>Update incorrect information</p>
            </div>
            <div className="right-item">
              <span className="right-icon">🗑️</span>
              <h4>Delete</h4>
              <p>Request data deletion</p>
            </div>
            <div className="right-item">
              <span className="right-icon">📥</span>
              <h4>Export</h4>
              <p>Download your data</p>
            </div>
            <div className="right-item">
              <span className="right-icon">🚫</span>
              <h4>Restrict</h4>
              <p>Limit data processing</p>
            </div>
            <div className="right-item">
              <span className="right-icon">❌</span>
              <h4>Opt-out</h4>
              <p>Unsubscribe from communications</p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="privacy-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information only as long as necessary for the purposes 
            outlined in this policy:
          </p>
          <ul>
            <li><strong>Active Accounts:</strong> Data retained while account is active</li>
            <li><strong>Emergency Records:</strong> Retained for 3 years for historical analysis</li>
            <li><strong>Legal Obligations:</strong> Retained as required by law</li>
            <li><strong>Deleted Accounts:</strong> Most data deleted within 30 days, some 
            anonymized for statistical purposes</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="privacy-section">
          <h2>8. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Maintain your session and keep you logged in</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze platform usage and performance</li>
            <li>Improve user experience</li>
          </ul>
          <p>
            You can control cookies through your browser settings. Note that disabling 
            cookies may affect platform functionality.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="privacy-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for users under 13 years of age. We do not 
            knowingly collect personal information from children under 13. If you are a 
            parent or guardian and believe your child has provided us with personal 
            information, please contact us.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="privacy-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of 
            any changes by:
          </p>
          <ul>
            <li>Posting the new Privacy Policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending email notifications for significant changes</li>
          </ul>
          <p>
            We encourage you to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Contact */}
        <section className="privacy-section contact-section">
          <h2>11. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email:</strong>
                <p>privacy@sldisasterrelief.lk</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Phone:</strong>
                <p>+94 11 234 5678</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Address:</strong>
                <p>Disaster Management Centre<br/>No. 456, Bauddaloka Mawatha<br/>Colombo 07, Sri Lanka</p>
              </div>
            </div>
          </div>
        </section>

        {/* Consent */}
        <section className="privacy-section consent-section">
          <div className="consent-box">
            <h3>Your Consent</h3>
            <p>
              By using our platform, you consent to our Privacy Policy and agree to its terms. 
              During emergencies, you understand that your information may be shared with 
              emergency services and relief organizations to ensure your safety and the safety 
              of others.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
