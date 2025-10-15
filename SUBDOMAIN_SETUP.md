# Subdomain Setup Guide

## Setting Up humandesign.ayurvedanest.org

### 1. DNS Configuration

Add these DNS records to your domain provider (where ayurvedanest.org is hosted):

```
Type: CNAME
Name: humandesign
Value: adityabandi.github.io
TTL: 3600 (or automatic)
```

**OR** if CNAME doesn't work, use A records:

```
Type: A
Name: humandesign
Value: 185.199.108.153

Type: A
Name: humandesign
Value: 185.199.109.153

Type: A
Name: humandesign
Value: 185.199.110.153

Type: A
Name: humandesign
Value: 185.199.111.153
```

### 2. GitHub Pages Custom Domain Setup

1. Go to your GitHub repository settings
2. Navigate to **Pages** section
3. Under "Custom domain", enter: `humandesign.ayurvedanest.org`
4. Check "Enforce HTTPS" (wait a few minutes for SSL certificate)

### 3. Create CNAME File

Create a file named `CNAME` (no extension) in the root of your repo with:

```
humandesign.ayurvedanest.org
```

### 4. Update Stripe Success URL

When you create your Stripe payment link, set the success URL to:

```
https://humandesign.ayurvedanest.org/confirmation.html?email={CUSTOMER_EMAIL}&result_id={RESULT_ID}
```

Stripe will automatically replace `{CUSTOMER_EMAIL}` with the customer's email.

### 5. Verification

After DNS propagates (can take 5-48 hours), verify:

1. Visit https://humandesign.ayurvedanest.org
2. Homepage should load
3. SSL certificate should be active (🔒 in browser)
4. All pages should work

### 6. Update Email Links

Update support email in:
- `results.html` line 570
- `confirmation.html` line 243

Change `support@humandesign.com` to your actual support email.

## Troubleshooting

**DNS not working?**
- Wait 24-48 hours for DNS propagation
- Use `nslookup humandesign.ayurvedanest.org` to check DNS
- Clear browser cache

**GitHub Pages not serving?**
- Make sure CNAME file is in root directory
- Check repo is public
- Verify custom domain in GitHub settings

**SSL certificate error?**
- Wait a few hours after adding custom domain
- Make sure "Enforce HTTPS" is checked in GitHub settings
