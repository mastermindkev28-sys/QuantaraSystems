import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function Page() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="November 4, 2026"
      intro="This policy explains what personal information Quantara Systems collects through this website, how it is used and the choices you have."
      sections={[
        { h: 'Information we collect', p: [
          'When you request a consultation, we collect the details you provide: your name, email address and, if you choose to share them, your phone number, country of residence, trading experience, how you heard about us and any notes you add.',
          'Like most websites, our hosting provider automatically records basic technical information such as IP address, browser type and pages visited, for security and to keep the site running reliably.',
        ]},
        { h: 'How we use it', p: [
          'We use the information you provide to arrange, prepare for and follow up on your consultation, and to respond to your questions. We do not sell your personal information.',
        ]},
        { h: 'Scheduling and service providers', p: [
          'Consultations are scheduled through Calendly. When you continue to scheduling, the details you entered are passed to Calendly so the booking form is pre-filled, and Calendly processes them under its own privacy policy. We also rely on providers for website hosting and email. Each receives only the information needed to perform its service.',
        ]},
        { h: 'Cookies', p: [
          'This website does not use advertising cookies. The embedded Calendly scheduler may set cookies needed for it to function. Your browser settings let you block or delete cookies.',
        ]},
        { h: 'Retention and security', p: [
          'We keep consultation information only for as long as needed for the purposes above or as required by law, and we take reasonable measures to protect it. No method of transmission or storage is completely secure.',
        ]},
        { h: 'Your choices', p: [
          'You may ask us to access, correct or delete the personal information we hold about you, or to stop contacting you, by replying to any email from us. Depending on where you live, you may have additional rights under local law.',
        ]},
        { h: 'Changes', p: [
          'We may update this policy from time to time. The date at the top of this page shows when it was last revised.',
        ]},
      ]}
    />
  );
}
