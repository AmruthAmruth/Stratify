import SubscriptionPlans from "../common/SubscriptionPlans";

const UnauthenticatedSubscriptionPage: React.FC = () => {
  return (
    <SubscriptionPlans 
      isAuthenticated={false} 
      onSuccessRedirect="/login" 
    />
  );
};

export default UnauthenticatedSubscriptionPage;
