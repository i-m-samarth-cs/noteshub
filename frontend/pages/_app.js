import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

function ErrorBoundary({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
} 