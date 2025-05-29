# NewSahin – Gazete Tarzı Haber Uygulaması 📜

Bu proje, GoIT JavaScript eğitimi kapsamında geliştirdiğim haber uygulamasıdır. Amaç, modern JavaScript (ES6+) kullanarak bir haber portalı oluşturmak ve NewsAPI'den veri çekerek dinamik içerik göstermektir.

## 🎯 Projenin Amacı

- API kullanarak veri çekme (asenkron işlemlerle)
- Dinamik HTML oluşturma
- Tema geçişi (gece/gündüz)
- Pagination (sayfalama) yapısını kurma
- Ülke ve kategoriye göre filtreleme
- Gazete benzeri düzen ve stil kazandırmak

## 💪 Kullandığım Teknolojiler ve Nedenleri

| Teknoloji                   | Açıklama                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Vite**                    | Projeyi hızlı kurmak ve geliştirme ortamı sağlamak için kullandım. Webpack'e göre daha hızlı.                   |
| **Vanilla JS**              | Temel JavaScript yeteneklerimi geliştirmek amacıyla framework kullanmadan yazdım.                               |
| **Fetch API & async/await** | NewsAPI'den veri çekmek için modern JS yöntemlerini kullandım.                                                  |
| **NewsAPI**                 | Güncel haber verilerini almak için kullanılan ücretsiz bir API.                                                 |
| **Modüler JS yapısı**       | `main.js` dosyasıyla kodun okunabilirliğini artırdım.                                                           |
| **Responsive CSS**          | Mobil uyumlu bir tasarım oluşturmak için flex, grid ve medya sorguları kullandım.                               |
| **Dark Mode**               | Kullanıcı deneyimini artırmak için gece/gündüz tema geçişi yaptım. localStorage ile tema kalıcılığını sağladım. |

## ⚙️ Uygulama Özellikleri

- ✅ Haberleri ülke ve kategoriye göre filtreleme
- ✅ Sayfalama (butonları)
- ✅ En güncel haberden en eskiye sıralama
- ✅ Top-headlines boşsa everything ile yedek sorgu
- ✅ Gece/gündüz teması (localStorage ile kalıcı)
- ✅ Responsive (mobil uyumlu) gazete stili tasarım

## 📌 Öğrendiklerim

- Asenkron veri çekimi (`fetch`, `async/await`)
- Kullanıcı arayüzü oluşturma ve güncelleme
- Modüler JavaScript kullanımı
- API verisini kontrol etme ve hata yönetimi
- Tema geçişi ve localStorage kullanımı
- Sayfalama mantığı kurma ve state yönetimi

## 📄 Lisans

Bu proje bireysel öğrenim ve portföy amacıyla geliştirilmiştir.
