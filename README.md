
# 🌐 Community Website

Hello Devs of SCOE! 👋  
Welcome to the **Community Website Project**. Follow the guide below to contribute smoothly and maintain a clean workflow.

---

## 🚀 Project Workflow Overview

We follow a structured Git workflow:

```

main          → Production (Live Website)
development   → Staging (Testing & Integration)
feature/*     → Individual Work Branches

````

---

## 🧑‍💻 How to Start Contributing

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/cdscscoe/CommunityWebsite.git
cd Community_Website
````

---

### 2️⃣ Switch to Development Branch

```bash
git fetch origin
git checkout development
git pull origin development
```

---

### 3️⃣ Create Your Feature Branch

> ⚠️ Always create a new branch for your work

```bash
git checkout -b feature/your-feature-name
```

📌 Examples:

* `feature/navbar-ui`
* `feature/login-page`
* `bugfix/footer-overlap`

---

## 💻 Working on Your Feature

After making your changes:

```bash
git add .
git commit -m "feat: describe your changes"
git push origin feature/your-feature-name
```

---

## 🔁 Creating a Pull Request (PR)

1. Go to GitHub
2. Click **"Compare & Pull Request"**
3. Set:

```
base: development
compare: feature/your-feature-name
```

4. Add:

   * Description of changes
   * Screenshots (for UI updates)

5. Submit PR ✅

---

## ⚠️ Important Rules

❌ Do NOT push directly to `main`
❌ Do NOT push directly to `development`
❌ Do NOT create branches from `main`

✅ Always pull latest `development` before starting
✅ Always use feature branches
✅ Always create PR for merging

---

## 🔍 Code Review Process

* Your PR will be reviewed
* Changes may be requested
* Once approved → merged into `development`

---

## 🚀 Deployment Flow

```
feature/* → development → main → Production (Vercel)
```

* `development` → Testing stage
* `main` → Live website

---

## 💡 Best Practices

* Write meaningful commit messages:

  * `feat:` → New features
  * `fix:` → Bug fixes
  * `chore:` → Minor changes

* Keep PRs small and focused

* Test your code before pushing

---

## 🤝 Need Help?

If you face any issues:

* Ask in the group
* 📧 Contact: **[cdscscoe@gmail.com](mailto:cdscscoe@gmail.com)**

---

## 🎯 Final Note

Let’s build something awesome together 🚀
Clean code + clean workflow = smooth project 💯

```

- auto PR template

Just say 👍
```
