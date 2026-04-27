import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255, 0, 0, 0.1)', borderRadius: '12px', margin: '2rem' }}>
          <h2>Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', color: 'var(--text-secondary, #666)' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children; 
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
