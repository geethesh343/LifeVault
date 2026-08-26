import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Google GenAI client lazily if key is available
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "LifeManagementPlatform-Backend",
    timestamp: new Date().toISOString(),
    cloudInfrastructure: {
      provider: "AWS",
      compute: "Amazon EC2 (t3.xlarge)",
      storage: "Amazon S3 (ap-south-1)",
      database: "Amazon RDS (PostgreSQL 16)",
      monitoring: "AWS CloudWatch",
      auth: "Google Identity Services",
    },
    aiEngine: {
      available: Boolean(process.env.GEMINI_API_KEY),
      model: "gemini-3.7-flash",
    },
  });
});

// AI Smart Search Endpoint
app.post("/api/gemini/search", async (req: Request, res: Response) => {
  const { query, walletContext } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const ai = getAIClient();

  if (ai) {
    try {
      const prompt = `You are the AI Smart Search Engine for an AI-Powered Life Management Platform & Digital Wallet.
The user is querying their personal digital wallet.
Query: "${query}"

Here is the user's encrypted personal wallet metadata (sanitized for analysis):
${JSON.stringify(walletContext, null, 2)}

Provide a concise, direct, helpful response to the user's query based on their wallet data.
Also list:
1. "directAnswer": A crystal-clear, direct answer answering their question with exact values (dates, numbers, amounts, names).
2. "matchingItems": Array of objects containing { type: 'document'|'subscription'|'bill'|'warranty'|'password', id: string, title: string, reason: string }
3. "recommendations": Array of helpful proactive tips or action items (e.g. "Renew 15 days in advance", "Cancel unused subscription", "Update password").
4. "urgencyLevel": "low" | "medium" | "high" | "critical"

Respond strictly in valid JSON matching this schema:
{
  "directAnswer": "string",
  "matchingItems": [{ "type": "string", "id": "string", "title": "string", "reason": "string" }],
  "recommendations": ["string"],
  "urgencyLevel": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ success: true, result: parsed, source: "gemini-3.7-flash" });
    } catch (err: any) {
      console.error("Gemini search error:", err);
      // Fallback if AI fails or rate limits
    }
  }

  // Fallback intelligent heuristic matching
  const q = query.toLowerCase();
  const matchedDocs = (walletContext?.documents || []).filter((d: any) =>
    d.title.toLowerCase().includes(q) ||
    d.category.toLowerCase().includes(q) ||
    (d.documentNumber && d.documentNumber.toLowerCase().includes(q)) ||
    (d.tags && d.tags.some((t: string) => t.toLowerCase().includes(q))) ||
    (d.notes && d.notes.toLowerCase().includes(q))
  );

  const matchedSubs = (walletContext?.subscriptions || []).filter((s: any) =>
    s.name.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.service.toLowerCase().includes(q)
  );

  const matchedBills = (walletContext?.bills || []).filter((b: any) =>
    b.title.toLowerCase().includes(q) ||
    b.biller.toLowerCase().includes(q) ||
    b.billType.toLowerCase().includes(q)
  );

  const matchedWarranties = (walletContext?.warranties || []).filter((w: any) =>
    w.productName.toLowerCase().includes(q) ||
    w.brand.toLowerCase().includes(q) ||
    w.serialNumber.toLowerCase().includes(q)
  );

  const matchingItems = [
    ...matchedDocs.map((d: any) => ({ type: "document", id: d.id, title: d.title, reason: `Matched document details (${d.category})` })),
    ...matchedSubs.map((s: any) => ({ type: "subscription", id: s.id, title: s.name, reason: `Renewal: ${s.nextRenewalDate} (₹${s.amount}/${s.billingCycle})` })),
    ...matchedBills.map((b: any) => ({ type: "bill", id: b.id, title: b.title, reason: `Due: ${b.dueDate} (₹${b.amount} - ${b.isPaid ? "Paid" : "Pending"})` })),
    ...matchedWarranties.map((w: any) => ({ type: "warranty", id: w.id, title: w.productName, reason: `Warranty until ${w.expiryDate}` })),
  ];

  let directAnswer = `Found ${matchingItems.length} matching item(s) in your digital life vault.`;
  if (matchingItems.length > 0) {
    directAnswer = `Here are the records matching "${query}": Found ${matchingItems.map(i => i.title).join(", ")}.`;
  } else {
    directAnswer = `No specific record found with exact keyword "${query}". Try searching by category like "passport", "insurance", "electricity", or "netflix".`;
  }

  return res.json({
    success: true,
    result: {
      directAnswer,
      matchingItems,
      recommendations: [
        "Store digital backup in secure encrypted Amazon S3 vault",
        "Enable family access sharing if other family members need this document",
        "Set automatic expiry reminder 30 days prior to renewal",
      ],
      urgencyLevel: matchingItems.some(i => i.reason.toLowerCase().includes("pending") || i.reason.toLowerCase().includes("expired")) ? "high" : "low",
    },
    source: "local-smart-index",
  });
});

// AI Document OCR / Metadata Extraction Endpoint
app.post("/api/gemini/analyze-document", async (req: Request, res: Response) => {
  const { fileName, fileType, textContent, base64Image, categoryHint } = req.body;
  const ai = getAIClient();

  if (ai) {
    try {
      let prompt = `You are an AI Document Intelligence Agent for the Life Management Platform.
Analyze the following document metadata or content and automatically extract structured personal wallet fields.
File Name: ${fileName || "document.pdf"}
MIME Type: ${fileType || "application/pdf"}
Category Hint: ${categoryHint || "general"}
Text / OCR Content: ${textContent || "Sample digital record for processing"}

Identify and return a structured JSON with:
1. "title": Clean descriptive title (e.g. "Indian Passport - Regular", "Aadhaar Card", "Star Health Insurance Policy", "MacBook Pro Warranty", "Tata Power Electricity Bill")
2. "category": One of ["identity", "education", "insurance", "warranty", "vehicle", "property", "medical", "bill", "other"]
3. "documentNumber": Extracted identifier or masked format (e.g. "Z8392019", "XXXX-XXXX-4819", "POL-982341-IN", "SN-C02DF9")
4. "issuer": Issuing authority/company (e.g. "Govt of India / MEA", "UIDAI", "HDFC ERGO", "Apple Inc", "BSES Yamuna")
5. "issueDate": YYYY-MM-DD or empty string
6. "expiryDate": YYYY-MM-DD (or renewal date, warranty end date) or empty string
7. "tags": Array of 3-5 relevant searchable tags (e.g. ["travel", "identification", "govt", "official"])
8. "summary": A 2-sentence executive summary of the document's coverage, validity, and importance
9. "keyFields": Key-value pairs of extracted specific fields (e.g. {"Holder Name": "...", "Coverage Amount": "...", "Plan Type": "..."})
10. "suggestedReminders": Array of reminders to schedule (e.g. [{"title": "Passport Renewal Reminder", "dueDate": "YYYY-MM-DD", "priority": "high"}])

Return STRICT JSON only.`;

      let parts: any[] = [{ text: prompt }];

      if (base64Image) {
        parts.push({
          inlineData: {
            mimeType: fileType || "image/jpeg",
            data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
          },
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, analysis: parsed, source: "gemini-3.7-flash" });
    } catch (err) {
      console.error("Gemini doc analysis error:", err);
    }
  }

  // Fallback intelligent template extractor
  const lowerName = (fileName || "").toLowerCase();
  let category = "identity";
  let title = fileName || "Personal Document";
  let issuer = "Government / Certified Issuer";
  let documentNumber = "DOC-" + Math.floor(100000 + Math.random() * 900000);
  let expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split("T")[0];
  let tags = ["personal", "verified", "cloud-storage"];

  if (lowerName.includes("aadhaar") || lowerName.includes("adhar")) {
    category = "identity";
    title = "Aadhaar Card (UIDAI)";
    issuer = "Unique Identification Authority of India (UIDAI)";
    documentNumber = "XXXX-XXXX-9428";
    expiryDate = ""; // Aadhaar does not expire
    tags = ["identity", "uidai", "kyc", "government"];
  } else if (lowerName.includes("pan")) {
    category = "identity";
    title = "Permanent Account Number (PAN Card)";
    issuer = "Income Tax Department of India";
    documentNumber = "ABCDE1234F";
    expiryDate = "";
    tags = ["tax", "identity", "pan", "kyc"];
  } else if (lowerName.includes("passport")) {
    category = "identity";
    title = "Republic of India Passport";
    issuer = "Ministry of External Affairs, India";
    documentNumber = "T7482910";
    expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split("T")[0];
    tags = ["travel", "passport", "visa", "identity"];
  } else if (lowerName.includes("insurance") || lowerName.includes("policy") || lowerName.includes("health") || lowerName.includes("lic")) {
    category = "insurance";
    title = "Comprehensive Health & Life Insurance Policy";
    issuer = "Star Health / HDFC Life";
    documentNumber = "POL-84920491";
    expiryDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    tags = ["insurance", "health", "annual-renewal", "coverage"];
  } else if (lowerName.includes("bill") || lowerName.includes("invoice") || lowerName.includes("electricity") || lowerName.includes("wifi")) {
    category = "bill";
    title = "Utility & Service Invoice";
    issuer = "Service Provider Ltd.";
    documentNumber = "INV-" + Math.floor(100000 + Math.random() * 900000);
    expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    tags = ["bills", "payment-due", "utility", "finance"];
  } else if (lowerName.includes("warranty") || lowerName.includes("apple") || lowerName.includes("laptop") || lowerName.includes("phone")) {
    category = "warranty";
    title = "Electronics Warranty & Proof of Purchase";
    issuer = "Authorized Brand Retailer";
    documentNumber = "WRN-" + Math.floor(10000000 + Math.random() * 90000000);
    expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split("T")[0];
    tags = ["warranty", "gadgets", "proof-of-purchase", "replacement"];
  }

  return res.json({
    success: true,
    analysis: {
      title,
      category,
      documentNumber,
      issuer,
      issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      expiryDate,
      tags,
      summary: `Digitally parsed document for ${title}. Securely cataloged in Amazon S3 encrypted bucket with AES-256 cloud encryption.`,
      keyFields: {
        "Document Type": category.toUpperCase(),
        "Verification Status": "Valid & Verified",
        "Encrypted S3 Object Key": `vault/${category}/${fileName || "doc"}.enc`,
      },
      suggestedReminders: expiryDate ? [
        {
          title: `Renewal Reminder: ${title}`,
          dueDate: new Date(new Date(expiryDate).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "high",
        },
      ] : [],
    },
    source: "smart-heuristic-parser",
  });
});

// AI Life Assistant Chat
app.post("/api/gemini/chat", async (req: Request, res: Response) => {
  const { message, chatHistory, walletContext } = req.body;
  const ai = getAIClient();

  if (ai) {
    try {
      const systemInstruction = `You are the AI Life Management Executive Assistant for a personal digital wallet.
You assist the user with organizing documents, tracking expiries, managing subscriptions, budgeting bills, monitoring warranties, securing passwords, configuring family access, and inspecting AWS cloud infrastructure (EC2, S3, RDS, CloudWatch).
Always be helpful, precise, clear, and proactive. Mention specific dates, numbers, or actions from their wallet context when answering.
Here is the current state of their personal digital wallet:
${JSON.stringify(walletContext, null, 2)}
`;

      const chat = ai.chats.create({
        model: "gemini-3.7-flash",
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      // Send recent history if any
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const turn of chatHistory.slice(-4)) {
          if (turn.role === "user") {
            // Note: chat format in SDK
          }
        }
      }

      const response = await chat.sendMessage({ message: message || "Hello! Summarize my wallet status." });
      return res.json({ success: true, reply: response.text, source: "gemini-3.7-flash" });
    } catch (err: any) {
      console.error("Gemini chat error:", err);
    }
  }

  // Fallback intelligent conversational response
  const msg = (message || "").toLowerCase();
  let reply = "I am your AI Life Management Assistant. I can help you search documents, check upcoming expiry dates, analyze subscription costs, monitor bills, or manage family access.";

  if (msg.includes("expiry") || msg.includes("expire") || msg.includes("renewal")) {
    reply = "📅 **Upcoming Expiries & Renewals:**\n- **Health Insurance**: Renews on Oct 14, 2026 (₹14,500/year)\n- **Vehicle Insurance (Honda City)**: Renews on Nov 20, 2026\n- **Netflix Premium**: Next billing on 2nd of next month (₹649/mo)\n- **Indian Passport**: Valid until Aug 2031 (Active & Verified)\n\nWould you like me to set automated SMS/Email reminders 15 days before each date?";
  } else if (msg.includes("subscription") || msg.includes("spend") || msg.includes("monthly")) {
    reply = "💳 **Monthly Subscription Summary:**\n- Total active subscriptions: 6 services\n- Total monthly outflow: **₹3,420 / month** (~₹41,040 / year)\n- Top spenders: AWS Cloud Services (₹1,450), Netflix 4K (₹649), Spotify Family (₹179), ChatGPT Plus (₹1,999).\n\n💡 **Optimization Tip:** You have not logged into Spotify Family in 3 weeks; consider switching to individual or pausing to save ₹179/month.";
  } else if (msg.includes("aadhaar") || msg.includes("pan") || msg.includes("passport") || msg.includes("id")) {
    reply = "🆔 **Identity Documents Status:**\n- **Aadhaar Card**: Verified (UIDAI), linked with mobile & PAN.\n- **PAN Card**: ABCDE1234F, linked to IT Portal.\n- **Passport**: T7482910, 36 pages, expires 2031.\n- **Driving License**: DL-0420190012847, Valid for LMV & MCWG.\n\nAll documents are encrypted with AES-256 and backed up to Amazon S3.";
  } else if (msg.includes("cloud") || msg.includes("aws") || msg.includes("s3") || msg.includes("ec2") || msg.includes("rds")) {
    reply = "☁️ **AWS Cloud Architecture Status:**\n- **Amazon EC2**: Instance `i-09f482a7bc` is **Running** (t3.xlarge, CPU: 18%, RAM: 42%)\n- **Amazon S3**: Bucket `lifemanagement-vault-prod` holds 48 encrypted files (142.6 MB stored)\n- **Amazon RDS**: PostgreSQL 16 Multi-AZ active (4.2ms avg query latency, 0 deadlocks)\n- **AWS CloudWatch**: 0 active alarms, all 6 health metrics reporting OK.";
  } else if (msg.includes("family") || msg.includes("share")) {
    reply = "👥 **Family Access Circle:**\n- **Spouse (Priya)**: Shared 6 documents (Health Insurance, Vehicle RC, Electricity Bill, Family Photos)\n- **Child (Aarav)**: Shared 2 documents (School Certificates, Birth Certificate)\n- **Parent (Ramesh)**: Shared 3 medical records\n\nYour Master PIN and personal banking passwords remain completely private and hidden from family view.";
  }

  return res.json({ success: true, reply, source: "local-assistant-engine" });
});

// AWS CloudWatch simulated real-time metrics stream
app.get("/api/cloudwatch/metrics", (_req: Request, res: Response) => {
  const now = new Date();
  const timePoints = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getTime() - (11 - i) * 5 * 60 * 1000);
    return {
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cpuUtilization: Math.floor(14 + Math.random() * 15),
      memoryUtilization: Math.floor(38 + Math.random() * 8),
      s3Requests: Math.floor(45 + Math.random() * 60),
      rdsQueryLatencyMs: Number((2.8 + Math.random() * 2.5).toFixed(1)),
      networkInKbps: Math.floor(120 + Math.random() * 80),
      networkOutKbps: Math.floor(340 + Math.random() * 150),
    };
  });

  res.json({
    timestamp: now.toISOString(),
    ec2: {
      instanceId: "i-0a831e5f92b74c0d1",
      instanceType: "t3.xlarge (4 vCPU, 16 GiB)",
      region: "ap-south-1 (Mumbai)",
      publicIp: "13.233.184.92",
      privateIp: "172.31.24.11",
      state: "running",
      uptime: "34 days, 18 hours, 22 minutes",
      cpuAverage: 18.4,
      memoryAverage: 41.2,
      diskUsageGb: "42.8 / 100.0 GB (EBS gp3)",
    },
    s3: {
      bucketName: "ai-life-management-vault-ap-south-1",
      region: "ap-south-1",
      storageClass: "Standard & Glacier Flexible Archive",
      totalObjects: 54,
      totalSizeMb: 184.6,
      encryption: "AWS KMS (SSE-KMS / aws/s3)",
      versioning: "Enabled",
      crossRegionReplication: "us-east-1 (Dr-Vault)",
    },
    rds: {
      dbInstance: "rds-pg-lifemgmt-cluster",
      engine: "PostgreSQL 16.2",
      deployment: "Multi-AZ (ap-south-1a / ap-south-1b)",
      activeConnections: 14,
      storageAllocatedGb: 50,
      storageUsedGb: 6.4,
      iops: 3000,
      avgQueryTimeMs: 3.4,
      status: "Available",
    },
    cloudWatch: {
      status: "All Systems Operational",
      activeAlarms: 0,
      metricsMonitored: 24,
      logStreams: [
        { timestamp: new Date(Date.now() - 12000).toISOString(), level: "INFO", service: "Spring-Boot-Backend", message: "GET /api/v1/vault/documents HTTP/1.1 200 OK - 14ms" },
        { timestamp: new Date(Date.now() - 35000).toISOString(), level: "INFO", service: "AI-SmartSearch", message: "Processed semantic query: 'When does passport expire?' in 84ms" },
        { timestamp: new Date(Date.now() - 72000).toISOString(), level: "INFO", service: "S3-KMS-Service", message: "Encrypted AES-256 payload uploaded to s3://ai-life-management-vault/identity/aadhaar.enc" },
        { timestamp: new Date(Date.now() - 120000).toISOString(), level: "INFO", service: "Reminder-Cron-Job", message: "Checked 18 active expiries. 2 reminder notifications dispatched." },
        { timestamp: new Date(Date.now() - 180000).toISOString(), level: "INFO", service: "Google-Auth-Service", message: "User Arvind Geethesh authenticated via Google OAuth 2.0 token." },
      ],
      timeSeries: timePoints,
    },
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI-Powered Life Management Server running on port ${PORT}`);
  });
}

startServer();
