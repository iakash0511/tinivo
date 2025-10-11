import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-light py-10 px-6 text-neutral-700">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div className="space-y-2">
          <h3 className="text-2xl font-logo text-primary">Tinivo</h3>
          <p className="font-body text-sm text-neutral-600 leading-relaxed">
            Small Things. Big Joy. 💜 <br />
            Curated with care, wrapped with love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-lg mb-3 text-primary">Quick Links</h4>
          <ul className="space-y-2 font-body text-sm">
            <li>
              <Link href="/shop" className="hover:text-primary transition">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-primary transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-primary transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-primary transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-primary transition">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-primary transition">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="font-heading text-lg mb-3 text-primary">Reach Us</h4>
          <ul className="space-y-2 font-body text-sm">
            <li>
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:wecaretinivo@gmail.com"
                className="hover:text-primary transition"
              >
                wecaretinivo@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="border-t border-neutral-light mt-8 pt-6 text-center text-sm font-body text-neutral-500">
        <p>© {new Date().getFullYear()} Tinivo. All Rights Reserved.</p>
      </div>
    </footer>
  )
}
