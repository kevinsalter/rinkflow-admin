# Deployment Guide - admin.rinkflow.com

This guide covers deploying the Rinkflow Admin application to the `admin.rinkflow.com` subdomain using Vercel.

## Prerequisites

- Access to Vercel account with Rinkflow organization
- Access to DNS management for rinkflow.com domain
- Production environment variables configured

## Step 1: Vercel Project Setup

1. Connect this repository to Vercel
2. Configure the project with Next.js framework detection
3. Set build command: `bun run build`
4. Set output directory: `.next`
5. Set install command: `bun install`

## Step 2: Environment Variables

Configure the following environment variables in Vercel:

```bash
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://wsyqoooivsvfwhgpcohm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration (Production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=https://admin.rinkflow.com
```

## Step 3: Custom Domain Configuration

1. In Vercel Dashboard:
   - Go to Project Settings → Domains
   - Add custom domain: `admin.rinkflow.com`
   - Vercel will provide DNS configuration instructions

2. Expected DNS Configuration:
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

## Step 4: Security Headers

The `vercel.json` file includes security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Permissions-Policy` - Restricts access to sensitive APIs

## Step 5: SSL Certificate

Vercel automatically provisions and manages SSL certificates for custom domains. The certificate will be issued once DNS propagation is complete.

## Step 6: Deployment Verification

After deployment, verify:

1. **Domain Access**: Navigate to https://admin.rinkflow.com
2. **SSL Certificate**: Ensure HTTPS is working with valid certificate
3. **Authentication**: Test login/logout flows
4. **API Endpoints**: Verify all API routes are responding
5. **Database Connectivity**: Confirm Supabase connection works
6. **Stripe Integration**: Test billing functionality

## Monitoring

Set up monitoring for:
- Uptime monitoring on admin.rinkflow.com
- Error tracking and logging
- Performance monitoring
- SSL certificate expiration alerts

## Rollback Plan

If issues arise:
1. Revert to previous deployment in Vercel Dashboard
2. Update DNS to point to fallback if needed
3. Monitor error logs for debugging

## Post-Deployment Checklist

- [ ] Domain resolves to Vercel
- [ ] SSL certificate is valid
- [ ] All environment variables are set
- [ ] Authentication flows work
- [ ] Database queries execute successfully
- [ ] Stripe webhooks receive events
- [ ] Error monitoring is active
- [ ] Performance metrics are being collected