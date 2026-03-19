# OpenClawSquad - Jan Integration

This workspace can use Jan (local AI) with OpenClawSquad.

## Setup

1. Install Jan: https://jan.ai
2. Start the Jan server
3. Configure OpenClawSquad to use Jan as the AI provider

## Configuration

Edit `.env`:
```
JAN_API_URL=http://localhost:1337
JAN_MODEL=llama-3.3-70b-instruct
```

## Usage

```bash
npx openclawsquad run my-squad --provider jan
```

## Learn More

https://github.com/jackchakkal/OpenClawSquad
