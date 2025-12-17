

export default function TrustStrip() {
  const items = [
    {
      icon: "🔒",
      title: "Secure Prepaid",
      desc: "Razorpay protected payments",
    },
    {
      icon: "🎁",
      title: "Packed With Love",
      desc: "Stickers, note & safe wrapping",
    },
    {
      icon: "🚚",
      title: "Tracked Shipping",
      desc: "Live tracking after dispatch",
    },
    {
      icon: "🔄",
      title: "Easy Returns",
      desc: "If it’s not love, return it",
      link: "/refund-policy",
    },
  ];

  return (
    <section className="bg-babyBlue py-6 border-y border-neutral-200">
         <h2 className="text-2xl md:text-3xl text-center mb-5 font-heading text-neutral-dark">
            Shop With Confidence 💜
          </h2>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-xl bg-white p-4"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="text-sm font-heading text-neutral-dark">
                {item.title}
              </p>
              <p className="text-xs text-neutral-600 font-body">
                {item.desc}
                {item.link && (
                <a
                  href={item.link}
                  className="text-xs text-primary hover:underline"
                >
                  {' '}return policy
                </a>
              )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
