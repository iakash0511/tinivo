import PageContainer from "@/components/containers/PageContainer"

export const metadata = {
  title: "Shipping policy | Tinivo",
  description: "Shipping policy of Tinivo for any product or order.",
}

export default function ShippingPolicyPage() {
  return (
   <PageContainer>
        <h1 className="text-3xl font-heading text-center text-neutral-dark">
          💌 Shipping Policy
        </h1>
        <p className="text-left text-neutral-600 font-body">
            For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. 
            Orders are shipped within 9-15 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. 
            Tinivo is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 9-15 days norm the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. 
            For any issues in utilizing our services you may contact our helpdesk wecaretinivo@gmail.com
        </p>
     </PageContainer>
  )
}
