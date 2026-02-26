require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");

// Initialize Express app
const app = express();

// CORS Middleware
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://stupendous-croissant-ed072e.netlify.app",
//       "http://localhost:3001",
//       "https://frontend.systemmanager.in/vpfinance",
//       "https://vpfinancial.vercel.app",
//       "https://vp-financial-fblwkle3v-shaansheebanis-projects.vercel.app"
//     ],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, mobile apps)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://stupendous-croissant-ed072e.netlify.app",
        "https://frontend.systemmanager.in",
        "https://vpfinancial.vercel.app",
      ];

      // Allow all vercel preview + production domains
      if (
        allowedOrigins.includes(origin) ||
        origin.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);

// Explicitly handle preflight
app.options("*", cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Database Connection
const dbUrl = process.env.dbUrl;

mongoose
  .connect(dbUrl, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log(`✅ DB Connected Successfully`);
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

// Import Routes
const candidateRoutes = require("./Routes/candidateRoutes");
const vacancyRoutes = require("./Routes/vacancyRoutes.js");
const telecallerRoutes = require("./Routes/telecallerRoutes.js");
const telemarketerRoutes = require("./Routes/telemarketerRoutes.js");
const OARoutes = require("./Routes/OARoutes.js");
const OERoutes = require("./Routes/OERoutes.js");
const HRRoutes = require("./Routes/HRRoutes.js");
const accountantRoutes = require("./Routes/accountantRoutes.js");
const authRoutes = require("./Routes/authRoutes");
const LeadSourceRoute = require("./Routes/Lead/LeadSourceRoute");
const LeadOccupationRoute = require("./Routes/Lead/LeadOccupationRoute");
const LeadAreaRoute = require("./Routes/Lead/LeadAreaRoute");
const LeadSubAreaRoute = require("./Routes/Lead/LeadSubAreaRoute");
const LeadCityRoute = require("./Routes/Lead/CityRoute");
const MeetingPurposeRoutes = require("./Routes/Lead/MeetingPurposeRoute");
const TaskRoute = require("./Routes/TaskRoute");
const FinancialProductRoute = require("./Routes/FinancialProductRoute");
const CompanyNameRoute = require("./Routes/CompanyNameRoute");
const RegistrarRoute = require("./Routes/RegistrarRoute");
const AMCRoute = require("./Routes/AMCRoute");
const LeadTypeRoute = require("./Routes/LeadTypeRoute");
const OccupationTypeRoute = require("./Routes/OccupationTypeRoute");
const OfficeDiaryRoute = require("./Routes/OfficeDiaryRoute");
const OfficePurchaseRoute = require("./Routes/OfficePurchaseRoute");
const ImpDocumentRoute = require("./Routes/ImpDocumentRoute");
const ClientRoute = require("./Routes/ClientRoute");
const SuspectRoute = require("./Routes/SuspectRoute");
const ProspectRoute = require("./Routes/ProspectRoute");
const kycrouter = require("./Routes/Kycdocumentname");
const cre = require("./Routes/CRE.js");
const businessAssociatesRoutes = require("./Routes/BusinessAssociates");
const employeeRoute = require("./Routes/employeeRoute");
const rulesRoutes = require("./Routes/rulesRoutes");
const futurePlansRoutes = require("./Routes/futurePlansRoutes");
const internshipRoutes = require("./Routes/internshipRoutes");
const RMRoutes = require("./Routes/RMRoutes");
const marketingFormRoutes = require("./Routes/FormRoutes/MarketingFormRoutes");
const servicingFormRoutes = require("./Routes/FormRoutes/ServicingFormRoutes");
const formCompanyRoutes = require("./Routes/FormRoutes/FormCompanyRoutes");
const departmentFinancialProductRoutes = require("./Routes/FormRoutes/departmentFinancialProductRoutes");
const incomeHeadAccountRoute = require("./Routes/IncomeHeadAccountRoute");
const bankRoutes = require("./Routes/BankRoutes");
const ExpenseHeadAccount = require("./Routes/ExpenseHeadAccountRoute"); 
const expenseRoutes = require("./Routes/ExpenseHeadRoutes");
const balanceRoutes = require("./Routes/BalanceRoutes.js");
const incomeExpenseAccountRoute = require("./Routes/IncomeExpenseAccountRoute");
const incomeExpenseRoutes = require("./Routes/IncomeExpenseRoute");
const IncomeExpenseReportRoute = require("./Routes/IncomeExpenseReportRoute");
// STATIC FILES
app.use(
  "/vacancy-images",
  express.static(path.join(__dirname, "public/vacancy-creation-images"))
);

app.use(
  "/candidate-resumes",
  express.static(path.join(__dirname, "public/candidate-resumes"))
);
app.use(
  "/offer-letters",
  express.static(path.join(__dirname, "public/offer-letters"))
);
app.use(
  "/joining-letters",
  express.static(path.join(__dirname, "public/joining-letters"))
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/documents", express.static(path.join(__dirname, "public/Documents")));
app.use("/images", express.static("public/images"));
app.use("/Images", express.static(path.join(__dirname, "public/Images")));
const ensureDirectories = () => {
  const directories = [
    "public/offer-letters",
    "public/joining-letters",
    "public/candidate-resumes",
  ];

  directories.forEach((dir) => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dirPath}`);
    }
  });
};

ensureDirectories();
// API ROUTES
app.use("/api/vacancynotice", vacancyRoutes);
app.use("/api/addcandidate", candidateRoutes);
app.use("/api/telemarketer", telemarketerRoutes);
app.use("/api/telecaller", telecallerRoutes);
app.use("/api/OE", OERoutes);
app.use("/api/OA", OARoutes);
app.use("/api/HR", HRRoutes);
app.use("/api/accountant", accountantRoutes);
app.use("/api/business-associates", businessAssociatesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", require("./Routes/upload"));
app.use("/api/Task", TaskRoute);
app.use("/api/kycdocument", kycrouter);
app.use("/api/FinancialProduct", FinancialProductRoute);
app.use("/api/CompanyName", CompanyNameRoute);
app.use("/api/registrar", RegistrarRoute);
app.use("/api/AMC", AMCRoute);
app.use("/api/office-diary", OfficeDiaryRoute);
app.use("/api/office-purchase", OfficePurchaseRoute);
app.use("/api/important-documents", ImpDocumentRoute);
app.use("/api/suspect", SuspectRoute);
app.use("/api/prospect", ProspectRoute);
app.use("/api/client", ClientRoute);
app.use("/api/leadarea", LeadAreaRoute);
app.use("/api/leadsubarea", LeadSubAreaRoute);
app.use("/api/leadcity", LeadCityRoute);
app.use("/api/leadType", LeadTypeRoute);
app.use("/api/leadSource", LeadSourceRoute);
app.use("/api/meeting-purpose", MeetingPurposeRoutes);
app.use("/api/occupation/types", OccupationTypeRoute);
app.use("/api/occupation", LeadOccupationRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/cre", cre);
app.use("/api/rules", rulesRoutes);
app.use("/api/future-plans", futurePlansRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/rm", RMRoutes);
app.use("/api/marketing-forms", marketingFormRoutes);
app.use("/api/servicing-forms", servicingFormRoutes);
app.use("/api/form-company", formCompanyRoutes);
app.use("/api/department-financial-products", departmentFinancialProductRoutes);
app.use("/api/income-head-account", incomeHeadAccountRoute);
app.use("/api/income-head", require("./Routes/IncomeHeadRoute"));
app.use("/api/banks", bankRoutes);
app.use("/api/expense-head-account", ExpenseHeadAccount);
app.use("/api/expense", expenseRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/income-expense-accounts", incomeExpenseAccountRoute);
app.use("/api/income-expense", incomeExpenseRoutes);
app.use("/api/IncomeExpenseReport", IncomeExpenseReportRoute);

// 🎯 SERVE REACT BUILD
app.use(express.static(path.join(__dirname, "dist")));
app.use("/forms", express.static(path.join(__dirname, "public/Forms")));

// React Route (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} `);
});
