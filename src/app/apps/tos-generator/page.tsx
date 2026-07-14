import type { Metadata } from 'next';
import TosGenerator from './TosGenerator';

export const metadata: Metadata = {
  title: 'TOS Level Script Generator',
  description: 'Paste tickers → thinkScript study drawing support & resistance lines.',
};

export default function Page() {
  return <TosGenerator />;
}
