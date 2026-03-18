#!/usr/bin/env node

/**
 * Instagram Publisher Skill
 * Publica carrosséis no Instagram via Graph API
 */

import fetch from 'node:fetch';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);

// Usage: node publish.js --images="img1.jpg,img2.jpg" --caption="Meu carrossel"

const CONFIG = {
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  instagramUserId: process.env.INSTAGRAM_USER_ID,
  imgbbApiKey: process.env.IMGBB_API_KEY
};

async function main() {
  const images = args.find(a => a.startsWith('--images='))?.split('=')[1]?.split(',') || [];
  const caption = args.find(a => a.startsWith('--caption='))?.split('=')[1] || '';
  const dryRun = args.includes('--dry-run');

  if (images.length === 0) {
    console.log('Usage: node publish.js --images="img1.jpg,img2.jpg" --caption="Texto" [--dry-run]');
    process.exit(1);
  }

  console.log(`📸 Publicando ${images.length} imagens no Instagram...`);

  if (dryRun) {
    console.log('🔍 Modo DRY RUN - nenhuma publicação real');
  }

  try {
    // 1. Upload imagens para imgbb
    const imageUrls = [];
    for (const img of images) {
      console.log(`   📤 Fazendo upload: ${img}`);
      const url = await uploadToImgbb(img);
      imageUrls.push(url);
    }

    if (dryRun) {
      console.log('✅ Dry run completo!');
      return;
    }

    // 2. Criar containers de mídia
    const containerIds = [];
    for (let i = 0; i < imageUrls.length; i++) {
      console.log(`   📦 Criando container ${i + 1}/${imageUrls.length}`);
      const id = await createMediaContainer(imageUrls[i], i === 0 ? caption : '', i + 1);
      containerIds.push(id);
    }

    // 3. Publicar carrossel
    console.log('   🚀 Publicando carrossel...');
    const result = await publishCarousel(containerIds);

    console.log(`
✅ Sucesso!
📎 URL: ${result.permalink}
🆔 ID: ${result.id}
`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

async function uploadToImgbb(imagePath) {
  if (!CONFIG.imgbbApiKey) {
    throw new Error('IMGBB_API_KEY não configurado');
  }

  const imageData = readFileSync(imagePath);
  const base64 = imageData.toString('base64');

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${CONFIG.imgbbApiKey}`, {
    method: 'POST',
    body: new URLSearchParams({
      image: base64,
      name: imagePath.split('/').pop()
    })
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error('Falha no upload para imgbb');
  }

  return data.data.url;
}

async function createMediaContainer(imageUrl, caption, position) {
  const endpoint = `https://graph.facebook.com/v18.0/${CONFIG.instagramUserId}/media`;
  
  const params = new URLSearchParams({
    access_token: CONFIG.instagramAccessToken,
    image_url: imageUrl,
    caption: caption,
    is_carousel_item: 'true',
    carousel_id: '' // Será atualizado
  });

  if (position === 1) {
    // Primeiro item = criar carousel
    params.append('media_type', 'CAROUSEL');
  }

  const response = await fetch(endpoint, { method: 'POST', body: params });
  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.id;
}

async function publishCarousel(containerIds) {
  // Agrupar em carousel
  const carouselParams = new URLSearchParams({
    access_token: CONFIG.instagramAccessToken,
    media_type: 'CAROUSEL',
    caption: 'Publicação via OpenClawSquad',
    children: containerIds.join(',')
  });

  const createResponse = await fetch(
    `https://graph.facebook.com/v18.0/${CONFIG.instagramUserId}/media`,
    { method: 'POST', body: carouselParams }
  );

  const carouselData = await createResponse.json();

  // Publicar
  const publishParams = new URLSearchParams({
    access_token: CONFIG.instagramAccessToken,
    creation_id: carouselData.id
  });

  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/${CONFIG.instagramUserId}/media_publish`,
    { method: 'POST', body: publishParams }
  );

  return await publishResponse.json();
}

main();
