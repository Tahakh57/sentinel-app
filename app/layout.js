import './globals.css';
import { Analytics } from '@vercel/analytics/next';
export const metadata = {
  title: 'Sentinel · AI Security Lab',
  description: 'An AI security research workspace with grounded answers and inspectable sources.',
  robots: { index: false, follow: false },
};
export default function Layout({ children }) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
