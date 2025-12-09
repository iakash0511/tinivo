// lib/notifications/telegram.ts
import "server-only";
import type { OrderForEmail } from "./email";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatIds = process.env.TELEGRAM_CHAT_IDS
  ? process.env.TELEGRAM_CHAT_IDS.split(",").map((id) => id.trim())
  : [];

export async function sendOrderTelegram(order: OrderForEmail) {
  if (!botToken) {
    console.warn(
      "⚠️ TELEGRAM_BOT_TOKEN missing, skipping Telegram notification"
    );
    return;
  }

  if (!chatIds.length) {
    console.warn(
      "⚠️ TELEGRAM_CHAT_IDS missing, skipping Telegram notification"
    );
    return;
  }

  const itemsText =
    order.items && order.items.length
      ? order.items
          .map(
            (item) => `• ${item.name} x${item.quantity} – ₹${item.price * item.quantity}`
          )
          .join("\n")
      : "Items not available";

  const timeText =
    order._createdAt &&
    new Date(order._createdAt).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

  const message = `
🎀 *New Tinivo Order*

*Order ID:* ${order._id}
*Customer:* ${order.customerName}
*Amount:* ₹${order.total} "INR"
*Payment:* ${order.paymentStatus || "N/A"}

*Items:*
${itemsText}

📱 *Phone:* ${order.phone || "N/A"}
📧 *Email:* ${order.email || "N/A"}

🕒 *Time:* ${timeText || "N/A"}
  `.trim();

  // Send to all configured chats
  await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
          }),
        });
      } catch (err) {
        console.error("❌ Telegram send error:", err);
      }
    })
  );
}
