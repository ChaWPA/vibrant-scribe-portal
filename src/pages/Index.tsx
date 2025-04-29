
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the HTML version
    window.location.href = '/index.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-gray-600">Taking you to the CMS application</p>
      </div>
    </div>
  );
};

export default Index;
