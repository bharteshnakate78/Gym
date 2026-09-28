import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  CreditCard,
  Crown,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Wallet,
  XCircle,
  ArrowLeft,
  Receipt,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  paymentAPI,
  membershipAPI,
} from "../services/api";

// ============================================================
// RAZORPAY SCRIPT
// ============================================================

const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// ============================================================
// HELPERS
// ============================================================

const getStoredUser = () => {
  try {
    const value =
      localStorage.getItem("user");

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  } catch {
    return null;
  }
};

const formatCurrency = (value) => {
  const amount =
    Number(value) || 0;

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
};

// ============================================================
// PAYMENT COMPONENT
// ============================================================

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useMemo(
    () => getStoredUser(),
    []
  );

  const [plans, setPlans] = useState([]);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [successPaymentId, setSuccessPaymentId] =
    useState("");

  // ==========================================================
  // LOAD MEMBERSHIP PLANS
  // ==========================================================

  useEffect(() => {
    loadPlans();
  }, []);

  // ==========================================================
  // SELECT PLAN FROM LOCATION STATE
  // ==========================================================

  useEffect(() => {
    const statePlan =
      location.state?.plan;

    if (
      statePlan &&
      statePlan.id
    ) {
      setSelectedPlan(statePlan);
    }
  }, [location.state]);

  // ==========================================================
  // LOAD PLANS
  // ==========================================================

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await membershipAPI.getAll();

      const data =
        Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.plans)
              ? response.plans
              : [];

      setPlans(data);

      if (
        !location.state?.plan &&
        data.length > 0
      ) {
        setSelectedPlan(data[0]);
      }

    } catch (err) {
      console.error(
        "LOAD MEMBERSHIP PLANS ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load membership plans."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // SELECT PLAN
  // ==========================================================

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setError("");
    setSuccess(false);
  };

  // ==========================================================
  // PAY NOW
  // ==========================================================

  const handlePayment = async () => {
    if (!selectedPlan) {
      setError(
        "Please select a membership plan."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/payment",
        },
      });

      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess(false);

      // ------------------------------------------------------
      // LOAD RAZORPAY
      // ------------------------------------------------------

      const razorpayLoaded =
        await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection."
        );
      }

      // ------------------------------------------------------
      // CREATE BACKEND ORDER
      // ------------------------------------------------------

      console.log(
        "CREATING PAYMENT ORDER..."
      );

      const order =
        await paymentAPI.createOrder(
          selectedPlan.id
        );

      console.log(
        "CREATE ORDER RESPONSE:",
        order
      );

      if (!order) {
        throw new Error(
          "Empty response from payment server."
        );
      }

      if (order.success === false) {
        throw new Error(
          order.message ||
            "Unable to create payment order."
        );
      }

      if (!order.orderId) {
        console.error(
          "INVALID ORDER RESPONSE:",
          order
        );

        throw new Error(
          "Razorpay order ID was not returned by the server."
        );
      }

      if (!order.keyId) {
        throw new Error(
          "Razorpay key ID was not returned by the server."
        );
      }

      if (!order.amount) {
        throw new Error(
          "Payment amount was not returned by the server."
        );
      }

      // ------------------------------------------------------
      // RAZORPAY AMOUNT
      // ------------------------------------------------------

      const amountInPaise =
        Number(order.amount);

      if (
        !Number.isFinite(
          amountInPaise
        ) ||
        amountInPaise <= 0
      ) {
        throw new Error(
          "Invalid payment amount."
        );
      }

      // ------------------------------------------------------
      // RAZORPAY OPTIONS
      // ------------------------------------------------------

      const options = {
        key: order.keyId,

        amount: amountInPaise,

        currency:
          order.currency || "INR",

        name:
          "Gym Management System",

        description:
          `${selectedPlan.name} Membership`,

        order_id:
          order.orderId,

        image:
          "/favicon.ico",

        prefill: {
          name:
            user?.name || "",

          email:
            user?.email || "",

          contact:
            user?.phone ||
            user?.mobile ||
            "",
        },

        notes: {
          membershipPlanId:
            String(
              selectedPlan.id
            ),

          membershipName:
            selectedPlan.name || "",
        },

        theme: {
          color: "#d4af37",
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },

        handler:
          async function (
            razorpayResponse
          ) {
            try {
              console.log(
                "RAZORPAY SUCCESS:",
                razorpayResponse
              );

              // ------------------------------------------------
              // VERIFY PAYMENT
              // ------------------------------------------------

              const verificationData = {
                membershipPlanId:
                  selectedPlan.id,

                razorpayOrderId:
                  razorpayResponse
                    .razorpay_order_id,

                razorpayPaymentId:
                  razorpayResponse
                    .razorpay_payment_id,

                razorpaySignature:
                  razorpayResponse
                    .razorpay_signature,
              };

              console.log(
                "VERIFYING PAYMENT:",
                verificationData
              );

              const verifyResponse =
                await paymentAPI.verify(
                  verificationData
                );

              console.log(
                "VERIFY RESPONSE:",
                verifyResponse
              );

              if (
                verifyResponse?.success ===
                false
              ) {
                throw new Error(
                  verifyResponse.message ||
                    "Payment verification failed."
                );
              }

              // ------------------------------------------------
              // SUCCESS
              // ------------------------------------------------

              setSuccessPaymentId(
                verifyResponse?.razorpayPaymentId ||
                  razorpayResponse.razorpay_payment_id ||
                  ""
              );

              setSuccess(true);
              setProcessing(false);

            } catch (verifyError) {
              console.error(
                "PAYMENT VERIFICATION ERROR:",
                verifyError
              );

              setProcessing(false);

              setError(
                verifyError?.response
                  ?.data?.message ||
                  verifyError?.message ||
                  "Payment verification failed."
              );
            }
          },
      };

      // ------------------------------------------------------
      // OPEN RAZORPAY
      // ------------------------------------------------------

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setProcessing(false);

          setError(
            response?.error
              ?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();

    } catch (err) {
      console.error(
        "CREATE PAYMENT ORDER ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err?.response?.status
      );

      console.error(
        "BACKEND RESPONSE:",
        err?.response?.data
      );

      setProcessing(false);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.details ||
          err?.message ||
          "Unable to start payment."
      );
    }
  };

  // ==========================================================
  // BACK TO MEMBERSHIPS
  // ==========================================================

  const handleBack = () => {
    navigate(-1);
  };

  // ==========================================================
  // SUCCESS SCREEN
  // ==========================================================

  if (success) {
    return (
      <>
        <div className="payment-page">
          <div className="payment-success-card">

            <div className="success-icon">
              <CheckCircle2 size={72} />
            </div>

            <div className="success-badge">
              <Sparkles size={16} />
              PAYMENT SUCCESSFUL
            </div>

            <h1>
              Welcome to{" "}
              <span>
                {selectedPlan?.name}
              </span>
            </h1>

            <p>
              Your membership payment has
              been successfully received and
              your membership has been
              activated.
            </p>

            {successPaymentId && (
              <div className="success-payment-id">
                <span>
                  Payment ID
                </span>

                <strong>
                  {successPaymentId}
                </strong>
              </div>
            )}

            <div className="success-actions">

              <button
                className="primary-payment-button"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Go to Dashboard
              </button>

              <button
                className="secondary-payment-button"
                onClick={() =>
                  navigate("/membership")
                }
              >
                View Membership
              </button>

            </div>

          </div>
        </div>

        <PaymentStyles />
      </>
    );
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <>
        <div className="payment-loading">
          <Loader2
            size={42}
            className="spin"
          />

          <p>
            Loading membership plans...
          </p>
        </div>

        <PaymentStyles />
      </>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <>
      <div className="payment-page">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="payment-header">

          <button
            className="back-button"
            onClick={handleBack}
          >
            <ArrowLeft size={19} />
            Back
          </button>

          <div className="secure-checkout">
            <Lock size={15} />
            Secure Checkout
          </div>

        </header>

        {/* ====================================================
            TITLE
        ==================================================== */}

        <section className="payment-title">

          <div className="title-icon">
            <Crown size={25} />
          </div>

          <div>
            <span className="eyebrow">
              MEMBERSHIP
            </span>

            <h1>
              Choose Your
              <span> Membership</span>
            </h1>

            <p>
              Upgrade your fitness journey
              with a premium membership.
            </p>
          </div>

        </section>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="payment-error">
            <XCircle size={20} />

            <div>
              <strong>
                Payment Error
              </strong>

              <p>
                {error}
              </p>
            </div>

            <button
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>
          </div>
        )}

        {/* ====================================================
            CONTENT
        ==================================================== */}

        <div className="payment-layout">

          {/* ==================================================
              PLANS
          ================================================== */}

          <section className="plans-section">

            <div className="section-heading">
              <h2>
                Membership Plans
              </h2>

              <span>
                {plans.length} plans
              </span>
            </div>

            <div className="plans-grid">

              {plans.map(
                (plan, index) => {

                  const selected =
                    selectedPlan?.id ===
                    plan.id;

                  const popular =
                    plan.name
                      ?.toLowerCase()
                      .includes(
                        "premium"
                      );

                  const benefits =
                    typeof plan.benefits ===
                    "string"
                      ? plan.benefits
                          .split(",")
                          .map(
                            (item) =>
                              item.trim()
                          )
                          .filter(Boolean)
                      : Array.isArray(
                          plan.benefits
                        )
                        ? plan.benefits
                        : [];

                  return (
                    <button
                      key={
                        plan.id ||
                        index
                      }
                      className={`plan-card ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectPlan(
                          plan
                        )
                      }
                    >

                      {popular && (
                        <div className="popular-ribbon">
                          <Sparkles
                            size={13}
                          />
                          MOST POPULAR
                        </div>
                      )}

                      <div className="plan-top">

                        <div className="plan-icon">
                          <Crown
                            size={22}
                          />
                        </div>

                        {selected && (
                          <CheckCircle2
                            className="selected-check"
                            size={22}
                          />
                        )}

                      </div>

                      <h3>
                        {plan.name}
                      </h3>

                      <p className="plan-description">
                        {plan.description ||
                          "Premium fitness membership."}
                      </p>

                      <div className="plan-price">
                        {formatCurrency(
                          plan.monthlyFee
                        )}

                        <small>
                          / month
                        </small>
                      </div>

                      {benefits.length >
                        0 && (
                        <div className="plan-benefits">

                          {benefits
                            .slice(0, 5)
                            .map(
                              (
                                benefit,
                                benefitIndex
                              ) => (
                                <div
                                  key={
                                    benefitIndex
                                  }
                                >
                                  <CheckCircle2
                                    size={
                                      15
                                    }
                                  />

                                  <span>
                                    {
                                      benefit
                                    }
                                  </span>
                                </div>
                              )
                            )}

                        </div>
                      )}

                    </button>
                  );
                }
              )}

            </div>
          </section>

          {/* ==================================================
              ORDER SUMMARY
          ================================================== */}

          <aside className="payment-summary">

            <div className="summary-card">

              <div className="summary-heading">

                <div className="summary-icon">
                  <Receipt size={20} />
                </div>

                <div>
                  <span>
                    ORDER SUMMARY
                  </span>

                  <h2>
                    Your Membership
                  </h2>
                </div>

              </div>

              {selectedPlan ? (
                <>
                  <div className="summary-plan">

                    <div className="summary-plan-icon">
                      <Crown size={21} />
                    </div>

                    <div>
                      <strong>
                        {selectedPlan.name}
                      </strong>

                      <span>
                        Monthly Membership
                      </span>
                    </div>

                  </div>

                  <div className="summary-line">
                    <span>
                      Membership
                    </span>

                    <strong>
                      {formatCurrency(
                        selectedPlan.monthlyFee
                      )}
                    </strong>
                  </div>

                  <div className="summary-line">
                    <span>
                      Tax
                    </span>

                    <strong>
                      Included
                    </strong>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-total">
                    <span>
                      Total
                    </span>

                    <strong>
                      {formatCurrency(
                        selectedPlan.monthlyFee
                      )}
                    </strong>
                  </div>

                  <button
                    className="pay-button"
                    disabled={
                      processing ||
                      !selectedPlan
                    }
                    onClick={
                      handlePayment
                    }
                  >

                    {processing ? (
                      <>
                        <Loader2
                          size={20}
                          className="spin"
                        />

                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard
                          size={20}
                        />

                        Pay Securely
                      </>
                    )}

                  </button>

                  <div className="secure-note">

                    <ShieldCheck
                      size={16}
                    />

                    <span>
                      Secured by Razorpay
                    </span>

                  </div>

                </>
              ) : (
                <div className="empty-selection">
                  <Wallet size={35} />

                  <p>
                    Select a membership
                    plan to continue.
                  </p>
                </div>
              )}

            </div>

            <div className="trust-box">

              <div>
                <ShieldCheck
                  size={18}
                />

                <span>
                  100% Secure Payment
                </span>
              </div>

              <div>
                <Lock size={18} />

                <span>
                  SSL Encrypted
                </span>
              </div>

              <div>
                <CreditCard
                  size={18}
                />

                <span>
                  Powered by Razorpay
                </span>
              </div>

            </div>

          </aside>

        </div>

      </div>

      <PaymentStyles />
    </>
  );
}

// ============================================================
// CSS
// ============================================================

function PaymentStyles() {
  return (
    <style>{`

      * {
        box-sizing: border-box;
      }

      .payment-page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at top right,
            rgba(212,175,55,.08),
            transparent 30%
          ),
          radial-gradient(
            circle at bottom left,
            rgba(212,175,55,.05),
            transparent 35%
          ),
          #08090c;
        color: #fff;
        padding: 28px 5%;
      }

      .payment-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 55px;
      }

      .back-button {
        border: 1px solid rgba(255,255,255,.1);
        background: rgba(255,255,255,.035);
        color: #ddd;
        border-radius: 12px;
        padding: 11px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: .25s;
      }

      .back-button:hover {
        border-color: rgba(212,175,55,.5);
        color: #d4af37;
        transform: translateX(-2px);
      }

      .secure-checkout {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #9d9d9d;
        font-size: 13px;
      }

      .secure-checkout svg {
        color: #d4af37;
      }

      .payment-title {
        display: flex;
        gap: 18px;
        align-items: center;
        margin: 0 auto 42px;
        max-width: 1250px;
      }

      .title-icon {
        width: 58px;
        height: 58px;
        border-radius: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          linear-gradient(
            145deg,
            rgba(212,175,55,.2),
            rgba(212,175,55,.04)
          );
        border: 1px solid rgba(212,175,55,.3);
        color: #d4af37;
      }

      .eyebrow {
        color: #d4af37;
        letter-spacing: 2px;
        font-size: 11px;
        font-weight: 800;
      }

      .payment-title h1 {
        margin: 4px 0;
        font-size: clamp(30px, 4vw, 46px);
        letter-spacing: -1.5px;
      }

      .payment-title h1 span {
        color: #d4af37;
      }

      .payment-title p {
        color: #898989;
        margin: 7px 0 0;
      }

      .payment-error {
        max-width: 1250px;
        margin: 0 auto 25px;
        display: flex;
        align-items: flex-start;
        gap: 13px;
        padding: 15px 18px;
        border-radius: 14px;
        background: rgba(220,50,50,.08);
        border: 1px solid rgba(220,50,50,.3);
        color: #ff8d8d;
      }

      .payment-error strong {
        color: #fff;
        display: block;
        margin-bottom: 3px;
      }

      .payment-error p {
        margin: 0;
        font-size: 13px;
      }

      .payment-error button {
        margin-left: auto;
        background: none;
        border: none;
        color: #aaa;
        font-size: 22px;
        cursor: pointer;
      }

      .payment-layout {
        max-width: 1250px;
        margin: auto;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 390px;
        gap: 28px;
        align-items: start;
      }

      .section-heading {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
      }

      .section-heading h2 {
        margin: 0;
        font-size: 20px;
      }

      .section-heading span {
        color: #777;
        font-size: 13px;
      }

      .plans-grid {
        display: grid;
        grid-template-columns:
          repeat(
            auto-fit,
            minmax(245px, 1fr)
          );
        gap: 18px;
      }

      .plan-card {
        position: relative;
        text-align: left;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.08);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.055),
            rgba(255,255,255,.018)
          );
        color: #fff;
        border-radius: 20px;
        padding: 24px;
        cursor: pointer;
        transition:
          transform .25s,
          border-color .25s,
          box-shadow .25s;
      }

      .plan-card:hover {
        transform: translateY(-4px);
        border-color: rgba(212,175,55,.4);
      }

      .plan-card.selected {
        border-color: #d4af37;
        box-shadow:
          0 0 0 1px rgba(212,175,55,.15),
          0 20px 60px rgba(212,175,55,.08);
      }

      .popular-ribbon {
        position: absolute;
        right: 12px;
        top: 12px;
        display: flex;
        align-items: center;
        gap: 5px;
        color: #d4af37;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: .7px;
      }

      .plan-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .plan-icon {
        width: 45px;
        height: 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 14px;
        background: rgba(212,175,55,.1);
        color: #d4af37;
      }

      .selected-check {
        color: #d4af37;
      }

      .plan-card h3 {
        margin: 22px 0 7px;
        font-size: 23px;
      }

      .plan-description {
        color: #808080;
        line-height: 1.6;
        min-height: 44px;
        font-size: 13px;
        margin: 0;
      }

      .plan-price {
        margin-top: 21px;
        font-size: 29px;
        font-weight: 800;
      }

      .plan-price small {
        font-size: 12px;
        font-weight: 400;
        color: #777;
      }

      .plan-benefits {
        border-top: 1px solid rgba(255,255,255,.07);
        margin-top: 20px;
        padding-top: 16px;
      }

      .plan-benefits div {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        color: #aaa;
        font-size: 12px;
        margin-bottom: 9px;
      }

      .plan-benefits svg {
        color: #d4af37;
        flex-shrink: 0;
      }

      .payment-summary {
        position: sticky;
        top: 25px;
      }

      .summary-card {
        border: 1px solid rgba(212,175,55,.2);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.06),
            rgba(255,255,255,.025)
          );
        border-radius: 22px;
        padding: 25px;
        box-shadow:
          0 25px 80px rgba(0,0,0,.3);
      }

      .summary-heading {
        display: flex;
        gap: 12px;
        align-items: center;
        padding-bottom: 21px;
        border-bottom: 1px solid rgba(255,255,255,.08);
      }

      .summary-icon {
        width: 43px;
        height: 43px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(212,175,55,.1);
        color: #d4af37;
      }

      .summary-heading span {
        font-size: 9px;
        letter-spacing: 1.5px;
        color: #777;
      }

      .summary-heading h2 {
        margin: 3px 0 0;
        font-size: 17px;
      }

      .summary-plan {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: 22px 0;
      }

      .summary-plan-icon {
        width: 43px;
        height: 43px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #d4af37;
        color: #090909;
      }

      .summary-plan strong,
      .summary-plan span {
        display: block;
      }

      .summary-plan strong {
        font-size: 15px;
      }

      .summary-plan span {
        color: #777;
        font-size: 11px;
        margin-top: 4px;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        color: #888;
        font-size: 13px;
        margin: 15px 0;
      }

      .summary-line strong {
        color: #ddd;
      }

      .summary-divider {
        height: 1px;
        background: rgba(255,255,255,.08);
        margin: 20px 0;
      }

      .summary-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 22px;
      }

      .summary-total span {
        color: #aaa;
      }

      .summary-total strong {
        color: #d4af37;
        font-size: 26px;
      }

      .pay-button {
        width: 100%;
        border: none;
        border-radius: 13px;
        padding: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 9px;
        background:
          linear-gradient(
            135deg,
            #e4c45b,
            #b89121
          );
        color: #090909;
        font-weight: 900;
        cursor: pointer;
        transition: .25s;
      }

      .pay-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow:
          0 12px 30px rgba(212,175,55,.22);
      }

      .pay-button:disabled {
        opacity: .6;
        cursor: not-allowed;
      }

      .secure-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        color: #666;
        font-size: 11px;
        margin-top: 15px;
      }

      .secure-note svg {
        color: #d4af37;
      }

      .trust-box {
        margin-top: 15px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 15px;
        padding: 15px;
      }

      .trust-box div {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #777;
        font-size: 11px;
        margin: 8px 0;
      }

      .trust-box svg {
        color: #d4af37;
      }

      .payment-loading {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #08090c;
        color: #aaa;
      }

      .payment-loading svg {
        color: #d4af37;
      }

      .payment-loading p {
        margin-top: 15px;
      }

      .spin {
        animation: paymentSpin 1s linear infinite;
      }

      @keyframes paymentSpin {
        to {
          transform: rotate(360deg);
        }
      }

      .payment-success-card {
        width: min(650px, 92%);
        margin: 8vh auto;
        text-align: center;
        border: 1px solid rgba(212,175,55,.25);
        background:
          linear-gradient(
            145deg,
            rgba(255,255,255,.06),
            rgba(255,255,255,.02)
          );
        border-radius: 28px;
        padding: 55px 35px;
        box-shadow:
          0 30px 100px rgba(0,0,0,.4);
      }

      .success-icon {
        width: 100px;
        height: 100px;
        margin: 0 auto 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(56,180,100,.1);
        color: #52d273;
        border: 1px solid rgba(82,210,115,.25);
      }

      .success-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #d4af37;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.5px;
      }

      .payment-success-card h1 {
        font-size: 34px;
        margin: 18px 0 10px;
      }

      .payment-success-card h1 span {
        color: #d4af37;
      }

      .payment-success-card > p {
        color: #888;
        line-height: 1.7;
        max-width: 500px;
        margin: auto;
      }

      .success-payment-id {
        display: inline-flex;
        flex-direction: column;
        gap: 5px;
        margin: 25px auto;
        padding: 13px 18px;
        border-radius: 12px;
        background: rgba(255,255,255,.04);
      }

      .success-payment-id span {
        color: #666;
        font-size: 10px;
        text-transform: uppercase;
      }

      .success-payment-id strong {
        color: #d4af37;
        font-size: 12px;
      }

      .success-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 15px;
      }

      .primary-payment-button,
      .secondary-payment-button {
        padding: 13px 20px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
      }

      .primary-payment-button {
        border: none;
        background: #d4af37;
        color: #090909;
      }

      .secondary-payment-button {
        border: 1px solid rgba(255,255,255,.1);
        background: transparent;
        color: #ccc;
      }

      .empty-selection {
        text-align: center;
        color: #666;
        padding: 45px 10px;
      }

      .empty-selection svg {
        color: #d4af37;
        margin-bottom: 10px;
      }

      @media (max-width: 950px) {
        .payment-layout {
          grid-template-columns: 1fr;
        }

        .payment-summary {
          position: static;
        }
      }

      @media (max-width: 600px) {
        .payment-page {
          padding: 20px 15px;
        }

        .payment-header {
          margin-bottom: 35px;
        }

        .payment-title {
          align-items: flex-start;
        }

        .title-icon {
          width: 48px;
          height: 48px;
        }

        .success-actions {
          flex-direction: column;
        }
      }

    `}</style>
  );
}

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import {
//   ArrowLeft,
//   CheckCircle2,
//   CreditCard,
//   ShieldCheck,
//   Loader2,
//   Crown,
//   AlertCircle,
//   Lock,
// } from "lucide-react";

// import { paymentAPI } from "../services/api";

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const membership = location.state?.membership;

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   // ============================================================
//   // LOAD USER
//   // ============================================================

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");

//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       }
//     } catch (err) {
//       console.error("Unable to read stored user:", err);
//     }
//   }, []);

//   // ============================================================
//   // VALIDATE MEMBERSHIP
//   // ============================================================

//   useEffect(() => {
//     if (!membership) {
//       setError(
//         "No membership plan selected. Please select a membership first.",
//       );
//     }
//   }, [membership]);

//   // ============================================================
//   // FORMAT CURRENCY
//   // ============================================================

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(Number(amount || 0));
//   };

//   // ============================================================
//   // LOAD RAZORPAY SCRIPT
//   // ============================================================

//   const loadRazorpay = () => {
//     return new Promise((resolve, reject) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }

//       const existingScript = document.querySelector(
//         'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
//       );

//       if (existingScript) {
//         existingScript.addEventListener("load", () => resolve(true));
//         existingScript.addEventListener("error", () =>
//           reject(new Error("Unable to load Razorpay Checkout.")),
//         );
//         return;
//       }

//       const script = document.createElement("script");

//       script.src = "https://checkout.razorpay.com/v1/checkout.js";

//       script.async = true;

//       script.onload = () => resolve(true);

//       script.onerror = () =>
//         reject(new Error("Unable to load Razorpay Checkout."));

//       document.body.appendChild(script);
//     });
//   };

//   // ============================================================
//   // PAY NOW
//   // ============================================================

//   const handlePayment = async () => {
//     setError("");

//     // ----------------------------------------------------------
//     // TOKEN CHECK
//     // ----------------------------------------------------------

//     const token = localStorage.getItem("token");

//     if (!token) {
//       setError("Your session has expired. Please login again.");

//       navigate("/login", {
//         state: {
//           from: "/payment",
//         },
//       });

//       return;
//     }

//     // ----------------------------------------------------------
//     // USER CHECK
//     // ----------------------------------------------------------

//     if (!user) {
//       setError("User information is not available. Please login again.");
//       return;
//     }

//     // ----------------------------------------------------------
//     // MEMBERSHIP CHECK
//     // ----------------------------------------------------------

//     if (!membership) {
//       setError("Please select a membership plan first.");
//       return;
//     }

//     const membershipPlanId = Number(membership.id);

//     if (!Number.isInteger(membershipPlanId) || membershipPlanId <= 0) {
//       console.error("INVALID MEMBERSHIP ID:", membership.id);

//       setError("Invalid membership plan.");
//       return;
//     }

//     const monthlyFee = Number(membership.monthlyFee);

//     if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
//       console.error("INVALID MEMBERSHIP PRICE:", membership.monthlyFee);

//       setError("Invalid membership price.");
//       return;
//     }

//     try {
//       setLoading(true);

//       console.log("======================================");

//       console.log("START RAZORPAY PAYMENT");

//       console.log("USER:", user);

//       console.log("MEMBERSHIP PLAN ID:", membershipPlanId);

//       console.log("MEMBERSHIP:", membership);

//       console.log("MONTHLY FEE:", monthlyFee);

//       console.log("======================================");

//       // ========================================================
//       // STEP 1
//       // CREATE RAZORPAY ORDER
//       // ========================================================

//       /*
//        * IMPORTANT:
//        *
//        * paymentAPI.createOrder() already returns response.data
//        *
//        * Therefore DO NOT use:
//        *
//        * response.data
//        */

//       const order = await paymentAPI.createOrder(membershipPlanId);

//       console.log("======================================");

//       console.log("CREATE ORDER RESPONSE:");

//       console.log(order);

//       console.log("======================================");

//       // --------------------------------------------------------
//       // CHECK EMPTY RESPONSE
//       // --------------------------------------------------------

//       if (!order) {
//         throw new Error("Backend returned an empty payment response.");
//       }

//       // --------------------------------------------------------
//       // BACKEND ERROR RESPONSE
//       // --------------------------------------------------------

//       if (order.success === false) {
//         throw new Error(
//           order.message || order.details || "Unable to create payment order.",
//         );
//       }

//       // ========================================================
//       // ORDER DATA
//       // ========================================================

//       const orderId = order.orderId;

//       const keyId = order.keyId;

//       const amount = Number(order.amount);

//       const currency = order.currency || "INR";

//       // --------------------------------------------------------
//       // VALIDATE ORDER ID
//       // --------------------------------------------------------

//       if (!orderId) {
//         console.error("INVALID ORDER RESPONSE:", order);

//         throw new Error("Razorpay order ID was not returned by the server.");
//       }

//       // --------------------------------------------------------
//       // VALIDATE KEY
//       // --------------------------------------------------------

//       if (!keyId) {
//         console.error("INVALID ORDER RESPONSE:", order);

//         throw new Error("Razorpay key ID was not returned by the server.");
//       }

//       // --------------------------------------------------------
//       // VALIDATE AMOUNT
//       // --------------------------------------------------------

//       if (!Number.isFinite(amount) || amount <= 0) {
//         console.error("INVALID RAZORPAY AMOUNT:", order.amount);

//         throw new Error("Invalid payment amount returned by the server.");
//       }

//       /*
//        * Backend CreateOrderResponse normally returns amount
//        * in INR, for example:
//        *
//        * 1499
//        *
//        * Razorpay Checkout requires paise:
//        *
//        * 149900
//        */

//       const amountInPaise = Math.round(amount * 100);

//       if (amountInPaise <= 0) {
//         throw new Error("Invalid Razorpay payment amount.");
//       }

//       console.log("ORDER ID:", orderId);

//       console.log("KEY ID:", keyId);

//       console.log("AMOUNT INR:", amount);

//       console.log("AMOUNT PAISE:", amountInPaise);

//       console.log("CURRENCY:", currency);

//       // ========================================================
//       // STEP 2
//       // LOAD RAZORPAY
//       // ========================================================

//       await loadRazorpay();

//       if (!window.Razorpay) {
//         throw new Error("Razorpay Checkout is not available.");
//       }

//       console.log("RAZORPAY CHECKOUT LOADED");

//       // ========================================================
//       // STEP 3
//       // RAZORPAY OPTIONS
//       // ========================================================

//       const options = {
//         key: keyId,

//         amount: amountInPaise,

//         currency: currency,

//         name: "Gym Fitness Club",

//         description: `${membership.name} Membership`,

//         order_id: orderId,

//         prefill: {
//           name: user.name || user.fullName || "",

//           email: user.email || "",

//           contact: user.phone || user.mobile || "",
//         },

//         notes: {
//           membershipPlanId: String(membershipPlanId),

//           membershipName: membership.name || "",

//           userId: String(user.id || user.userId || ""),
//         },

//         theme: {
//           color: "#d4af37",
//         },

//         modal: {
//           escape: true,

//           backdropclose: false,

//           ondismiss: () => {
//             console.log("RAZORPAY CHECKOUT CLOSED");

//             setLoading(false);
//           },
//         },

//         // ======================================================
//         // PAYMENT SUCCESS
//         // ======================================================

//         handler: async function (razorpayResponse) {
//           console.log("======================================");

//           console.log("RAZORPAY PAYMENT SUCCESS");

//           console.log("RAZORPAY RESPONSE:", razorpayResponse);

//           console.log("======================================");

//           try {
//             setLoading(true);
//             setError("");

//             // --------------------------------------------------
//             // VALIDATE RAZORPAY RESPONSE
//             // --------------------------------------------------

//             if (!razorpayResponse?.razorpay_order_id) {
//               throw new Error("Razorpay order ID is missing.");
//             }

//             if (!razorpayResponse?.razorpay_payment_id) {
//               throw new Error("Razorpay payment ID is missing.");
//             }

//             if (!razorpayResponse?.razorpay_signature) {
//               throw new Error("Razorpay payment signature is missing.");
//             }

//             // ==================================================
//             // STEP 4
//             // VERIFY PAYMENT
//             // ==================================================

//             const verificationData = {
//               membershipPlanId: membershipPlanId,

//               razorpayOrderId: razorpayResponse.razorpay_order_id,

//               razorpayPaymentId: razorpayResponse.razorpay_payment_id,

//               razorpaySignature: razorpayResponse.razorpay_signature,
//             };

//             console.log("VERIFY REQUEST:", verificationData);

//             /*
//              * paymentAPI.verify() also returns response.data
//              *
//              * Therefore use the returned object directly.
//              */

//             const verifyResponse = await paymentAPI.verify(verificationData);

//             console.log("======================================");

//             console.log("VERIFY RESPONSE:", verifyResponse);

//             console.log("======================================");

//             if (!verifyResponse) {
//               throw new Error(
//                 "Backend returned an empty verification response.",
//               );
//             }

//             if (verifyResponse.success === false) {
//               throw new Error(
//                 verifyResponse.message || "Payment verification failed.",
//               );
//             }

//             // ==================================================
//             // SUCCESS
//             // ==================================================

//             console.log("PAYMENT VERIFIED SUCCESSFULLY");

//             setSuccess(true);

//             setLoading(false);

//             setTimeout(() => {
//               navigate("/dashboard", {
//                 replace: true,
//               });
//             }, 1800);
//           } catch (verifyError) {
//             console.error("======================================");

//             console.error("PAYMENT VERIFICATION ERROR");

//             console.error("STATUS:", verifyError?.response?.status);

//             console.error("BACKEND RESPONSE:", verifyError?.response?.data);

//             console.error("MESSAGE:", verifyError?.message);

//             console.error("======================================");

//             const backendMessage = verifyError?.response?.data?.message;

//             const backendDetails = verifyError?.response?.data?.details;

//             const backendError = verifyError?.response?.data?.error;

//             setError(
//               backendMessage ||
//                 backendDetails ||
//                 backendError ||
//                 verifyError?.message ||
//                 "Payment verification failed.",
//             );

//             setLoading(false);
//           }
//         },
//       };

//       // ========================================================
//       // STEP 5
//       // CREATE RAZORPAY INSTANCE
//       // ========================================================

//       console.log("CREATING RAZORPAY INSTANCE");

//       const razorpay = new window.Razorpay(options);

//       // ========================================================
//       // PAYMENT FAILED
//       // ========================================================

//       razorpay.on("payment.failed", function (response) {
//         console.error("======================================");

//         console.error("RAZORPAY PAYMENT FAILED");

//         console.error("RESPONSE:", response);

//         console.error("======================================");

//         const reason =
//           response?.error?.description ||
//           response?.error?.reason ||
//           "Payment failed. Please try again.";

//         setError(reason);

//         setLoading(false);
//       });

//       // ========================================================
//       // OPEN CHECKOUT
//       // ========================================================

//       console.log("OPENING RAZORPAY CHECKOUT");

//       razorpay.open();
//     } catch (paymentError) {
//       console.error("======================================");

//       console.error("CREATE PAYMENT ORDER ERROR");

//       console.error("ERROR OBJECT:", paymentError);

//       console.error("STATUS:", paymentError?.response?.status);

//       console.error("BACKEND RESPONSE:", paymentError?.response?.data);

//       console.error("ERROR MESSAGE:", paymentError?.message);

//       console.error("======================================");

//       const backendMessage = paymentError?.response?.data?.message;

//       const backendDetails = paymentError?.response?.data?.details;

//       const backendError = paymentError?.response?.data?.error;

//       setError(
//         backendMessage ||
//           backendDetails ||
//           backendError ||
//           paymentError?.message ||
//           "Unable to create Razorpay payment order.",
//       );

//       setLoading(false);
//     }
//   };

//   // ============================================================
//   // NO MEMBERSHIP
//   // ============================================================

//   if (!membership) {
//     return (
//       <div className="payment-page">
//         <div className="payment-error-card">
//           <AlertCircle size={48} />

//           <h2>Membership Not Selected</h2>

//           <p>Please select a membership plan before continuing to payment.</p>

//           <button
//             className="payment-back-button"
//             onClick={() => navigate("/memberships")}
//           >
//             <ArrowLeft size={18} />
//             Back to Memberships
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // SUCCESS SCREEN
//   // ============================================================

//   if (success) {
//     return (
//       <div className="payment-page">
//         <div className="payment-success-card">
//           <div className="success-icon">
//             <CheckCircle2 size={64} />
//           </div>

//           <h1>Payment Successful</h1>

//           <p>
//             Your <strong>{membership.name}</strong> membership has been
//             activated successfully.
//           </p>

//           <div className="success-loading">
//             <Loader2 size={18} className="spin" />
//             Redirecting to dashboard...
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // MAIN PAGE
//   // ============================================================

//   return (
//     <div className="payment-page">
//       {/* HEADER */}

//       <header className="payment-header">
//         <button className="back-button" onClick={() => navigate(-1)}>
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         <div className="secure-label">
//           <ShieldCheck size={18} />
//           Secure Checkout
//         </div>
//       </header>

//       {/* CONTENT */}

//       <main className="payment-container">
//         <div className="payment-title">
//           <div className="title-icon">
//             <Crown size={28} />
//           </div>

//           <div>
//             <h1>Complete Your Membership</h1>

//             <p>Secure your gym membership with Razorpay.</p>
//           </div>
//         </div>

//         <div className="payment-grid">
//           {/* MEMBERSHIP CARD */}

//           <section className="membership-summary">
//             <div className="card-label">YOUR MEMBERSHIP</div>

//             <div className="membership-name">
//               <div className="membership-icon">
//                 <Crown size={25} />
//               </div>

//               <div>
//                 <h2>{membership.name}</h2>

//                 <span>Monthly Membership</span>
//               </div>
//             </div>

//             {membership.description && (
//               <p className="membership-description">{membership.description}</p>
//             )}

//             {Array.isArray(membership.benefits) &&
//               membership.benefits.length > 0 && (
//                 <div className="benefits">
//                   <h3>Membership Benefits</h3>

//                   {membership.benefits.map((benefit, index) => (
//                     <div className="benefit" key={index}>
//                       <CheckCircle2 size={17} />

//                       <span>{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//           </section>

//           {/* PAYMENT CARD */}

//           <section className="payment-card">
//             <div className="card-label">PAYMENT SUMMARY</div>

//             <div className="price-row">
//               <span>Membership</span>

//               <strong>{formatCurrency(membership.monthlyFee)}</strong>
//             </div>

//             <div className="price-row">
//               <span>Billing</span>

//               <span>Monthly</span>
//             </div>

//             <div className="divider" />

//             <div className="total-row">
//               <span>Total</span>

//               <strong>{formatCurrency(membership.monthlyFee)}</strong>
//             </div>

//             {/* ERROR */}

//             {error && (
//               <div className="payment-error">
//                 <AlertCircle size={19} />

//                 <div>{error}</div>
//               </div>
//             )}

//             {/* PAY BUTTON */}

//             <button
//               className="pay-button"
//               onClick={handlePayment}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={21} className="spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CreditCard size={21} />
//                   Pay {formatCurrency(membership.monthlyFee)}
//                 </>
//               )}
//             </button>

//             <div className="secure-payment">
//               <Lock size={15} />

//               <span>Secured by Razorpay</span>
//             </div>

//             <div className="payment-info">
//               <ShieldCheck size={18} />

//               <div>
//                 <strong>Safe & Secure Payment</strong>

//                 <p>
//                   Your payment information is securely processed by Razorpay.
//                 </p>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       <style>{`
//         .payment-page {
//           min-height: 100vh;
//           background:
//             radial-gradient(
//               circle at 10% 10%,
//               rgba(212, 175, 55, 0.08),
//               transparent 35%
//             ),
//             radial-gradient(
//               circle at 90% 80%,
//               rgba(139, 92, 246, 0.08),
//               transparent 35%
//             ),
//             #08090d;
//           color: #ffffff;
//           padding-bottom: 60px;
//         }

//         .payment-header {
//           height: 78px;
//           padding: 0 7%;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//           background: rgba(8, 9, 13, 0.88);
//           backdrop-filter: blur(18px);
//         }

//         .back-button,
//         .payment-back-button {
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           background: rgba(255, 255, 255, 0.04);
//           color: #ffffff;
//           padding: 11px 17px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           cursor: pointer;
//           transition: 0.25s ease;
//         }

//         .back-button:hover,
//         .payment-back-button:hover {
//           background: rgba(255, 255, 255, 0.08);
//           transform: translateY(-1px);
//         }

//         .secure-label {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: #d4af37;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .payment-container {
//           width: min(1180px, 92%);
//           margin: 0 auto;
//           padding-top: 55px;
//         }

//         .payment-title {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           margin-bottom: 38px;
//         }

//         .title-icon {
//           width: 58px;
//           height: 58px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           border-radius: 16px;
//           color: #d4af37;
//           background: linear-gradient(
//             145deg,
//             rgba(212, 175, 55, 0.2),
//             rgba(212, 175, 55, 0.05)
//           );
//           border: 1px solid rgba(212, 175, 55, 0.25);
//         }

//         .payment-title h1 {
//           margin: 0;
//           font-size: clamp(28px, 4vw, 42px);
//           letter-spacing: -1px;
//         }

//         .payment-title p {
//           margin: 7px 0 0;
//           color: #9699a4;
//           font-size: 15px;
//         }

//         .payment-grid {
//           display: grid;
//           grid-template-columns:
//             minmax(0, 1.15fr)
//             minmax(380px, 0.85fr);
//           gap: 28px;
//           align-items: start;
//         }

//         .membership-summary,
//         .payment-card {
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           background: linear-gradient(
//             145deg,
//             rgba(255, 255, 255, 0.065),
//             rgba(255, 255, 255, 0.025)
//           );
//           box-shadow:
//             0 30px 70px
//             rgba(0, 0, 0, 0.3);
//           border-radius: 24px;
//           padding: 32px;
//           backdrop-filter: blur(20px);
//         }

//         .card-label {
//           color: #777b88;
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 1.7px;
//           margin-bottom: 25px;
//         }

//         .membership-name {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           margin-bottom: 25px;
//         }

//         .membership-icon {
//           width: 56px;
//           height: 56px;
//           border-radius: 15px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #08090d;
//           background: linear-gradient(
//             135deg,
//             #f5d76e,
//             #c99821
//           );
//           box-shadow:
//             0 10px 30px
//             rgba(212, 175, 55, 0.18);
//         }

//         .membership-name h2 {
//           margin: 0;
//           font-size: 25px;
//         }

//         .membership-name span {
//           display: block;
//           margin-top: 4px;
//           color: #898d98;
//           font-size: 13px;
//         }

//         .membership-description {
//           color: #a7aab4;
//           line-height: 1.7;
//           font-size: 14px;
//           padding-bottom: 25px;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .benefits {
//           padding-top: 25px;
//         }

//         .benefits h3 {
//           margin: 0 0 18px;
//           font-size: 15px;
//         }

//         .benefit {
//           display: flex;
//           align-items: flex-start;
//           gap: 11px;
//           margin-bottom: 13px;
//           color: #c4c6ce;
//           font-size: 14px;
//         }

//         .benefit svg {
//           flex-shrink: 0;
//           color: #d4af37;
//           margin-top: 1px;
//         }

//         .price-row {
//           display: flex;
//           justify-content: space-between;
//           color: #9699a4;
//           font-size: 14px;
//           padding: 9px 0;
//         }

//         .price-row strong {
//           color: #ffffff;
//         }

//         .divider {
//           height: 1px;
//           background: rgba(255, 255, 255, 0.09);
//           margin: 18px 0;
//         }

//         .total-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           margin-bottom: 25px;
//         }

//         .total-row span {
//           color: #ffffff;
//           font-size: 17px;
//           font-weight: 600;
//         }

//         .total-row strong {
//           color: #d4af37;
//           font-size: 30px;
//         }

//         .payment-error {
//           display: flex;
//           gap: 10px;
//           align-items: flex-start;
//           padding: 13px 15px;
//           margin-bottom: 16px;
//           border-radius: 12px;
//           border: 1px solid rgba(239, 68, 68, 0.25);
//           background: rgba(239, 68, 68, 0.08);
//           color: #ff9c9c;
//           font-size: 13px;
//           line-height: 1.5;
//         }

//         .payment-error svg {
//           flex-shrink: 0;
//         }

//         .pay-button {
//           width: 100%;
//           min-height: 56px;
//           border: 0;
//           border-radius: 14px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           cursor: pointer;
//           color: #090a0d;
//           font-size: 15px;
//           font-weight: 800;
//           background: linear-gradient(
//             135deg,
//             #f5d76e,
//             #d4af37,
//             #b9891d
//           );
//           box-shadow:
//             0 15px 35px
//             rgba(212, 175, 55, 0.16);
//           transition: 0.25s ease;
//         }

//         .pay-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow:
//             0 20px 45px
//             rgba(212, 175, 55, 0.25);
//         }

//         .pay-button:disabled {
//           opacity: 0.65;
//           cursor: not-allowed;
//         }

//         .secure-payment {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 7px;
//           color: #777b88;
//           font-size: 12px;
//           margin-top: 14px;
//         }

//         .secure-payment svg {
//           color: #55c98b;
//         }

//         .payment-info {
//           display: flex;
//           gap: 12px;
//           margin-top: 25px;
//           padding: 17px;
//           border-radius: 14px;
//           background: rgba(255, 255, 255, 0.035);
//           border: 1px solid rgba(255, 255, 255, 0.06);
//         }

//         .payment-info svg {
//           flex-shrink: 0;
//           color: #55c98b;
//         }

//         .payment-info strong {
//           display: block;
//           font-size: 13px;
//           margin-bottom: 5px;
//         }

//         .payment-info p {
//           margin: 0;
//           color: #777b88;
//           font-size: 12px;
//           line-height: 1.5;
//         }

//         .payment-success-card,
//         .payment-error-card {
//           width: min(520px, 90%);
//           margin: 12vh auto 0;
//           text-align: center;
//           padding: 50px 35px;
//           border-radius: 26px;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           background: linear-gradient(
//             145deg,
//             rgba(255, 255, 255, 0.07),
//             rgba(255, 255, 255, 0.025)
//           );
//           box-shadow:
//             0 30px 80px
//             rgba(0, 0, 0, 0.35);
//         }

//         .success-icon {
//           width: 90px;
//           height: 90px;
//           margin: 0 auto 25px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #55c98b;
//           background: rgba(85, 201, 139, 0.1);
//           border: 1px solid rgba(85, 201, 139, 0.2);
//         }

//         .payment-success-card h1,
//         .payment-error-card h2 {
//           margin: 0 0 12px;
//         }

//         .payment-success-card p,
//         .payment-error-card p {
//           color: #9296a2;
//           line-height: 1.7;
//         }

//         .success-loading {
//           margin-top: 25px;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 8px;
//           color: #d4af37;
//           font-size: 13px;
//         }

//         .payment-error-card > svg {
//           color: #ff7373;
//           margin-bottom: 20px;
//         }

//         .spin {
//           animation:
//             payment-spin
//             0.9s
//             linear
//             infinite;
//         }

//         @keyframes payment-spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         @media (max-width: 850px) {
//           .payment-header {
//             padding: 0 5%;
//           }

//           .payment-container {
//             padding-top: 35px;
//           }

//           .payment-grid {
//             grid-template-columns: 1fr;
//           }

//           .payment-title h1 {
//             font-size: 28px;
//           }
//         }

//         @media (max-width: 520px) {
//           .payment-header {
//             height: 68px;
//           }

//           .secure-label {
//             display: none;
//           }

//           .membership-summary,
//           .payment-card {
//             padding: 23px;
//             border-radius: 19px;
//           }

//           .payment-title {
//             align-items: flex-start;
//           }

//           .title-icon {
//             width: 48px;
//             height: 48px;
//           }

//           .total-row strong {
//             font-size: 25px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Payment;

// // // import React, { useEffect, useState } from "react";

// // // import { useLocation, useNavigate } from "react-router-dom";

// // // import {
// // //   ArrowLeft,
// // //   CheckCircle2,
// // //   CreditCard,
// // //   Lock,
// // //   Loader2,
// // //   ShieldCheck,
// // //   Sparkles,
// // // } from "lucide-react";

// // // import { paymentAPI } from "../services/api";

// // // const Payment = () => {
// // //   const navigate = useNavigate();

// // //   const location = useLocation();

// // //   // ============================================================
// // //   // STATE
// // //   // ============================================================

// // //   const [membership, setMembership] = useState(null);

// // //   const [loading, setLoading] = useState(false);

// // //   const [success, setSuccess] = useState(false);

// // //   const [error, setError] = useState("");

// // //   // ============================================================
// // //   // LOAD MEMBERSHIP
// // //   // ============================================================

// // //   useEffect(() => {
// // //     const selectedMembership = location.state?.membership;

// // //     console.log("PAYMENT PAGE MEMBERSHIP:", selectedMembership);

// // //     if (!selectedMembership) {
// // //       navigate("/memberships", {
// // //         replace: true,
// // //       });

// // //       return;
// // //     }

// // //     setMembership(selectedMembership);
// // //   }, [location.state, navigate]);

// // //   // ============================================================
// // //   // LOAD RAZORPAY SCRIPT IF NEEDED
// // //   // ============================================================

// // //   const loadRazorpay = () => {
// // //     return new Promise((resolve, reject) => {
// // //       if (window.Razorpay) {
// // //         resolve(true);

// // //         return;
// // //       }

// // //       const existingScript = document.querySelector(
// // //         'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
// // //       );

// // //       if (existingScript) {
// // //         existingScript.addEventListener("load", () => resolve(true));

// // //         existingScript.addEventListener("error", () =>
// // //           reject(new Error("Unable to load Razorpay Checkout.")),
// // //         );

// // //         return;
// // //       }

// // //       const script = document.createElement("script");

// // //       script.src = "https://checkout.razorpay.com/v1/checkout.js";

// // //       script.async = true;

// // //       script.onload = () => resolve(true);

// // //       script.onerror = () =>
// // //         reject(new Error("Unable to load Razorpay Checkout."));

// // //       document.body.appendChild(script);
// // //     });
// // //   };

// // //   // ============================================================
// // //   // PAY NOW
// // //   // ============================================================

// // //   const handlePayment = async () => {
// // //     if (!membership?.id) {
// // //       setError("Membership information is missing.");

// // //       return;
// // //     }

// // //     const token = localStorage.getItem("token");

// // //     if (!token) {
// // //       setError("Please login before making a payment.");

// // //       navigate("/login", {
// // //         state: {
// // //           from: "/payment",
// // //         },
// // //       });

// // //       return;
// // //     }

// // //     try {
// // //       setLoading(true);

// // //       setError("");

// // //       // ======================================================
// // //       // USER
// // //       // ======================================================

// // //       let user = {};

// // //       try {
// // //         user = JSON.parse(localStorage.getItem("user") || "{}");
// // //       } catch (e) {
// // //         console.warn("Unable to parse user.");
// // //       }

// // //       console.log("======================================");

// // //       console.log("START RAZORPAY PAYMENT");

// // //       console.log("USER:", user);

// // //       console.log("MEMBERSHIP:", membership);

// // //       console.log("PLAN ID:", membership.id);

// // //       console.log("AMOUNT:", membership.monthlyFee);

// // //       console.log("======================================");

// // //       // ======================================================
// // //       // STEP 1
// // //       // CREATE ORDER
// // //       // ======================================================

// // //       const orderResponse = await paymentAPI.createOrder(membership.id);

// // //       console.log("CREATE ORDER RESPONSE:", orderResponse.data);

// // //       const order = orderResponse.data;

// // //       if (!order) {
// // //         throw new Error("Empty response from payment server.");
// // //       }

// // //       if (order.success === false) {
// // //         throw new Error(order.message || "Unable to create payment order.");
// // //       }

// // //       if (!order.orderId) {
// // //         throw new Error("Razorpay order ID was not returned.");
// // //       }

// // //       if (!order.keyId) {
// // //         throw new Error("Razorpay key ID was not returned.");
// // //       }

// // //       if (!order.amount) {
// // //         throw new Error("Razorpay amount was not returned.");
// // //       }

// // //       // ======================================================
// // //       // STEP 2
// // //       // LOAD RAZORPAY
// // //       // ======================================================

// // //       await loadRazorpay();

// // //       if (!window.Razorpay) {
// // //         throw new Error("Razorpay Checkout is not available.");
// // //       }

// // //       // ======================================================
// // //       // STEP 3
// // //       // CHECK AMOUNT
// // //       // ======================================================

// // //       const amountInPaise = Number(order.amount) * 100;

// // //       console.log("RAZORPAY AMOUNT:", amountInPaise);

// // //       // ======================================================
// // //       // STEP 4
// // //       // RAZORPAY OPTIONS
// // //       // ======================================================

// // //       const options = {
// // //         key: order.keyId,

// // //         amount: amountInPaise,

// // //         currency: order.currency || "INR",

// // //         name: "Gym Management System",

// // //         description: `${membership.name} Membership`,

// // //         order_id: order.orderId,

// // //         prefill: {
// // //           name: user?.name || "",

// // //           email: user?.email || "",

// // //           contact: user?.mobile || user?.phone || "",
// // //         },

// // //         notes: {
// // //           membershipPlanId: String(membership.id),

// // //           membershipName: membership.name || "",
// // //         },

// // //         theme: {
// // //           color: "#e50914",
// // //         },

// // //         modal: {
// // //           escape: true,

// // //           backdropclose: false,

// // //           ondismiss: () => {
// // //             console.log("RAZORPAY CHECKOUT CLOSED");

// // //             setLoading(false);
// // //           },
// // //         },

// // //         // ====================================================
// // //         // PAYMENT SUCCESS
// // //         // ====================================================

// // //         handler: async function (razorpayResponse) {
// // //           console.log("======================================");

// // //           console.log("RAZORPAY PAYMENT SUCCESS");

// // //           console.log("RESPONSE:", razorpayResponse);

// // //           console.log("======================================");

// // //           try {
// // //             setLoading(true);

// // //             setError("");

// // //             // ==================================================
// // //             // VERIFY PAYMENT
// // //             // ==================================================

// // //             const verificationData = {
// // //               membershipPlanId: membership.id,

// // //               razorpayOrderId: razorpayResponse.razorpay_order_id,

// // //               razorpayPaymentId: razorpayResponse.razorpay_payment_id,

// // //               razorpaySignature: razorpayResponse.razorpay_signature,
// // //             };

// // //             console.log("VERIFY REQUEST:", verificationData);

// // //             const verifyResponse = await paymentAPI.verify(verificationData);

// // //             console.log("VERIFY RESPONSE:", verifyResponse.data);

// // //             if (verifyResponse.data?.success === false) {
// // //               throw new Error(
// // //                 verifyResponse.data.message || "Payment verification failed.",
// // //               );
// // //             }

// // //             // ==================================================
// // //             // SUCCESS
// // //             // ==================================================

// // //             setSuccess(true);

// // //             setLoading(false);

// // //             setTimeout(() => {
// // //               navigate("/dashboard", {
// // //                 replace: true,
// // //               });
// // //             }, 1800);
// // //           } catch (verifyError) {
// // //             console.error("PAYMENT VERIFICATION ERROR:", verifyError);

// // //             console.error("BACKEND RESPONSE:", verifyError?.response?.data);

// // //             const message =
// // //               verifyError?.response?.data?.message ||
// // //               verifyError?.response?.data?.error ||
// // //               verifyError?.message ||
// // //               "Payment verification failed.";

// // //             setError(message);

// // //             setLoading(false);
// // //           }
// // //         },
// // //       };

// // //       // ======================================================
// // //       // PAYMENT FAILED
// // //       // ======================================================

// // //       const razorpay = new window.Razorpay(options);

// // //       razorpay.on("payment.failed", function (response) {
// // //         console.error("======================================");

// // //         console.error("RAZORPAY PAYMENT FAILED");

// // //         console.error(response);

// // //         console.error("======================================");

// // //         const reason =
// // //           response?.error?.description ||
// // //           response?.error?.reason ||
// // //           "Payment failed. Please try again.";

// // //         setError(reason);

// // //         setLoading(false);
// // //       });

// // //       console.log("OPENING RAZORPAY CHECKOUT");

// // //       razorpay.open();
// // //     } catch (paymentError) {
// // //       console.error("======================================");

// // //       console.error("CREATE PAYMENT ORDER ERROR");

// // //       console.error("STATUS:", paymentError?.response?.status);

// // //       console.error("BACKEND RESPONSE:", paymentError?.response?.data);

// // //       console.error("MESSAGE:", paymentError?.message);

// // //       console.error("======================================");

// // //       const message =
// // //         paymentError?.response?.data?.message ||
// // //         paymentError?.response?.data?.details ||
// // //         paymentError?.response?.data?.error ||
// // //         paymentError?.message ||
// // //         "Unable to create payment order.";

// // //       setError(message);

// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ============================================================
// // //   // NO MEMBERSHIP
// // //   // ============================================================

// // //   if (!membership) {
// // //     return (
// // //       <div className="payment-page">
// // //         <div className="payment-error-card">
// // //           <CreditCard size={48} />

// // //           <h2>Membership Not Selected</h2>

// // //           <p>Please select a membership plan before continuing to payment.</p>

// // //           <button
// // //             className="payment-back-button"
// // //             onClick={() => navigate("/memberships")}
// // //           >
// // //             <ArrowLeft size={18} />
// // //             Back to Memberships
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ============================================================
// // //   // SUCCESS
// // //   // ============================================================

// // //   if (success) {
// // //     return (
// // //       <div className="payment-page">
// // //         <div className="payment-success-card">
// // //           <div className="success-icon">
// // //             <CheckCircle2 size={64} />
// // //           </div>

// // //           <h1>Payment Successful</h1>

// // //           <p>
// // //             Your <strong>{membership.name}</strong> membership has been
// // //             activated.
// // //           </p>

// // //           <div className="success-loading">
// // //             <Loader2 size={18} className="spin" />
// // //             Redirecting to dashboard...
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ============================================================
// // //   // PAGE
// // //   // ============================================================

// // //   const price = Number(membership.monthlyFee || 0);

// // //   const benefits = Array.isArray(membership.benefits)
// // //     ? membership.benefits
// // //     : [];

// // //   return (
// // //     <div className="payment-page">
// // //       {/* BACKGROUND */}

// // //       <div className="payment-background">
// // //         <div className="payment-grid" />

// // //         <div className="payment-glow glow-one" />

// // //         <div className="payment-glow glow-two" />
// // //       </div>

// // //       {/* HEADER */}

// // //       <header className="payment-header">
// // //         <button
// // //           className="back-button"
// // //           onClick={() => navigate("/memberships")}
// // //         >
// // //           <ArrowLeft size={18} />
// // //           Back
// // //         </button>

// // //         <div className="secure-badge">
// // //           <ShieldCheck size={17} />
// // //           Secure Payment
// // //         </div>
// // //       </header>

// // //       {/* CONTENT */}

// // //       <main className="payment-container">
// // //         <div className="payment-title">
// // //           <div className="title-icon">
// // //             <Sparkles size={25} />
// // //           </div>

// // //           <div>
// // //             <span>MEMBERSHIP CHECKOUT</span>

// // //             <h1>Complete your membership</h1>

// // //             <p>Securely pay through Razorpay.</p>
// // //           </div>
// // //         </div>

// // //         {/* ERROR */}

// // //         {error && (
// // //           <div className="payment-alert">
// // //             <strong>Payment Error</strong>

// // //             <span>{error}</span>
// // //           </div>
// // //         )}

// // //         <div className="payment-grid-layout">
// // //           {/* MEMBERSHIP */}

// // //           <section className="membership-summary">
// // //             <div className="summary-label">SELECTED PLAN</div>

// // //             <h2>{membership.name}</h2>

// // //             {membership.description && (
// // //               <p className="membership-description">{membership.description}</p>
// // //             )}

// // //             <div className="price-box">
// // //               <span>Monthly Membership</span>

// // //               <strong>₹{price.toLocaleString("en-IN")}</strong>

// // //               <small>per month</small>
// // //             </div>

// // //             {benefits.length > 0 && (
// // //               <div className="benefits">
// // //                 <h3>What's included</h3>

// // //                 {benefits.map((benefit, index) => (
// // //                   <div className="benefit" key={index}>
// // //                     <CheckCircle2 size={18} />

// // //                     <span>{benefit}</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </section>

// // //           {/* PAYMENT */}

// // //           <section className="payment-card">
// // //             <div className="card-header">
// // //               <div className="card-icon">
// // //                 <CreditCard size={23} />
// // //               </div>

// // //               <div>
// // //                 <h2>Payment</h2>

// // //                 <p>Razorpay Secure Checkout</p>
// // //               </div>
// // //             </div>

// // //             <div className="secure-info">
// // //               <Lock size={17} />

// // //               <span>Your payment is securely processed by Razorpay.</span>
// // //             </div>

// // //             <div className="total-row">
// // //               <span>Total</span>

// // //               <strong>₹{price.toLocaleString("en-IN")}</strong>
// // //             </div>

// // //             <button
// // //               className="pay-button"
// // //               onClick={handlePayment}
// // //               disabled={loading}
// // //             >
// // //               {loading ? (
// // //                 <>
// // //                   <Loader2 size={20} className="spin" />
// // //                   Processing...
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <Lock size={19} />
// // //                   Pay ₹{price.toLocaleString("en-IN")}
// // //                 </>
// // //               )}
// // //             </button>

// // //             <p className="payment-note">
// // //               By continuing, you agree to the membership terms and payment
// // //               conditions.
// // //             </p>

// // //             <div className="payment-trust">
// // //               <ShieldCheck size={16} />

// // //               <span>Secure Razorpay payment</span>
// // //             </div>
// // //           </section>
// // //         </div>
// // //       </main>
// // //       <style>{`
// // // /* ============================================================
// // //    PAYMENT PAGE
// // // ============================================================ */

// // // .payment-page {
// // //   min-height: 100vh;
// // //   position: relative;
// // //   overflow: hidden;
// // //   background: #070709;
// // //   color: #ffffff;
// // // }

// // // /* ============================================================
// // //    BACKGROUND
// // // ============================================================ */

// // // .payment-background {
// // //   position: fixed;
// // //   inset: 0;
// // //   pointer-events: none;
// // //   overflow: hidden;
// // // }

// // // .payment-grid {
// // //   position: absolute;
// // //   inset: 0;

// // //   background-image:
// // //     linear-gradient(
// // //       rgba(255, 255, 255, 0.025) 1px,
// // //       transparent 1px
// // //     ),
// // //     linear-gradient(
// // //       90deg,
// // //       rgba(255, 255, 255, 0.025) 1px,
// // //       transparent 1px
// // //     );

// // //   background-size: 60px 60px;
// // // }

// // // .payment-glow {
// // //   position: absolute;
// // //   width: 500px;
// // //   height: 500px;

// // //   border-radius: 50%;

// // //   filter: blur(100px);

// // //   opacity: 0.14;
// // // }

// // // .glow-one {
// // //   top: -250px;
// // //   left: -180px;
// // //   background: #e50914;
// // // }

// // // .glow-two {
// // //   right: -200px;
// // //   bottom: -300px;
// // //   background: #e50914;
// // // }

// // // /* ============================================================
// // //    HEADER
// // // ============================================================ */

// // // .payment-header {
// // //   height: 76px;

// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: space-between;

// // //   padding: 0 6%;

// // //   position: relative;
// // //   z-index: 5;

// // //   border-bottom:
// // //     1px solid
// // //     rgba(255, 255, 255, 0.08);

// // //   background:
// // //     rgba(7, 7, 9, 0.75);

// // //   backdrop-filter: blur(20px);
// // // }

// // // .back-button {
// // //   border: 0;
// // //   background: transparent;

// // //   color: #b9b9c0;

// // //   display: flex;
// // //   align-items: center;
// // //   gap: 9px;

// // //   cursor: pointer;

// // //   font-size: 14px;
// // //   font-weight: 600;

// // //   transition: 0.2s ease;
// // // }

// // // .back-button:hover {
// // //   color: #ffffff;
// // // }

// // // .secure-badge {
// // //   display: flex;
// // //   align-items: center;
// // //   gap: 8px;

// // //   color: #8ee6a4;

// // //   font-size: 13px;
// // //   font-weight: 600;
// // // }

// // // /* ============================================================
// // //    CONTAINER
// // // ============================================================ */

// // // .payment-container {
// // //   max-width: 1180px;

// // //   margin: auto;

// // //   padding:
// // //     65px 25px 90px;

// // //   position: relative;
// // //   z-index: 2;
// // // }

// // // /* ============================================================
// // //    TITLE
// // // ============================================================ */

// // // .payment-title {
// // //   display: flex;
// // //   align-items: center;
// // //   gap: 20px;

// // //   margin-bottom: 42px;
// // // }

// // // .title-icon {
// // //   width: 58px;
// // //   height: 58px;

// // //   border-radius: 17px;

// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: center;

// // //   background:
// // //     linear-gradient(
// // //       135deg,
// // //       #e50914,
// // //       #8d050b
// // //     );

// // //   box-shadow:
// // //     0 12px 35px
// // //     rgba(229, 9, 20, 0.25);
// // // }

// // // .payment-title span {
// // //   color: #e50914;

// // //   font-size: 12px;
// // //   font-weight: 800;

// // //   letter-spacing: 2px;
// // // }

// // // .payment-title h1 {
// // //   margin: 5px 0;

// // //   font-size: 38px;
// // //   line-height: 1.15;

// // //   letter-spacing: -1px;
// // // }

// // // .payment-title p {
// // //   margin: 0;

// // //   color: #898991;

// // //   font-size: 15px;
// // // }

// // // /* ============================================================
// // //    ALERT
// // // ============================================================ */

// // // .payment-alert {
// // //   display: flex;
// // //   flex-direction: column;
// // //   gap: 5px;

// // //   margin-bottom: 25px;

// // //   padding: 17px 20px;

// // //   border-radius: 13px;

// // //   background:
// // //     rgba(229, 9, 20, 0.10);

// // //   border:
// // //     1px solid
// // //     rgba(229, 9, 20, 0.35);

// // //   color: #ffb5b8;
// // // }

// // // .payment-alert strong {
// // //   color: #ff7378;
// // // }

// // // /* ============================================================
// // //    TWO COLUMN LAYOUT
// // // ============================================================ */

// // // .payment-grid-layout {
// // //   display: grid;

// // //   grid-template-columns:
// // //     minmax(0, 1fr)
// // //     minmax(0, 0.9fr);

// // //   gap: 25px;
// // // }

// // // /* ============================================================
// // //    MEMBERSHIP SUMMARY
// // // ============================================================ */

// // // .membership-summary,
// // // .payment-card {
// // //   border-radius: 24px;

// // //   border:
// // //     1px solid
// // //     rgba(255, 255, 255, 0.09);

// // //   background:
// // //     linear-gradient(
// // //       145deg,
// // //       rgba(255, 255, 255, 0.055),
// // //       rgba(255, 255, 255, 0.018)
// // //     );

// // //   box-shadow:
// // //     0 25px 70px
// // //     rgba(0, 0, 0, 0.3);
// // // }

// // // .membership-summary {
// // //   padding: 34px;
// // // }

// // // .summary-label {
// // //   color: #777780;

// // //   font-size: 11px;

// // //   letter-spacing: 2px;

// // //   font-weight: 800;

// // //   margin-bottom: 12px;
// // // }

// // // .membership-summary h2 {
// // //   margin: 0;

// // //   font-size: 31px;
// // // }

// // // .membership-description {
// // //   color: #92929b;

// // //   line-height: 1.65;

// // //   margin-top: 12px;
// // // }

// // // /* ============================================================
// // //    PRICE
// // // ============================================================ */

// // // .price-box {
// // //   margin-top: 28px;

// // //   padding: 23px;

// // //   border-radius: 18px;

// // //   background:
// // //     rgba(229, 9, 20, 0.07);

// // //   border:
// // //     1px solid
// // //     rgba(229, 9, 20, 0.18);
// // // }

// // // .price-box span {
// // //   display: block;

// // //   color: #878790;

// // //   font-size: 13px;
// // // }

// // // .price-box strong {
// // //   display: inline-block;

// // //   margin-top: 8px;

// // //   font-size: 36px;
// // // }

// // // .price-box small {
// // //   color: #777780;

// // //   margin-left: 8px;
// // // }

// // // /* ============================================================
// // //    BENEFITS
// // // ============================================================ */

// // // .benefits {
// // //   margin-top: 32px;
// // // }

// // // .benefits h3 {
// // //   margin: 0 0 17px;

// // //   font-size: 15px;
// // // }

// // // .benefit {
// // //   display: flex;
// // //   align-items: center;

// // //   gap: 10px;

// // //   padding: 10px 0;

// // //   color: #bdbdc5;

// // //   font-size: 14px;
// // // }

// // // .benefit svg {
// // //   color: #e50914;

// // //   flex-shrink: 0;
// // // }

// // // /* ============================================================
// // //    PAYMENT CARD
// // // ============================================================ */

// // // .payment-card {
// // //   padding: 34px;

// // //   align-self: start;
// // // }

// // // .card-header {
// // //   display: flex;
// // //   align-items: center;

// // //   gap: 14px;
// // // }

// // // .card-icon {
// // //   width: 46px;
// // //   height: 46px;

// // //   border-radius: 14px;

// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: center;

// // //   background:
// // //     rgba(229, 9, 20, 0.13);

// // //   color: #ff555e;
// // // }

// // // .card-header h2 {
// // //   margin: 0;

// // //   font-size: 21px;
// // // }

// // // .card-header p {
// // //   margin: 4px 0 0;

// // //   color: #777780;

// // //   font-size: 13px;
// // // }

// // // /* ============================================================
// // //    SECURITY
// // // ============================================================ */

// // // .secure-info {
// // //   display: flex;
// // //   align-items: center;

// // //   gap: 9px;

// // //   margin-top: 27px;

// // //   padding: 14px 15px;

// // //   border-radius: 12px;

// // //   background:
// // //     rgba(142, 230, 164, 0.05);

// // //   border:
// // //     1px solid
// // //     rgba(142, 230, 164, 0.12);

// // //   color: #8ee6a4;

// // //   font-size: 12px;
// // // }

// // // /* ============================================================
// // //    TOTAL
// // // ============================================================ */

// // // .total-row {
// // //   display: flex;

// // //   align-items: center;
// // //   justify-content: space-between;

// // //   margin-top: 28px;

// // //   padding-top: 24px;

// // //   border-top:
// // //     1px solid
// // //     rgba(255, 255, 255, 0.08);
// // // }

// // // .total-row span {
// // //   color: #8b8b93;
// // // }

// // // .total-row strong {
// // //   font-size: 30px;
// // // }

// // // /* ============================================================
// // //    PAY BUTTON
// // // ============================================================ */

// // // .pay-button {
// // //   width: 100%;

// // //   margin-top: 25px;

// // //   min-height: 56px;

// // //   border: 0;

// // //   border-radius: 15px;

// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: center;

// // //   gap: 10px;

// // //   background:
// // //     linear-gradient(
// // //       135deg,
// // //       #e50914,
// // //       #b20710
// // //     );

// // //   color: #ffffff;

// // //   font-size: 15px;
// // //   font-weight: 800;

// // //   cursor: pointer;

// // //   box-shadow:
// // //     0 14px 35px
// // //     rgba(229, 9, 20, 0.22);

// // //   transition:
// // //     transform 0.2s ease,
// // //     box-shadow 0.2s ease;
// // // }

// // // .pay-button:hover:not(:disabled) {
// // //   transform: translateY(-2px);

// // //   box-shadow:
// // //     0 18px 42px
// // //     rgba(229, 9, 20, 0.32);
// // // }

// // // .pay-button:disabled {
// // //   opacity: 0.6;

// // //   cursor: not-allowed;
// // // }

// // // /* ============================================================
// // //    NOTE
// // // ============================================================ */

// // // .payment-note {
// // //   color: #66666e;

// // //   text-align: center;

// // //   font-size: 11px;

// // //   line-height: 1.6;

// // //   margin:
// // //     17px 0 0;
// // // }

// // // /* ============================================================
// // //    TRUST
// // // ============================================================ */

// // // .payment-trust {
// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: center;

// // //   gap: 7px;

// // //   margin-top: 19px;

// // //   color: #6d6d76;

// // //   font-size: 11px;
// // // }

// // // /* ============================================================
// // //    SUCCESS
// // // ============================================================ */

// // // .payment-success-card,
// // // .payment-error-card {
// // //   position: relative;
// // //   z-index: 3;

// // //   min-height: 430px;

// // //   width: min(
// // //     550px,
// // //     calc(100% - 40px)
// // //   );

// // //   margin: 100px auto;

// // //   padding: 50px 35px;

// // //   border-radius: 25px;

// // //   display: flex;
// // //   flex-direction: column;
// // //   align-items: center;
// // //   justify-content: center;

// // //   text-align: center;

// // //   background:
// // //     linear-gradient(
// // //       145deg,
// // //       rgba(255, 255, 255, 0.055),
// // //       rgba(255, 255, 255, 0.015)
// // //     );

// // //   border:
// // //     1px solid
// // //     rgba(255, 255, 255, 0.09);

// // //   box-shadow:
// // //     0 30px 90px
// // //     rgba(0, 0, 0, 0.4);
// // // }

// // // .success-icon {
// // //   width: 100px;
// // //   height: 100px;

// // //   border-radius: 50%;

// // //   display: flex;
// // //   align-items: center;
// // //   justify-content: center;

// // //   color: #7ff0a0;

// // //   background:
// // //     rgba(127, 240, 160, 0.08);

// // //   border:
// // //     1px solid
// // //     rgba(127, 240, 160, 0.25);

// // //   margin-bottom: 25px;
// // // }

// // // .payment-success-card h1 {
// // //   margin: 0;

// // //   font-size: 31px;
// // // }

// // // .payment-success-card p {
// // //   color: #8e8e96;

// // //   line-height: 1.6;

// // //   margin-top: 12px;
// // // }

// // // .success-loading {
// // //   margin-top: 30px;

// // //   color: #8b8b93;

// // //   display: flex;
// // //   align-items: center;

// // //   gap: 8px;

// // //   font-size: 13px;
// // // }

// // // /* ============================================================
// // //    ERROR
// // // ============================================================ */

// // // .payment-error-card svg {
// // //   color: #ff7378;

// // //   margin-bottom: 20px;
// // // }

// // // .payment-error-card h2 {
// // //   margin: 0;
// // // }

// // // .payment-error-card p {
// // //   color: #8d8d95;

// // //   line-height: 1.6;

// // //   max-width: 400px;
// // // }

// // // .payment-back-button {
// // //   margin-top: 20px;

// // //   border: 0;

// // //   border-radius: 12px;

// // //   padding: 13px 19px;

// // //   background: #e50914;

// // //   color: white;

// // //   cursor: pointer;

// // //   display: flex;
// // //   align-items: center;

// // //   gap: 8px;

// // //   font-weight: 700;
// // // }

// // // /* ============================================================
// // //    SPINNER
// // // ============================================================ */

// // // .spin {
// // //   animation:
// // //     payment-spin
// // //     0.9s
// // //     linear
// // //     infinite;
// // // }

// // // @keyframes payment-spin {

// // //   to {
// // //     transform: rotate(360deg);
// // //   }
// // // }

// // // /* ============================================================
// // //    RESPONSIVE
// // // ============================================================ */

// // // @media (max-width: 850px) {

// // //   .payment-grid-layout {
// // //     grid-template-columns: 1fr;
// // //   }

// // //   .payment-title h1 {
// // //     font-size: 30px;
// // //   }
// // // }

// // // @media (max-width: 520px) {

// // //   .payment-header {
// // //     height: 68px;

// // //     padding: 0 20px;
// // //   }

// // //   .secure-badge {
// // //     display: none;
// // //   }

// // //   .payment-container {
// // //     padding:
// // //       40px 17px 70px;
// // //   }

// // //   .payment-title {
// // //     align-items: flex-start;
// // //   }

// // //   .title-icon {
// // //     width: 48px;
// // //     height: 48px;
// // //   }

// // //   .payment-title h1 {
// // //     font-size: 25px;
// // //   }

// // //   .membership-summary,
// // //   .payment-card {
// // //     padding: 23px;

// // //     border-radius: 19px;
// // //   }

// // //   .price-box strong {
// // //     font-size: 30px;
// // //   }

// // //   .total-row strong {
// // //     font-size: 25px;
// // //   }
// // // }
// // // `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default Payment;

// // import React, { useEffect, useState } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";

// // import {
// //   ArrowLeft,
// //   CheckCircle2,
// //   CreditCard,
// //   ShieldCheck,
// //   Loader2,
// //   Crown,
// //   AlertCircle,
// //   Lock,
// // } from "lucide-react";

// // import { paymentAPI } from "../services/api";

// // const Payment = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();

// //   const membership = location.state?.membership;

// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState(false);

// //   // ============================================================
// //   // LOAD USER
// //   // ============================================================

// //   useEffect(() => {
// //     try {
// //       const storedUser = localStorage.getItem("user");

// //       if (storedUser) {
// //         const parsedUser = JSON.parse(storedUser);
// //         setUser(parsedUser);
// //       }
// //     } catch (err) {
// //       console.error("Unable to read stored user:", err);
// //     }
// //   }, []);

// //   // ============================================================
// //   // VALIDATE MEMBERSHIP
// //   // ============================================================

// //   useEffect(() => {
// //     if (!membership) {
// //       setError(
// //         "No membership plan selected. Please select a membership first.",
// //       );
// //     }
// //   }, [membership]);

// //   // ============================================================
// //   // FORMAT CURRENCY
// //   // ============================================================

// //   const formatCurrency = (amount) => {
// //     return new Intl.NumberFormat("en-IN", {
// //       style: "currency",
// //       currency: "INR",
// //       maximumFractionDigits: 0,
// //     }).format(Number(amount || 0));
// //   };

// //   // ============================================================
// //   // PAY NOW
// //   // ============================================================

// //   const handlePayment = async () => {
// //     setError("");

// //     // ----------------------------------------------------------
// //     // TOKEN CHECK
// //     // ----------------------------------------------------------

// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       setError("Your session has expired. Please login again.");
// //       return;
// //     }

// //     // ----------------------------------------------------------
// //     // USER CHECK
// //     // ----------------------------------------------------------

// //     if (!user) {
// //       setError("User information is not available. Please login again.");
// //       return;
// //     }

// //     // ----------------------------------------------------------
// //     // MEMBERSHIP CHECK
// //     // ----------------------------------------------------------

// //     if (!membership) {
// //       setError("Please select a membership plan first.");
// //       return;
// //     }

// //     const membershipPlanId = Number(membership.id);

// //     if (!Number.isInteger(membershipPlanId) || membershipPlanId <= 0) {
// //       console.error("INVALID MEMBERSHIP ID:", membership.id);

// //       setError("Invalid membership plan.");
// //       return;
// //     }

// //     const monthlyFee = Number(membership.monthlyFee);

// //     if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
// //       console.error("INVALID MEMBERSHIP PRICE:", membership.monthlyFee);

// //       setError("Invalid membership price.");
// //       return;
// //     }

// //     // ----------------------------------------------------------
// //     // RAZORPAY SCRIPT CHECK
// //     // ----------------------------------------------------------

// //     if (!window.Razorpay) {
// //       setError("Razorpay Checkout is not loaded. Please refresh the page.");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       console.log("======================================");
// //       console.log("START PAYMENT");
// //       console.log("USER:", user);
// //       console.log("MEMBERSHIP PLAN ID:", membershipPlanId);
// //       console.log("MEMBERSHIP:", membership);
// //       console.log("MONTHLY FEE:", monthlyFee);
// //       console.log("======================================");

// //       // ========================================================
// //       // STEP 1 - CREATE RAZORPAY ORDER
// //       // ========================================================

// //       const response = await paymentAPI.createOrder(membershipPlanId);

// //       console.log("======================================");
// //       console.log("CREATE ORDER RESPONSE");
// //       console.log(response.data);
// //       console.log("======================================");

// //       const order = response.data;

// //       if (!order) {
// //         throw new Error("Backend returned an empty payment response.");
// //       }

// //       const orderId = order.orderId;
// //       const keyId = order.keyId;
// //       const amount = Number(order.amount);
// //       const amountInPaise = Math.round(amount * 100);

// //       if (!orderId) {
// //         throw new Error("Razorpay order ID was not returned by the server.");
// //       }

// //       if (!keyId) {
// //         throw new Error("Razorpay key ID was not returned by the server.");
// //       }

// //       if (!Number.isFinite(amount) || amount <= 0 || amountInPaise <= 0) {
// //         throw new Error("Invalid payment amount returned by the server.");
// //       }

// //       console.log("ORDER ID:", orderId);
// //       console.log("KEY ID:", keyId);
// //       console.log("AMOUNT (INR):", amount);
// //       console.log("AMOUNT (PAISE):", amountInPaise);
// //       console.log("CURRENCY:", order.currency);

// //       // ========================================================
// //       // STEP 2 - OPEN RAZORPAY CHECKOUT
// //       // ========================================================

// //       const options = {
// //         key: keyId,

// //         amount: amountInPaise,

// //         currency: order.currency || "INR",

// //         name: "Gym Fitness Club",

// //         description: `${membership.name} Membership`,

// //         order_id: orderId,

// //         prefill: {
// //           name: user.name || user.fullName || "",

// //           email: user.email || "",

// //           contact: user.phone || user.mobile || "",
// //         },

// //         notes: {
// //           membershipPlanId: String(membershipPlanId),

// //           membershipName: membership.name || "",

// //           userId: String(user.id || user.userId || ""),
// //         },

// //         theme: {
// //           color: "#d4af37",
// //         },

// //         modal: {
// //           ondismiss: () => {
// //             console.log("Razorpay checkout closed.");

// //             setLoading(false);
// //           },
// //         },

// //         handler: async function (paymentResponse) {
// //           console.log("======================================");

// //           console.log("RAZORPAY PAYMENT SUCCESS");

// //           console.log("PAYMENT RESPONSE:", paymentResponse);

// //           console.log("======================================");

// //           try {
// //             setLoading(true);
// //             setError("");

// //             // ==================================================
// //             // STEP 3 - VERIFY PAYMENT ON BACKEND
// //             // ==================================================

// //             const verificationData = {
// //               membershipPlanId: membershipPlanId,

// //               razorpayOrderId: paymentResponse.razorpay_order_id,

// //               razorpayPaymentId: paymentResponse.razorpay_payment_id,

// //               razorpaySignature: paymentResponse.razorpay_signature,
// //             };

// //             console.log("VERIFY REQUEST:", verificationData);

// //             const verifyResponse = await paymentAPI.verify(verificationData);

// //             console.log("VERIFY RESPONSE:", verifyResponse.data);

// //             if (verifyResponse.data?.success === false) {
// //               throw new Error(
// //                 verifyResponse.data.message || "Payment verification failed.",
// //               );
// //             }

// //             // ==================================================
// //             // SUCCESS
// //             // ==================================================

// //             setSuccess(true);
// //             setLoading(false);

// //             setTimeout(() => {
// //               navigate("/dashboard", {
// //                 replace: true,
// //               });
// //             }, 1800);
// //           } catch (verifyError) {
// //             console.error("======================================");

// //             console.error("PAYMENT VERIFICATION ERROR");

// //             console.error("STATUS:", verifyError?.response?.status);

// //             console.error("RESPONSE:", verifyError?.response?.data);

// //             console.error("MESSAGE:", verifyError?.message);

// //             console.error("======================================");

// //             const backendMessage = verifyError?.response?.data?.message;

// //             const backendError = verifyError?.response?.data?.error;

// //             setError(
// //               backendMessage ||
// //                 backendError ||
// //                 verifyError?.message ||
// //                 "Payment verification failed.",
// //             );

// //             setLoading(false);
// //           }
// //         },
// //       };

// //       console.log("OPENING RAZORPAY CHECKOUT");

// //       const razorpay = new window.Razorpay(options);

// //       razorpay.on("payment.failed", function (response) {
// //         console.error("======================================");

// //         console.error("RAZORPAY PAYMENT FAILED");

// //         console.error(response);

// //         console.error("======================================");

// //         const reason =
// //           response?.error?.description ||
// //           response?.error?.reason ||
// //           "Payment failed.";

// //         setError(reason);
// //         setLoading(false);
// //       });

// //       razorpay.open();
// //     } catch (paymentError) {
// //       console.error("======================================");

// //       console.error("CREATE PAYMENT ORDER ERROR");

// //       console.error("STATUS:", paymentError?.response?.status);

// //       console.error("BACKEND RESPONSE:", paymentError?.response?.data);

// //       console.error("ERROR MESSAGE:", paymentError?.message);

// //       console.error("======================================");

// //       const backendMessage = paymentError?.response?.data?.message;

// //       const backendError = paymentError?.response?.data?.error;

// //       setError(
// //         backendMessage ||
// //           backendError ||
// //           paymentError?.message ||
// //           "Unable to create Razorpay payment order.",
// //       );

// //       setLoading(false);
// //     }
// //   };

// //   // ============================================================
// //   // NO MEMBERSHIP
// //   // ============================================================

// //   if (!membership) {
// //     return (
// //       <div className="payment-page">
// //         <div className="payment-error-card">
// //           <AlertCircle size={48} />

// //           <h2>Membership Not Selected</h2>

// //           <p>Please select a membership plan before continuing to payment.</p>

// //           <button
// //             className="payment-back-button"
// //             onClick={() => navigate("/memberships")}
// //           >
// //             <ArrowLeft size={18} />
// //             Back to Memberships
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ============================================================
// //   // SUCCESS SCREEN
// //   // ============================================================

// //   if (success) {
// //     return (
// //       <div className="payment-page">
// //         <div className="payment-success-card">
// //           <div className="success-icon">
// //             <CheckCircle2 size={64} />
// //           </div>

// //           <h1>Payment Successful</h1>

// //           <p>
// //             Your {membership.name} membership has been activated successfully.
// //           </p>

// //           <div className="success-loading">
// //             <Loader2 size={18} className="spin" />
// //             Redirecting to dashboard...
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ============================================================
// //   // MAIN PAGE
// //   // ============================================================

// //   return (
// //     <div className="payment-page">
// //       {/* ======================================================
// //           HEADER
// //       ====================================================== */}

// //       <header className="payment-header">
// //         <button className="back-button" onClick={() => navigate(-1)}>
// //           <ArrowLeft size={18} />
// //           Back
// //         </button>

// //         <div className="secure-label">
// //           <ShieldCheck size={18} />
// //           Secure Checkout
// //         </div>
// //       </header>

// //       {/* ======================================================
// //           CONTENT
// //       ====================================================== */}

// //       <main className="payment-container">
// //         <div className="payment-title">
// //           <div className="title-icon">
// //             <Crown size={28} />
// //           </div>

// //           <div>
// //             <h1>Complete Your Membership</h1>

// //             <p>Secure your gym membership with Razorpay.</p>
// //           </div>
// //         </div>

// //         <div className="payment-grid">
// //           {/* ==================================================
// //               MEMBERSHIP CARD
// //           ================================================== */}

// //           <section className="membership-summary">
// //             <div className="card-label">YOUR MEMBERSHIP</div>

// //             <div className="membership-name">
// //               <div className="membership-icon">
// //                 <Crown size={25} />
// //               </div>

// //               <div>
// //                 <h2>{membership.name}</h2>

// //                 <span>Monthly Membership</span>
// //               </div>
// //             </div>

// //             {membership.description && (
// //               <p className="membership-description">{membership.description}</p>
// //             )}

// //             {membership.benefits?.length > 0 && (
// //               <div className="benefits">
// //                 <h3>Membership Benefits</h3>

// //                 {membership.benefits.map((benefit, index) => (
// //                   <div className="benefit" key={index}>
// //                     <CheckCircle2 size={17} />

// //                     <span>{benefit}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </section>

// //           {/* ==================================================
// //               PAYMENT CARD
// //           ================================================== */}

// //           <section className="payment-card">
// //             <div className="card-label">PAYMENT SUMMARY</div>

// //             <div className="price-row">
// //               <span>Membership</span>

// //               <strong>{formatCurrency(membership.monthlyFee)}</strong>
// //             </div>

// //             <div className="price-row">
// //               <span>Billing</span>

// //               <span>Monthly</span>
// //             </div>

// //             <div className="divider" />

// //             <div className="total-row">
// //               <span>Total</span>

// //               <strong>{formatCurrency(membership.monthlyFee)}</strong>
// //             </div>

// //             {/* ERROR */}

// //             {error && (
// //               <div className="payment-error">
// //                 <AlertCircle size={19} />

// //                 <div>{error}</div>
// //               </div>
// //             )}

// //             {/* PAY BUTTON */}

// //             <button
// //               className="pay-button"
// //               onClick={handlePayment}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 size={21} className="spin" />
// //                   Processing...
// //                 </>
// //               ) : (
// //                 <>
// //                   <CreditCard size={21} />
// //                   Pay {formatCurrency(membership.monthlyFee)}
// //                 </>
// //               )}
// //             </button>

// //             <div className="secure-payment">
// //               <Lock size={15} />

// //               <span>Secured by Razorpay</span>
// //             </div>

// //             <div className="payment-info">
// //               <ShieldCheck size={18} />

// //               <div>
// //                 <strong>Safe & Secure Payment</strong>

// //                 <p>
// //                   Your payment information is securely processed by Razorpay.
// //                 </p>
// //               </div>
// //             </div>
// //           </section>
// //         </div>
// //       </main>
// //       <style>{`
// // /* ============================================================
// //    PAYMENT PAGE
// // ============================================================ */

// // .payment-page {
// //   min-height: 100vh;
// //   background:
// //     radial-gradient(
// //       circle at 10% 10%,
// //       rgba(212, 175, 55, 0.08),
// //       transparent 35%
// //     ),
// //     radial-gradient(
// //       circle at 90% 80%,
// //       rgba(139, 92, 246, 0.08),
// //       transparent 35%
// //     ),
// //     #08090d;

// //   color: #ffffff;
// //   padding-bottom: 60px;
// // }

// // /* ============================================================
// //    HEADER
// // ============================================================ */

// // .payment-header {
// //   height: 78px;
// //   padding: 0 7%;
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;

// //   border-bottom: 1px solid
// //     rgba(255, 255, 255, 0.08);

// //   background: rgba(8, 9, 13, 0.88);
// //   backdrop-filter: blur(18px);
// // }

// // .back-button,
// // .payment-back-button {
// //   border: 1px solid
// //     rgba(255, 255, 255, 0.12);

// //   background: rgba(255, 255, 255, 0.04);

// //   color: #ffffff;

// //   padding: 11px 17px;

// //   border-radius: 10px;

// //   display: flex;
// //   align-items: center;
// //   gap: 8px;

// //   cursor: pointer;

// //   transition: 0.25s ease;
// // }

// // .back-button:hover,
// // .payment-back-button:hover {
// //   background: rgba(255, 255, 255, 0.08);
// //   transform: translateY(-1px);
// // }

// // .secure-label {
// //   display: flex;
// //   align-items: center;
// //   gap: 8px;

// //   color: #d4af37;

// //   font-size: 14px;
// //   font-weight: 600;
// // }

// // /* ============================================================
// //    CONTAINER
// // ============================================================ */

// // .payment-container {
// //   width: min(1180px, 92%);
// //   margin: 0 auto;
// //   padding-top: 55px;
// // }

// // /* ============================================================
// //    TITLE
// // ============================================================ */

// // .payment-title {
// //   display: flex;
// //   align-items: center;
// //   gap: 18px;

// //   margin-bottom: 38px;
// // }

// // .title-icon {
// //   width: 58px;
// //   height: 58px;

// //   display: flex;
// //   align-items: center;
// //   justify-content: center;

// //   border-radius: 16px;

// //   color: #d4af37;

// //   background:
// //     linear-gradient(
// //       145deg,
// //       rgba(212, 175, 55, 0.2),
// //       rgba(212, 175, 55, 0.05)
// //     );

// //   border: 1px solid
// //     rgba(212, 175, 55, 0.25);
// // }

// // .payment-title h1 {
// //   margin: 0;

// //   font-size: clamp(28px, 4vw, 42px);

// //   letter-spacing: -1px;
// // }

// // .payment-title p {
// //   margin: 7px 0 0;

// //   color: #9699a4;

// //   font-size: 15px;
// // }

// // /* ============================================================
// //    GRID
// // ============================================================ */

// // .payment-grid {
// //   display: grid;

// //   grid-template-columns:
// //     minmax(0, 1.15fr)
// //     minmax(380px, 0.85fr);

// //   gap: 28px;

// //   align-items: start;
// // }

// // /* ============================================================
// //    CARDS
// // ============================================================ */

// // .membership-summary,
// // .payment-card {
// //   border: 1px solid
// //     rgba(255, 255, 255, 0.08);

// //   background:
// //     linear-gradient(
// //       145deg,
// //       rgba(255, 255, 255, 0.065),
// //       rgba(255, 255, 255, 0.025)
// //     );

// //   box-shadow:
// //     0 30px 70px
// //     rgba(0, 0, 0, 0.3);

// //   border-radius: 24px;

// //   padding: 32px;

// //   backdrop-filter: blur(20px);
// // }

// // .card-label {
// //   color: #777b88;

// //   font-size: 11px;

// //   font-weight: 800;

// //   letter-spacing: 1.7px;

// //   margin-bottom: 25px;
// // }

// // /* ============================================================
// //    MEMBERSHIP
// // ============================================================ */

// // .membership-name {
// //   display: flex;
// //   align-items: center;
// //   gap: 16px;

// //   margin-bottom: 25px;
// // }

// // .membership-icon {
// //   width: 56px;
// //   height: 56px;

// //   border-radius: 15px;

// //   display: flex;
// //   align-items: center;
// //   justify-content: center;

// //   color: #08090d;

// //   background:
// //     linear-gradient(
// //       135deg,
// //       #f5d76e,
// //       #c99821
// //     );

// //   box-shadow:
// //     0 10px 30px
// //     rgba(212, 175, 55, 0.18);
// // }

// // .membership-name h2 {
// //   margin: 0;

// //   font-size: 25px;
// // }

// // .membership-name span {
// //   display: block;

// //   margin-top: 4px;

// //   color: #898d98;

// //   font-size: 13px;
// // }

// // .membership-description {
// //   color: #a7aab4;

// //   line-height: 1.7;

// //   font-size: 14px;

// //   padding-bottom: 25px;

// //   border-bottom: 1px solid
// //     rgba(255, 255, 255, 0.08);
// // }

// // /* ============================================================
// //    BENEFITS
// // ============================================================ */

// // .benefits {
// //   padding-top: 25px;
// // }

// // .benefits h3 {
// //   margin: 0 0 18px;

// //   font-size: 15px;
// // }

// // .benefit {
// //   display: flex;
// //   align-items: flex-start;

// //   gap: 11px;

// //   margin-bottom: 13px;

// //   color: #c4c6ce;

// //   font-size: 14px;
// // }

// // .benefit svg {
// //   flex-shrink: 0;

// //   color: #d4af37;

// //   margin-top: 1px;
// // }

// // /* ============================================================
// //    PRICE
// // ============================================================ */

// // .price-row {
// //   display: flex;
// //   justify-content: space-between;

// //   color: #9699a4;

// //   font-size: 14px;

// //   padding: 9px 0;
// // }

// // .price-row strong {
// //   color: #ffffff;
// // }

// // .divider {
// //   height: 1px;

// //   background: rgba(255, 255, 255, 0.09);

// //   margin: 18px 0;
// // }

// // .total-row {
// //   display: flex;

// //   align-items: center;

// //   justify-content: space-between;

// //   margin-bottom: 25px;
// // }

// // .total-row span {
// //   color: #ffffff;

// //   font-size: 17px;

// //   font-weight: 600;
// // }

// // .total-row strong {
// //   color: #d4af37;

// //   font-size: 30px;
// // }

// // /* ============================================================
// //    ERROR
// // ============================================================ */

// // .payment-error {
// //   display: flex;

// //   gap: 10px;

// //   align-items: flex-start;

// //   padding: 13px 15px;

// //   margin-bottom: 16px;

// //   border-radius: 12px;

// //   border: 1px solid
// //     rgba(239, 68, 68, 0.25);

// //   background:
// //     rgba(239, 68, 68, 0.08);

// //   color: #ff9c9c;

// //   font-size: 13px;

// //   line-height: 1.5;
// // }

// // .payment-error svg {
// //   flex-shrink: 0;
// // }

// // /* ============================================================
// //    PAY BUTTON
// // ============================================================ */

// // .pay-button {
// //   width: 100%;

// //   min-height: 56px;

// //   border: 0;

// //   border-radius: 14px;

// //   display: flex;

// //   align-items: center;

// //   justify-content: center;

// //   gap: 10px;

// //   cursor: pointer;

// //   color: #090a0d;

// //   font-size: 15px;

// //   font-weight: 800;

// //   background:
// //     linear-gradient(
// //       135deg,
// //       #f5d76e,
// //       #d4af37,
// //       #b9891d
// //     );

// //   box-shadow:
// //     0 15px 35px
// //     rgba(212, 175, 55, 0.16);

// //   transition: 0.25s ease;
// // }

// // .pay-button:hover:not(:disabled) {
// //   transform: translateY(-2px);

// //   box-shadow:
// //     0 20px 45px
// //     rgba(212, 175, 55, 0.25);
// // }

// // .pay-button:disabled {
// //   opacity: 0.65;

// //   cursor: not-allowed;
// // }

// // /* ============================================================
// //    SECURE
// // ============================================================ */

// // .secure-payment {
// //   display: flex;

// //   align-items: center;

// //   justify-content: center;

// //   gap: 7px;

// //   color: #777b88;

// //   font-size: 12px;

// //   margin-top: 14px;
// // }

// // .secure-payment svg {
// //   color: #55c98b;
// // }

// // /* ============================================================
// //    INFO
// // ============================================================ */

// // .payment-info {
// //   display: flex;

// //   gap: 12px;

// //   margin-top: 25px;

// //   padding: 17px;

// //   border-radius: 14px;

// //   background:
// //     rgba(255, 255, 255, 0.035);

// //   border: 1px solid
// //     rgba(255, 255, 255, 0.06);
// // }

// // .payment-info svg {
// //   flex-shrink: 0;

// //   color: #55c98b;
// // }

// // .payment-info strong {
// //   display: block;

// //   font-size: 13px;

// //   margin-bottom: 5px;
// // }

// // .payment-info p {
// //   margin: 0;

// //   color: #777b88;

// //   font-size: 12px;

// //   line-height: 1.5;
// // }

// // /* ============================================================
// //    SUCCESS
// // ============================================================ */

// // .payment-success-card,
// // .payment-error-card {
// //   width: min(520px, 90%);

// //   margin: 12vh auto 0;

// //   text-align: center;

// //   padding: 50px 35px;

// //   border-radius: 26px;

// //   border: 1px solid
// //     rgba(255, 255, 255, 0.08);

// //   background:
// //     linear-gradient(
// //       145deg,
// //       rgba(255, 255, 255, 0.07),
// //       rgba(255, 255, 255, 0.025)
// //     );

// //   box-shadow:
// //     0 30px 80px
// //     rgba(0, 0, 0, 0.35);
// // }

// // .success-icon {
// //   width: 90px;
// //   height: 90px;

// //   margin: 0 auto 25px;

// //   border-radius: 50%;

// //   display: flex;

// //   align-items: center;

// //   justify-content: center;

// //   color: #55c98b;

// //   background:
// //     rgba(85, 201, 139, 0.1);

// //   border: 1px solid
// //     rgba(85, 201, 139, 0.2);
// // }

// // .payment-success-card h1,
// // .payment-error-card h2 {
// //   margin: 0 0 12px;
// // }

// // .payment-success-card p,
// // .payment-error-card p {
// //   color: #9296a2;

// //   line-height: 1.7;
// // }

// // .success-loading {
// //   margin-top: 25px;

// //   display: flex;

// //   justify-content: center;

// //   align-items: center;

// //   gap: 8px;

// //   color: #d4af37;

// //   font-size: 13px;
// // }

// // .payment-error-card > svg {
// //   color: #ff7373;

// //   margin-bottom: 20px;
// // }

// // /* ============================================================
// //    SPINNER
// // ============================================================ */

// // .spin {
// //   animation: payment-spin 0.9s linear infinite;
// // }

// // @keyframes payment-spin {
// //   to {
// //     transform: rotate(360deg);
// //   }
// // }

// // /* ============================================================
// //    RESPONSIVE
// // ============================================================ */

// // @media (max-width: 850px) {

// //   .payment-header {
// //     padding: 0 5%;
// //   }

// //   .payment-container {
// //     padding-top: 35px;
// //   }

// //   .payment-grid {
// //     grid-template-columns: 1fr;
// //   }

// //   .payment-title h1 {
// //     font-size: 28px;
// //   }

// // }

// // @media (max-width: 520px) {

// //   .payment-header {
// //     height: 68px;
// //   }

// //   .secure-label {
// //     display: none;
// //   }

// //   .membership-summary,
// //   .payment-card {
// //     padding: 23px;

// //     border-radius: 19px;
// //   }

// //   .payment-title {
// //     align-items: flex-start;
// //   }

// //   .title-icon {
// //     width: 48px;
// //     height: 48px;
// //   }

// //   .total-row strong {
// //     font-size: 25px;
// //   }

// // }
// // `}</style>
// //     </div>
// //   );
// // };

// // export default Payment;
