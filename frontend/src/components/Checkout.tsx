// src/components/Checkout.tsx
import React from "react";
import { useSelector } from "react-redux";
import ShippingInfo from "./ShippingInfo";
import PaymentInfo from "./PaymentInfo";
import OrderReview from "./OrderReview";
import { RootState } from "../store";

const Checkout: React.FC = () => {
  const currentStep = useSelector(
    (state: RootState) => state.checkout.currentStep
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ShippingInfo />;
      case 1:
        return <PaymentInfo />;
      case 2:
        return <OrderReview />;
      default:
        return <ShippingInfo />;
    }
  };

  return <div>{renderStep()}</div>;
};

export default Checkout;
