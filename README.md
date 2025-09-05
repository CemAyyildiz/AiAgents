# AI Agents Platform - Rise Network Testnet

Bu proje, kullanıcıların AI agent'larını oluşturup eğitebileceği bir web platformudur. Rise Network testnet üzerinde çalışacak şekilde tasarlanmıştır.

## 🚀 Özellikler

- **Agent Oluşturma**: Basit form ile AI agent'ları oluşturun
- **Dosya Yükleme**: PDF, TXT, DOC gibi dosyaları yükleyerek agent'ları eğitin
- **İnteraktif Sohbet**: Oluşturduğunuz agent'larla gerçek zamanlı sohbet edin
- **Araç Entegrasyonu**: Web arama, fonksiyon çağırma gibi araçları kullanın
- **Modern UI**: Tailwind CSS ile tasarlanmış responsive arayüz
- **Rise Network**: Testnet üzerinde çalışır

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI Agents SDK (simulated)
- **Icons**: Lucide React
- **Deployment**: Rise Network Testnet

## 📦 Kurulum

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Çevre değişkenlerini ayarlayın:**
   ```bash
   # .env.local dosyası oluşturun
   touch .env.local
   ```
   
   `.env.local` dosyasını düzenleyin:
   ```env
   # OpenAI API Key (ZORUNLU - Gerçek AI yanıtları için)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Uygulama Ayarları
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Rise Network Ayarları (Testnet)
   RISE_NETWORK_URL=https://testnet.rise.network
   RISE_API_KEY=your_rise_api_key_here
   ```

   **Önemli:** OpenAI API key'i olmadan agent'lar sadece simüle edilmiş yanıtlar verecektir. Gerçek AI yanıtları için OpenAI API key'i gereklidir.

3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcıda açın:**
   ```
   http://localhost:3000
   ```

## 🏗️ Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── agents/        # Agent API endpoints
│   ├── agents/            # Agent pages
│   ├── create/            # Agent creation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
├── public/               # Static assets
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 API Endpoints

### Agents
- `GET /api/agents` - Tüm agent'ları listele
- `POST /api/agents` - Yeni agent oluştur
- `GET /api/agents/[id]` - Belirli agent'ı getir
- `DELETE /api/agents/[id]` - Agent'ı sil

### Chat
- `GET /api/agents/[id]/chat` - Sohbet geçmişini getir
- `POST /api/agents/[id]/chat` - Mesaj gönder

## 🎯 Kullanım

1. **Ana Sayfa**: Tüm agent'larınızı görüntüleyin ve OpenAI API durumunu kontrol edin
2. **Agent Oluştur**: Yeni agent oluşturmak için formu doldurun
3. **Dosya Yükle**: Eğitim dosyası yükleyin (opsiyonel)
4. **Araçları Seç**: Agent'ın kullanabileceği araçları belirleyin
5. **Sohbet Et**: Oluşturduğunuz agent ile sohbet edin
6. **Ayarları Düzenle**: Agent ayarlarını güncelleyin

## 🤖 AI Yanıtları

### OpenAI API Key ile (Önerilen)
- Agent'lar gerçek AI yanıtları verir
- Kendi kişilikleri ve uzmanlık alanları doğrultusunda yanıt verir
- Dosya içeriğini analiz edebilir
- Bağlamsal sohbet yapabilir

### API Key olmadan (Fallback Mode)
- Simüle edilmiş yanıtlar verir
- Temel işlevsellik çalışır
- Test amaçlı kullanım için uygun

## 🌐 Rise Network Testnet

Bu platform Rise Network testnet üzerinde çalışacak şekilde tasarlanmıştır:

- **Testnet URL**: https://testnet.rise.network
- **Blockchain Integration**: Rise Network API'leri kullanılabilir
- **Smart Contracts**: Gelecekte akıllı sözleşme entegrasyonu planlanmaktadır

## 🚀 Deployment

### Rise Network Testnet'e Deploy

1. **Build oluşturun:**
   ```bash
   npm run build
   ```

2. **Rise Network'e deploy edin:**
   ```bash
   # Rise Network CLI kullanarak
   rise deploy
   ```

3. **Çevre değişkenlerini ayarlayın:**
   - Rise Network dashboard'unda environment variables'ları yapılandırın
   - OpenAI API key'inizi ekleyin

## 🔒 Güvenlik

- API key'ler environment variables'da saklanır
- File upload'lar güvenli şekilde işlenir
- Input validation tüm formlarda uygulanır
- CORS ayarları yapılandırılmıştır

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Proje**: AI Agents Platform
- **Network**: Rise Network Testnet
- **GitHub**: [Repository URL]

---

**Not**: Bu proje Rise Network testnet üzerinde çalışmak üzere tasarlanmıştır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.
