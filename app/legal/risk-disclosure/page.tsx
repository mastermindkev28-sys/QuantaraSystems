import type { Metadata } from 'next';
import LegalPage from '../../components/LegalPage';

export const metadata: Metadata = { title: 'Risk disclosure' };

export default function Page() {
  return (
    <LegalPage
      title="Risk disclosure"
      updated="November 4, 2026"
      intro="Please read this disclosure carefully before engaging with Quantara Systems or relying on any information on this website."
      sections={[
        { h: 'Futures trading involves substantial risk', p: [
          'Trading futures contracts, including COMEX gold futures, involves substantial risk of loss and is not suitable for every person. Futures are leveraged instruments: a small market movement can produce a loss that is large relative to the capital committed, and losses can exceed the amount initially deposited in some account types.',
          'You should carefully consider whether trading is appropriate for you in light of your experience, objectives, financial resources and other relevant circumstances. Only capital you can afford to lose should be used.',
        ]},
        { h: 'No guarantee of results', p: [
          'Quantara Systems does not guarantee profits, any particular level of performance, or freedom from loss. Automated and rules-based trading reduces certain sources of human error, but it does not remove market risk. Systematic approaches can and do experience losing trades, losing days and extended periods of drawdown.',
        ]},
        { h: 'Past and illustrative performance', p: [
          'Past performance, whether actual or indicated by historical tests, is not indicative of future results. Any chart, example or sequence on this website that is described as illustrative is provided only to explain how QS1 operates and does not represent an actual trade or the results of any account.',
          'Hypothetical or simulated performance results have inherent limitations. Unlike an actual performance record, simulated results do not represent actual trading, may under- or over-compensate for the impact of market factors such as liquidity, and are designed with the benefit of hindsight.',
        ]},
        { h: 'Technology and operational risk', p: [
          'Automated trading depends on software, data feeds, internet connectivity, broker and exchange systems, and hosting infrastructure. Failures, delays or errors in any of these can result in missed, delayed, duplicated or erroneous orders, or in positions that cannot be managed as intended. Monitoring and safeguards reduce, but cannot eliminate, these risks.',
        ]},
        { h: 'Third-party firms and platforms', p: [
          'QS1 may operate on accounts held with, or connect through, third-party proprietary trading firms and execution platforms. Those firms set their own rules, fees, evaluation criteria and payout terms, which may change and over which Quantara Systems has no control. Accounts may be suspended or closed by those firms in accordance with their terms.',
          'References to third-party names or trademarks indicate compatibility only and do not imply affiliation, endorsement or sponsorship.',
        ]},
        { h: 'Not investment advice', p: [
          'Nothing on this website constitutes investment, financial, legal or tax advice, a recommendation, or an offer or solicitation to buy or sell any financial instrument. You should obtain independent professional advice before making any financial decision.',
        ]},
      ]}
    />
  );
}
