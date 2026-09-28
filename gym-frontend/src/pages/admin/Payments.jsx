import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
  IndianRupee,
  Eye,
  X,
  User,
  Crown,
  Receipt,
  CalendarDays,
  Hash,
  Mail,
} from "lucide-react";

import { paymentAPI } from "../../services/api";

const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatus = (payment) => {
  return (payment?.status || payment?.paymentStatus || "PENDING")
    .toString()
    .toUpperCase();
};

const getAmount = (payment) => {
  return payment?.amount ?? payment?.paidAmount ?? payment?.totalAmount ?? 0;
};

const getMemberName = (payment) => {
  return (
    payment?.userName ||
    payment?.customerName ||
    payment?.name ||
    payment?.user?.name ||
    payment?.user?.fullName ||
    "Member"
  );
};

const getMemberEmail = (payment) => {
  return (
    payment?.userEmail ||
    payment?.customerEmail ||
    payment?.email ||
    payment?.user?.email ||
    "—"
  );
};

const getMembershipName = (payment) => {
  return (
    payment?.membershipName ||
    payment?.planName ||
    payment?.membershipPlanName ||
    payment?.membershipPlan?.name ||
    payment?.membership?.name ||
    "Membership"
  );
};

const getPaymentId = (payment) => {
  return (
    payment?.razorpayPaymentId ||
    payment?.paymentId ||
    payment?.razorpay_id ||
    "—"
  );
};

const getOrderId = (payment) => {
  return (
    payment?.razorpayOrderId ||
    payment?.orderId ||
    payment?.razorpay_order_id ||
    "—"
  );
};

const getDate = (payment) => {
  return (
    payment?.paidAt ||
    payment?.createdAt ||
    payment?.paymentDate ||
    payment?.createdDate ||
    payment?.date ||
    null
  );
};

const getUserId = (payment) => {
  return payment?.userId || payment?.user?.id || "—";
};

export default function Payments() {
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedPayment, setSelectedPayment] = useState(null);

  // ==========================================================
  // LOAD PAYMENTS
  // ==========================================================

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setError("");

      if (payments.length === 0) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const response = await paymentAPI.getAllPayments();

      console.log("ADMIN PAYMENTS RESPONSE:", response);

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.payments)
            ? response.payments
            : [];

      setPayments(data);
    } catch (err) {
      console.error("LOAD ADMIN PAYMENTS ERROR:", err);

      setError(err?.response?.data?.message || "Unable to load payments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const status = getStatus(payment);

      if (statusFilter !== "ALL" && status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = [
        getMemberName(payment),
        getMemberEmail(payment),
        getMembershipName(payment),
        getPaymentId(payment),
        getOrderId(payment),
        String(payment?.id || ""),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [payments, search, statusFilter]);

  // ==========================================================
  // STATISTICS
  // ==========================================================

  const statistics = useMemo(() => {
    let revenue = 0;
    let successful = 0;
    let pending = 0;
    let failed = 0;

    payments.forEach((payment) => {
      const status = getStatus(payment);

      const amount = Number(getAmount(payment)) || 0;

      if (["SUCCESS", "PAID", "COMPLETED", "CAPTURED"].includes(status)) {
        revenue += amount;
        successful++;
      } else if (["PENDING", "CREATED", "AUTHORIZED"].includes(status)) {
        pending++;
      } else if (
        ["FAILED", "FAILURE", "CANCELLED", "CANCELED"].includes(status)
      ) {
        failed++;
      }
    });

    return {
      revenue,
      successful,
      pending,
      failed,
      total: payments.length,
    };
  }, [payments]);

  // ==========================================================
  // STATUS
  // ==========================================================

  const statusClass = (status) => {
    if (["SUCCESS", "PAID", "COMPLETED", "CAPTURED"].includes(status)) {
      return "success";
    }

    if (["PENDING", "CREATED", "AUTHORIZED"].includes(status)) {
      return "pending";
    }

    return "failed";
  };

  const StatusIcon = ({ status }) => {
    const type = statusClass(status);

    if (type === "success") {
      return <CheckCircle2 size={15} />;
    }

    if (type === "pending") {
      return <Clock3 size={15} />;
    }

    return <XCircle size={15} />;
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading && payments.length === 0) {
    return (
      <>
        <div className="admin-payment-page">
          <div className="admin-payment-loading">
            <RefreshCw size={35} className="admin-spin" />

            <p>Loading payments...</p>
          </div>
        </div>

        <AdminPaymentStyles />
      </>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <>
      <div className="admin-payment-page">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="admin-payment-header">
          <div>
            <div className="admin-payment-eyebrow">FINANCIAL MANAGEMENT</div>

            <h1>Payments</h1>

            <p>Monitor membership payments received from gym members.</p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadPayments}
            disabled={refreshing}
          >
            <RefreshCw size={17} className={refreshing ? "admin-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="admin-payment-error">
            <XCircle size={20} />

            <div>
              <strong>Unable to load payments</strong>

              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ====================================================
            STATS
        ==================================================== */}

        <div className="payment-stats">
          <div className="payment-stat-card">
            <div className="payment-stat-icon revenue">
              <IndianRupee size={21} />
            </div>

            <div>
              <span>Total Revenue</span>

              <strong>{formatCurrency(statistics.revenue)}</strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="payment-stat-icon success">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Successful</span>

              <strong>{statistics.successful}</strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="payment-stat-icon pending">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending</span>

              <strong>{statistics.pending}</strong>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="payment-stat-icon failed">
              <XCircle size={21} />
            </div>

            <div>
              <span>Failed</span>

              <strong>{statistics.failed}</strong>
            </div>
          </div>
        </div>

        {/* ====================================================
            TOOLBAR
        ==================================================== */}

        <div className="payments-toolbar">
          <div className="payment-search">
            <Search size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search member, email, payment ID..."
            />
          </div>

          <div className="payment-filters">
            {["ALL", "SUCCESS", "PENDING", "FAILED"].map((status) => (
              <button
                key={status}
                className={statusFilter === status ? "active" : ""}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* ====================================================
            TABLE
        ==================================================== */}

        <div className="payments-table-card">
          <div className="payments-table-header">
            <div>
              <h2>Payment History</h2>

              <span>{filteredPayments.length} payments</span>
            </div>

            <div className="live-payment-indicator">
              <span />
              Live Data
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="payments-empty">
              <CreditCard size={45} />

              <h3>No payments found</h3>

              <p>Payments made by gym members will appear here.</p>
            </div>
          ) : (
            <div className="payments-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>

                    <th>Membership</th>

                    <th>Amount</th>

                    <th>Payment ID</th>

                    <th>Date</th>

                    <th>Status</th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment, index) => {
                    const status = getStatus(payment);

                    return (
                      <tr key={payment.id || getPaymentId(payment) || index}>
                        <td>
                          <div className="member-cell">
                            <div className="member-avatar">
                              <User size={17} />
                            </div>

                            <div>
                              <strong>{getMemberName(payment)}</strong>

                              <span>{getMemberEmail(payment)}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="membership-cell">
                            <Crown size={16} />

                            <span>{getMembershipName(payment)}</span>
                          </div>
                        </td>

                        <td>
                          <strong className="amount-cell">
                            {formatCurrency(getAmount(payment))}
                          </strong>
                        </td>

                        <td>
                          <span className="payment-id-cell">
                            {getPaymentId(payment)}
                          </span>
                        </td>

                        <td>
                          <span className="date-cell">
                            {formatDate(getDate(payment))}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${statusClass(status)}`}
                          >
                            <StatusIcon status={status} />

                            {status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="view-payment-button"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          DETAILS MODAL
      ====================================================== */}

      {selectedPayment && (
        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            className="payment-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="payment-modal-header">
              <div>
                <span>PAYMENT DETAILS</span>

                <h2>Payment Received</h2>
              </div>

              <button onClick={() => setSelectedPayment(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-status">
              <CheckCircle2 size={23} />

              <div>
                <strong>{getStatus(selectedPayment)}</strong>

                <span>Payment status</span>
              </div>
            </div>

            <div className="modal-details">
              <div>
                <User size={17} />

                <span>Member</span>

                <strong>{getMemberName(selectedPayment)}</strong>
              </div>

              <div>
                <Mail size={17} />

                <span>Email</span>

                <strong>{getMemberEmail(selectedPayment)}</strong>
              </div>

              <div>
                <Crown size={17} />

                <span>Membership</span>

                <strong>{getMembershipName(selectedPayment)}</strong>
              </div>

              <div>
                <IndianRupee size={17} />

                <span>Amount</span>

                <strong>{formatCurrency(getAmount(selectedPayment))}</strong>
              </div>

              <div>
                <Hash size={17} />

                <span>Razorpay Payment ID</span>

                <strong>{getPaymentId(selectedPayment)}</strong>
              </div>

              <div>
                <Receipt size={17} />

                <span>Razorpay Order ID</span>

                <strong>{getOrderId(selectedPayment)}</strong>
              </div>

              <div>
                <User size={17} />

                <span>Member ID</span>

                <strong>{getUserId(selectedPayment)}</strong>
              </div>

              <div>
                <CalendarDays size={17} />

                <span>Payment Date</span>

                <strong>{formatDate(getDate(selectedPayment))}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminPaymentStyles />
    </>
  );
}

// ============================================================
// ADMIN PAYMENT CSS
// ============================================================

function AdminPaymentStyles() {
  return (
    <style>{`

      .admin-payment-page {
        min-height: 100vh;
        padding: 30px;
        color: #fff;
        background:
          radial-gradient(
            circle at top right,
            rgba(212,175,55,.08),
            transparent 30%
          ),
          #08090c;
      }

      .admin-payment-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 30px;
      }

      .admin-payment-eyebrow {
        color: #d4af37;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 2px;
      }

      .admin-payment-header h1 {
        font-size: 34px;
        margin: 6px 0;
      }

      .admin-payment-header p {
        margin: 0;
        color: #777;
      }

      .admin-refresh-button {
        border: 1px solid rgba(212,175,55,.25);
        background: rgba(212,175,55,.07);
        color: #d4af37;
        border-radius: 11px;
        padding: 11px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .admin-refresh-button:disabled {
        opacity: .6;
      }

      .payment-stats {
        display: grid;
        grid-template-columns:
          repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 25px;
      }

      .payment-stat-card {
        display: flex;
        gap: 14px;
        align-items: center;
        padding: 20px;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 17px;
        background: rgba(255,255,255,.025);
      }

      .payment-stat-card span,
      .payment-stat-card strong {
        display: block;
      }

      .payment-stat-card span {
        color: #777;
        font-size: 11px;
      }

      .payment-stat-card strong {
        margin-top: 4px;
        font-size: 21px;
      }

      .payment-stat-icon {
        width: 44px;
        height: 44px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .payment-stat-icon.revenue {
        color: #d4af37;
        background: rgba(212,175,55,.1);
      }

      .payment-stat-icon.success {
        color: #58d67b;
        background: rgba(88,214,123,.1);
      }

      .payment-stat-icon.pending {
        color: #e4b94c;
        background: rgba(228,185,76,.1);
      }

      .payment-stat-icon.failed {
        color: #ef6666;
        background: rgba(239,102,102,.1);
      }

      .payments-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;
      }

      .payment-search {
        width: min(500px, 100%);
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.03);
        border-radius: 11px;
        padding: 0 14px;
        color: #666;
      }

      .payment-search input {
        flex: 1;
        border: none;
        outline: none;
        background: transparent;
        color: #fff;
        padding: 13px 0;
      }

      .payment-search input::placeholder {
        color: #555;
      }

      .payment-filters {
        display: flex;
        gap: 7px;
      }

      .payment-filters button {
        border: 1px solid rgba(255,255,255,.08);
        background: rgba(255,255,255,.025);
        color: #777;
        padding: 9px 13px;
        border-radius: 9px;
        cursor: pointer;
        font-size: 11px;
      }

      .payment-filters button.active {
        background: rgba(212,175,55,.12);
        border-color: rgba(212,175,55,.35);
        color: #d4af37;
      }

      .payments-table-card {
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.07);
        border-radius: 18px;
        background: rgba(255,255,255,.025);
      }

      .payments-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,.06);
      }

      .payments-table-header h2 {
        margin: 0;
        font-size: 17px;
      }

      .payments-table-header span {
        display: block;
        margin-top: 4px;
        color: #666;
        font-size: 11px;
      }

      .live-payment-indicator {
        display: flex !important;
        align-items: center;
        gap: 6px;
        color: #63d57c !important;
      }

      .live-payment-indicator > span {
        width: 7px;
        height: 7px;
        margin: 0 !important;
        border-radius: 50%;
        background: #63d57c;
        box-shadow: 0 0 10px #63d57c;
      }

      .payments-table-wrapper {
        overflow-x: auto;
      }

      .payments-table-wrapper table {
        width: 100%;
        border-collapse: collapse;
        min-width: 950px;
      }

      .payments-table-wrapper th {
        text-align: left;
        color: #666;
        font-size: 10px;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 15px 18px;
        border-bottom: 1px solid rgba(255,255,255,.06);
      }

      .payments-table-wrapper td {
        padding: 17px 18px;
        border-bottom: 1px solid rgba(255,255,255,.045);
      }

      .payments-table-wrapper tbody tr {
        transition: .2s;
      }

      .payments-table-wrapper tbody tr:hover {
        background: rgba(212,175,55,.025);
      }

      .member-cell {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .member-avatar {
        width: 37px;
        height: 37px;
        border-radius: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #d4af37;
        background: rgba(212,175,55,.1);
      }

      .member-cell strong,
      .member-cell span {
        display: block;
      }

      .member-cell strong {
        font-size: 13px;
      }

      .member-cell span {
        color: #666;
        font-size: 10px;
        margin-top: 3px;
      }

      .membership-cell {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #bbb;
        font-size: 12px;
      }

      .membership-cell svg {
        color: #d4af37;
      }

      .amount-cell {
        color: #d4af37;
      }

      .payment-id-cell {
        display: inline-block;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #777;
        font-family: monospace;
        font-size: 10px;
      }

      .date-cell {
        color: #777;
        font-size: 11px;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 20px;
        padding: 6px 9px;
        font-size: 9px;
        font-weight: 800;
      }

      .status-badge.success {
        color: #59d77b;
        background: rgba(89,215,123,.1);
      }

      .status-badge.pending {
        color: #e3b84d;
        background: rgba(227,184,77,.1);
      }

      .status-badge.failed {
        color: #ee6a6a;
        background: rgba(238,106,106,.1);
      }

      .view-payment-button {
        width: 34px;
        height: 34px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 9px;
        background: transparent;
        color: #777;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .view-payment-button:hover {
        color: #d4af37;
        border-color: rgba(212,175,55,.3);
      }

      .payments-empty {
        text-align: center;
        padding: 75px 20px;
        color: #555;
      }

      .payments-empty h3 {
        color: #aaa;
        margin: 15px 0 7px;
      }

      .payments-empty p {
        margin: 0;
        font-size: 13px;
      }

      .admin-payment-loading {
        min-height: 70vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #777;
      }

      .admin-payment-loading svg {
        color: #d4af37;
      }

      .admin-payment-error {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 13px;
        color: #ff8585;
        background: rgba(220,50,50,.08);
        border: 1px solid rgba(220,50,50,.2);
      }

      .admin-payment-error strong,
      .admin-payment-error span {
        display: block;
      }

      .admin-payment-error span {
        color: #888;
        font-size: 12px;
        margin-top: 3px;
      }

      .payment-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0,0,0,.78);
        backdrop-filter: blur(8px);
      }

      .payment-modal {
        width: min(650px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        border: 1px solid rgba(212,175,55,.2);
        border-radius: 22px;
        background: #101114;
        box-shadow: 0 30px 100px rgba(0,0,0,.6);
      }

      .payment-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 22px;
        border-bottom: 1px solid rgba(255,255,255,.07);
      }

      .payment-modal-header span {
        color: #d4af37;
        font-size: 9px;
        letter-spacing: 1.5px;
      }

      .payment-modal-header h2 {
        margin: 5px 0 0;
        font-size: 21px;
      }

      .payment-modal-header button {
        width: 34px;
        height: 34px;
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 9px;
        background: transparent;
        color: #888;
        cursor: pointer;
      }

      .modal-status {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 20px;
        padding: 15px;
        border-radius: 13px;
        color: #59d77b;
        background: rgba(89,215,123,.07);
        border: 1px solid rgba(89,215,123,.15);
      }

      .modal-status strong,
      .modal-status span {
        display: block;
      }

      .modal-status span {
        color: #666;
        font-size: 10px;
        margin-top: 3px;
      }

      .modal-details {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        margin: 20px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.06);
        border-radius: 13px;
      }

      .modal-details > div {
        padding: 15px;
        background: rgba(255,255,255,.025);
      }

      .modal-details svg {
        color: #d4af37;
        margin-bottom: 7px;
      }

      .modal-details span,
      .modal-details strong {
        display: block;
      }

      .modal-details span {
        color: #666;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: .7px;
      }

      .modal-details strong {
        color: #ccc;
        font-size: 12px;
        margin-top: 4px;
        word-break: break-all;
      }

      .admin-spin {
        animation: adminPaymentSpin 1s linear infinite;
      }

      @keyframes adminPaymentSpin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 1000px) {
        .payment-stats {
          grid-template-columns:
            repeat(2, 1fr);
        }

        .payments-toolbar {
          flex-direction: column;
          align-items: stretch;
        }

        .payment-search {
          width: 100%;
        }

        .payment-filters {
          overflow-x: auto;
        }
      }

      @media (max-width: 600px) {
        .admin-payment-page {
          padding: 20px 14px;
        }

        .admin-payment-header {
          flex-direction: column;
        }

        .payment-stats {
          grid-template-columns: 1fr;
        }

        .modal-details {
          grid-template-columns: 1fr;
        }
      }

    `}</style>
  );
}
