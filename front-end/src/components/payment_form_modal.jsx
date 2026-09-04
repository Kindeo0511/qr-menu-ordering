import { GetPaymentRecordById } from "../services/payment_service";
import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { formatDateTime } from "../utils/util";
function PaymentFormModal({ modal_id, paymentId, setPayments }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!paymentId) return;
    async function GetPaymentRecord() {
      try {
        setLoading(true);
        const data = await GetPaymentRecordById(paymentId);
        setPayment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    GetPaymentRecord();
  }, [paymentId]);

  const order = payment?.table_order;
  const isPaid = order?.payment_status?.toLowerCase() === "paid";

  return (
    <dialog id={modal_id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-lg p-0 overflow-hidden bg-[#FFF8F0]">
        {loading || !order ? (
          <div className="p-10 flex flex-col items-center gap-3 text-sm text-[#8C5A3C]">
            <span className="loading loading-spinner loading-md" />
            Loading receipt...
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 p-6 pb-4 bg-[#C08552]/20">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-box bg-[#FFF8F0]">
                  <UtensilsCrossed size={20} className="text-[#C08552]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-tight text-[#4B2E2B]">
                    {order.table}
                  </h3>
                  <p className="text-xs uppercase font-semibold text-[#8C5A3C] mt-0.5">
                    {order.order_status} &middot;{" "}
                    {formatDateTime(order.created_at)}
                  </p>
                  <p className="text-xs text-[#8C5A3C] mt-0.5">
                    Processed by{" "}
                    <span className="font-medium text-[#4B2E2B]">
                      {payment.cashier || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  isPaid
                    ? "bg-[#8C5A3C]/20 text-[#4B2E2B]"
                    : "bg-[#C08552]/20 text-[#8C5A3C]"
                }`}>
                {order.payment_status}
              </div>
            </div>

            {/* Items */}
            <div className="p-6">
              <ul className="divide-y divide-[#8C5A3C]/30">
                {order.orders?.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2.5 text-sm text-[#4B2E2B]">
                    <span>
                      <span className="text-[#8C5A3C] tabular-nums mr-2">
                        {item.qty}&times;
                      </span>
                      {item.food_name}
                    </span>
                    <span className="font-medium tabular-nums">
                      ₱{(Number(item.price) * item.qty).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#8C5A3C]/30 my-4" />

              {/* Totals */}
              <div className="grid grid-cols-3 gap-2 bg-[#C08552]/20 rounded-box p-3">
                <div className="text-center py-1">
                  <div className="text-xs text-[#8C5A3C] mb-1">Total</div>
                  <div className="text-lg font-semibold tabular-nums text-[#4B2E2B]">
                    ₱{Number(payment.total_amount).toFixed(2)}
                  </div>
                </div>
                <div className="text-center py-1 border-x border-[#8C5A3C]/30">
                  <div className="text-xs text-[#8C5A3C] mb-1">Received</div>
                  <div className="text-lg font-semibold tabular-nums text-[#4B2E2B]">
                    ₱{Number(payment.amount_received).toFixed(2)}
                  </div>
                </div>
                <div className="text-center py-1">
                  <div className="text-xs text-[#8C5A3C] mb-1">Change</div>
                  <div className="text-lg font-semibold tabular-nums text-[#4B2E2B]">
                    ₱{Number(payment.change_given).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="modal-action px-6 pb-6 mt-0">
          <button
            type="button"
            className="btn bg-[#FFF8F0] border border-[#8C5A3C] text-[#4B2E2B] hover:bg-[#C08552] hover:text-[#FFF8F0]"
            onClick={() => document.getElementById(modal_id).close()}>
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default PaymentFormModal;
