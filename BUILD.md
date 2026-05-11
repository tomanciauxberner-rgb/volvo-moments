# Build

## Install

  cd ~/Documents/chatbot/volvo-moments
  npm install
  npm run dev

Open http://localhost:3000

## Test flow

1. Page = clone Volvo EX30 fr-be (header, bandeau noir, hero EX30, 2 boutons pilule)
2. Sous les boutons, lien italique discret "Or — describe a moment..."
3. Click → overlay blanc plein écran fade in
4. Champ texte + 4 presets
5. Enter ou click preset → /moment/preview?text=... (stub session 2)

## Build & deploy

  npm run typecheck
  npm run build
  git init
  git add .
  git commit -m "session 1: volvo clone + AI overlay"
  git branch -M main
