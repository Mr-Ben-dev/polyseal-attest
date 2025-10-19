import { motion } from 'framer-motion';
import SEO from '@/ui/SEO';

interface LegalProps {
  kind: 'privacy' | 'terms';
}

export default function Legal({ kind }: LegalProps) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const path = isPrivacy ? '/privacy' : '/terms';

  return (
    <>
      <SEO title={`${title} — Polyseal`} path={path} />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h1 className="mb-8">{title}</h1>
          
          {isPrivacy ? (
            <div className="prose prose-invert max-w-none">
              <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>Introduction</h2>
              <p>
                Polyseal ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
                This privacy policy explains how we collect, use, and safeguard your information when you use our service.
              </p>

              <h2>Information We Collect</h2>
              <h3>Blockchain Data</h3>
              <p>
                When you connect your wallet, we access publicly available blockchain data including your wallet address
                and transaction history. This data is already public on the Polygon blockchain.
              </p>

              <h3>Usage Data</h3>
              <p>
                We collect anonymous usage data including page views, interactions, and errors to improve our service.
                This data is aggregated and cannot be traced back to individual users.
              </p>

              <h2>How We Use Your Information</h2>
              <ul>
                <li>To provide and maintain our service</li>
                <li>To improve user experience and functionality</li>
                <li>To detect and prevent technical issues</li>
                <li>To communicate with you about service updates</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your data. However, no method of transmission
                over the internet is 100% secure. We cannot guarantee absolute security.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We use third-party services including:
              </p>
              <ul>
                <li>Polygon RPC providers for blockchain interactions</li>
                <li>WalletConnect for wallet connections</li>
                <li>Vercel for hosting and serverless functions</li>
              </ul>

              <h2>Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
              </ul>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this privacy policy, please contact us through our contact form.
              </p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

              <h2>Agreement to Terms</h2>
              <p>
                By accessing and using Polyseal, you agree to be bound by these Terms of Service and all applicable
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
              </p>

              <h2>Use License</h2>
              <p>
                Permission is granted to temporarily access Polyseal for personal, non-commercial use only. This is the
                grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul>
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
              </ul>

              <h2>Disclaimer</h2>
              <p>
                The materials on Polyseal are provided on an 'as is' basis. Polyseal makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property.
              </p>

              <h2>Blockchain Interactions</h2>
              <p>
                When you interact with smart contracts through Polyseal:
              </p>
              <ul>
                <li>All transactions are final and cannot be reversed</li>
                <li>You are responsible for transaction fees (gas)</li>
                <li>We are not responsible for lost funds due to user error</li>
                <li>We do not custody your funds or private keys</li>
              </ul>

              <h2>Limitations</h2>
              <p>
                In no event shall Polyseal or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use Polyseal, even if Polyseal or a Polyseal authorized representative has been notified orally or in
                writing of the possibility of such damage.
              </p>

              <h2>Revisions</h2>
              <p>
                Polyseal may revise these terms of service at any time without notice. By using this service you are
                agreeing to be bound by the then current version of these terms of service.
              </p>

              <h2>Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with applicable laws and you
                irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>

              <h2>Contact Information</h2>
              <p>
                Questions about the Terms of Service should be sent to us through our contact form.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
