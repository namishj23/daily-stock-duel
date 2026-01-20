# StockPredict - Daily Stock Prediction Contest

A Next.js web application where users predict daily stock price changes and compete for prizes.

## 🚀 Quick Start for Teammates

### Prerequisites
- Node.js 18+ installed
- Git installed
- A Neon PostgreSQL database (or any PostgreSQL database)

### Step 1: Clone the Repository
```bash
git clone https://github.com/namishj23/daily-stock-duel.git
cd daily-stock-duel
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Open `.env` and update the following:

**CRITICAL - Database Connection:**
```env
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```
> Ask Ravi/Namish for the database credentials, or create your own Neon database at https://neon.tech

**CRITICAL - NextAuth Secret:**
```env
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```
> Generate a secret with: `openssl rand -base64 32`

**Optional - Google OAuth:**
```env
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
```
> You can skip this if you only want to test email/password auth

**Optional - Email (Forgot Password):**
```env
RESEND_API_KEY="re_xxxxx"
EMAIL_FROM="noreply@yourdomain.com"
```
> Skip this for local development - forgot password won't work but signup/signin will

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Push Database Schema
```bash
npx prisma db push
```

### Step 6: Seed the Database (Optional)
If you want stock data:
```bash
npm run seed
```

### Step 7: Run Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## 🐛 Common Issues & Solutions

### Issue: "Registration Failed" on Signup

**Cause:** Database connection issue or Prisma client not generated

**Solution:**
1. Check your `DATABASE_URL` in `.env` is correct
2. Run `npx prisma generate`
3. Run `npx prisma db push`
4. Restart the dev server

**Still not working?**
- Check the terminal for error messages
- Open Prisma Studio to verify database connection: `npx prisma studio`

### Issue: "Invalid Email or Password" on Signin

**Cause:** Either credentials are wrong OR Google OAuth user trying to use email/password

**Solution:**
- Try signing up with a new email first
- Or use "Sign in with Google" if you have Google OAuth configured

### Issue: Environment Variables Not Loading

**Cause:** `.env` file missing or not in the root directory

**Solution:**
1. Ensure `.env` file is in the project root (same folder as `package.json`)
2. Restart the dev server after changing `.env`

### Issue: Prisma Client Errors

**Error:** `PrismaClient is unable to connect to the database`

**Solution:**
- Verify `DATABASE_URL` is correct
- Check if database exists and is accessible
- Try: `npx prisma db push` again

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

---

## 📁 Project Structure

```
stock market-1/
├── app/                      # Next.js 14 app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── predictions/     # Prediction submission
│   │   ├── leaderboard/     # Leaderboard data
│   │   └── results/         # Admin: calculate daily results
│   ├── signin/              # Sign in page
│   ├── signup/              # Sign up page
│   ├── predict/             # Prediction form
│   └── ...
├── src/
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── ...
├── prisma/
│   └── schema.prisma        # Database schema
├── .env                     # Environment variables (NOT in git)
├── .env.example             # Example env file (in git)
└── package.json
```

---

## 🔑 Key Features

- ✅ Email/Password & Google OAuth authentication
- ✅ Daily stock prediction (24-hour window)
- ✅ Float precision predictions (e.g., 2.55%)
- ✅ Keyboard input for exact percentages
- ✅ Editable predictions within the window
- ✅ Automatic weekend/holiday handling
- ✅ Leaderboard with top 10 + personal rank
- ✅ Forgot password flow with email

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# View database in browser
npx prisma studio

# Push schema changes to database
npx prisma db push

# Generate Prisma client (after schema changes)
npx prisma generate

# Seed database with NSE stocks
npm run seed
```

---

## 🧪 Testing the Application

### 1. Test Signup
- Go to http://localhost:3000/signup
- Fill in name, email, password (min 8 chars)
- Check age confirmation
- Click "Sign Up"

### 2. Test Signin
- Go to http://localhost:3000/signin
- Enter credentials
- Should redirect to `/predict`

### 3. Test Prediction
- Select a stock from the dropdown
- Drag the slider or type a percentage
- Click "Lock In Prediction"

### 4. Test Leaderboard
- Go to http://localhost:3000/leaderboard
- Should see your prediction

---

## 📞 Need Help?

**Contact:**
- Ravi: [ravijain@macbook.local]
- Namish: [GitHub: namishj23]

**Common Questions:**

**Q: Where do I get the database URL?**
A: Ask the team for shared credentials, or create your own at https://neon.tech (free tier available)

**Q: Do I need Google OAuth for local testing?**
A: No, you can use email/password authentication. Google OAuth is optional.

**Q: The forgot password feature isn't working**
A: You need a Resend API key. For local dev, you can skip this - just test signup/signin.

**Q: How do I manually calculate results?**
A: You need admin access. Ask the team to make your account an admin in the database.

---

## 🎯 Next Steps After Setup

1. **Explore the code** - Start with `app/predict/page.tsx`
2. **Make a test prediction** - Try the prediction form
3. **Check the database** - Run `npx prisma studio` to see the data
4. **Read the schema** - Open `prisma/schema.prisma` to understand the models

Happy coding! 🚀
