import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = { title: 'Terms of use' };

export default function Page() {
  return (
    <LegalPage
      title="Terms of use"
      updated="November 4, 2026"
      intro="These terms govern your use of the Quantara Systems website. By using the site, you agree to them."
      sections={[
        { h: 'Information only', p: [
          'The content of this website is provided for general information. It is not investment, financial, legal or tax advice, and it is not an offer or solicitation to buy or sell any financial instrument or to engage any service. Any engagement with Quantara Systems is governed solely by a separate written agreement.',
        ]},
        { h: 'No reliance', p: [
          'We aim to keep the information on this site accurate and current, but we make no warranty that it is complete, accurate or up to date. Market data is supplied by third parties, may be delayed and is provided for reference only. You should not rely on any content on this site when making a financial decision.',
        ]},
        { h: 'Intellectual property', p: [
          'The Quantara Systems name, the QS1 name, the Q mark and the content of this website are owned by Quantara Systems. Third-party names and logos remain the property of their respective owners and are used only to indicate compatibility.',
        ]},
        { h: 'Acceptable use', p: [
          'You agree not to misuse the website, including by attempting to gain unauthorized access, interfering with its operation, or copying its content for commercial purposes without permission.',
        ]},
        { h: 'Links to other sites', p: [
          'The site may link to third-party websites and services. We are not responsible for their content, policies or practices.',
        ]},
        { h: 'Limitation of liability', p: [
          'To the fullest extent permitted by law, Quantara Systems is not liable for any loss or damage arising from your use of, or inability to use, this website or any information on it.',
        ]},
        { h: 'Changes', p: [
          'We may update these terms at any time. Continued use of the site after changes are posted means you accept the revised terms.',
        ]},
      ]}
    />
  );
}
