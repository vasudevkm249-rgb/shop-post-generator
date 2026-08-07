# Shop Post Generator — Deployment Guide

This folder has everything needed to put your app live on the internet, for free, in about 15 minutes.

## What's in this folder
- `index.html` — the website itself (what customers/shop owners see and use)
- `api/generate.js` — a hidden server piece that safely talks to Claude's API using your secret key

You never edit these unless you want to change how the app works. Just follow the steps below.

## Step 1: Get your Anthropic API key
1. Go to console.anthropic.com and sign up (or log in)
2. Go to "API Keys" and create a new key
3. Copy it somewhere safe — you'll paste it once in Step 3, and you won't be able to see it again after you close that screen

**Important:** Add billing details on that same console. Without it, your key won't work for real requests. Anthropic charges based on usage — see the cost estimate you already got. Set a spending limit in the console if you want a safety net.

## Step 2: Put this project on GitHub
1. Go to github.com and create a free account if you don't have one
2. Create a new repository (name it anything, e.g. `shop-post-generator`)
3. Upload these two files (`index.html` and the `api` folder) into that repository — GitHub's website lets you drag and drop files directly, no coding tools needed

## Step 3: Deploy on Vercel (free hosting)
1. Go to vercel.com and sign up using your GitHub account
2. Click "Add New Project" and select the repository you just created
3. Before clicking deploy, look for "Environment Variables" — add one:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste the key from Step 1)
4. Click Deploy

Vercel will give you a live link like `shop-post-generator.vercel.app` — that's your real, working website. Anyone with that link can use it on their phone or computer, no app store involved.

## Step 4: Test it
Open your new link, fill in a fake business, and generate posts. If something breaks, the error message on screen will tell you what went wrong — most first-time issues are a missing or incorrectly pasted API key.

## What changed from the version you tested in chat
- **Better prompt**: explicit instructions to avoid generic marketing phrases, force each of the 3 posts to take a genuinely different angle, and ground hooks in specific concrete details instead of vague claims
- **Saved profile**: business name and type are remembered on your device after your first generation, so you don't retype them every time
- **Real backend**: your API key is never visible to anyone visiting the site — it lives only on Vercel's server

## What's still worth adding later
- A way to save multiple past generations so you can revisit old posts
- Letting the shop owner save a short "brand voice" note (e.g. "we're playful, use a lot of exclamation") that gets included in every prompt automatically
- A simple password or login if you don't want it fully public

Once it's live, send me the link and I can help you keep improving it.
