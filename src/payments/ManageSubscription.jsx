import { useState } from 'react';

const ManageSubscription = () => {
  const [showOptions, setShowOptions] = useState(false);

  const handleSubscription = () => {
    const link = 'https://billing.stripe.com/p/login/test_5kAbIReKc3QyfFC7ss';
    window.open(link, '_blank');
  };

  const handleFirstButtonClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <button onClick={handleFirstButtonClick}>Hantera medlemskap</button>
      {showOptions && (
        <div>
          <p>
            På den här sidan kan du hantera din prenumeration, pausa eller säga
            upp själva prenumerationen. Du hittar dina kvitton och kan byta
            betalsätt.{' '}
          </p>
          <button onClick={handleSubscription}>Hantera prenumeration</button>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
