import PageContainer from "@/components/containers/PageContainer"

export const metadata = {
  title: "Contact Us | Tinivo",
  description: "We’re here to help. Contact Tinivo for any product, order, or partnership inquiries.",
}

export default function ContactPage() {
  return (
    <PageContainer>
        <h1 className="text-3xl font-heading text-center text-neutral-dark">
          💌 Contact Us
        </h1>

        <p className="text-center text-neutral-600 font-body">
          We’d love to hear from you! Whether it’s about your order, our products, or just to say hi — we’re always listening.
        </p>

        <div className="border-t border-neutral-light pt-6 space-y-4 font-body text-neutral-700">
          <div>
            <h2 className="font-heading text-lg text-primary mb-1">
              Merchant Legal Entity Name:
            </h2>
            <p>AKASH</p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-primary mb-1">
              Registered Address:
            </h2>
            <p>
              12A Sathanipet 2nd Street, Maduvinkarai, Guindy, Chennai, Tamil Nadu — 600032
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-primary mb-1">
              Operational Address:
            </h2>
            <p>
              12A Sathanipet 2nd Street, Maduvinkarai, Guindy, Chennai, Tamil Nadu — 600032
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-primary mb-1">Telephone:</h2>
            <p>
              <a href="tel:+919360585409" className="text-primary hover:underline">
                +91 93605 85409
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg text-primary mb-1">E-Mail:</h2>
            <p>
              <a
                href="mailto:wecaretinivo@gmail.com"
                className="text-primary hover:underline"
              >
                wecaretinivo@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-neutral-light">
          <p className="text-sm text-neutral-500 font-body">
            We usually reply within 24 hours. 💜
          </p>
        </div>
    </PageContainer>
  )
}
