import React from 'react';
import './styles/Errors.css';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    // Log the error or send it to an error tracking service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI or a custom error message
      return (<div className='error'>
        <img src='/img/broken-car.png'></img>
        <div className='error-header'>Something went wrong...</div>
        <div className='error-header'>Try to reload page...</div>
      </div>);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;