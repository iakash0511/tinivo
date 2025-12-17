import PageContainer from "@/components/containers/PageContainer"

export const metadata = {
  title: "Cancellation and refund policy | Tinivo",
  description: "Cancellation and refund policy of Tinivo for any product or order.",
}

export default function ContactPage() {
  return (
    <PageContainer>
        <h1 className="text-3xl font-heading text-center text-neutral-dark">
          💌 Cancellations and Refund Policy
        </h1>
        <p className="text-left text-neutral-600 font-body">
            Tinivo believe in helping its customers as far as possible, and has therefore a liberal cancellation policy. 
            Under this policy: Cancellations will be considered only if the request is made within the same day of placing the order. 
            However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
            In case of receipt of damaged or defective items please report the same to our Customer Service team with a unboxing video and photo wecaretinivo@gmail.com.
            The request will, however, be entertained once the merchant has checked and determined the same at his own end. 
            This should be reported within the same day of the product delivery. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within the same day of receiving the product. 
            The Customer Service Team after looking into your complaint will take an appropriate decision. In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. 
            In case of any Refunds approved by the Tinivo, it’ll take 6-8 days for the refund to be processed to the end customer.
            </p>
    </PageContainer>
  )
}
