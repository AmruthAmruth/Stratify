import SubscriptionPlans from "../common/SubscriptionPlans";

const AuthenticatedSubscriptionPage: React.FC = () => {
  return <SubscriptionPlans isAuthenticated={true} />;
};

export default AuthenticatedSubscriptionPage;