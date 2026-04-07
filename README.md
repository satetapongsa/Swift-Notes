# 🛡️ Swiftnote - Premium AI-Powered Collaboration Notes

**Swiftnote** เป็นแอปพลิเคชันจดบันทึกระดับพรีเมียมที่รวบรวมพลังของ **AI**, การทำงานร่วมกันแบบ **Real-time Collaboration**, และความปลอดภัยระดับสูงเข้าไว้ด้วยกัน บนดีไซน์ที่ลื่นไหลสไตล์ iOS ครับ

---

## ✨ Features เด่นในแอป

- 🤖 **AI Assistant:** ใช้ปัญญาประดิษฐ์ช่วยสรุปเนื้อหาและต่อยอดไอเดียจากโน้ตของคุณ
- 👥 **Real-time Collaboration:** สร้าง Workspace ร่วมกับเพื่อนๆ เชิญสมาชิก และทำงานร่วมกันในพื้นที่แชร์
- 🗑️ **iOS-Style Swipe to Delete:** เลื่อน Card เพื่อลบไฟล์ด้วยความลื่นไหลระดับ Native และแถบสีแดง iOS Style
- ♻️ **Smart Trash Bin:** ระบบถังขยะที่กู้คืนไฟล์ได้ และมีการป้องกันด้วยพาสเวิร์ดก่อนลบถาวร
- 🔐 **Secure Passlock:** ระบบล็อกแอปด้วย Passcode และ Biometric ที่จดจำการตั้งค่าถาวรแม้เปลี่ยนธีมสี
- 🌗 **Dark Mode Support:** รองรับทั้งโหมดมืดและโหมดสว่าง ปรับเปลี่ยนได้ทันทีในหน้าตั้งค่า

---

## 🚀 วิธีการติดตั้งและเริ่มต้นใช้งาน (Installation)

### 1. ความต้องการเบื้องต้น (Prerequisites)
- [Node.js](https://nodejs.org/) (แนะนำ LTS)
- [Android Studio](https://developer.android.com/studio) (พร้อมลง Android SDK และ Emulator)
- Java Development Kit (JDK) 17+

### 2. การติดตั้ง Library ทั้งหมด
เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วรันคำสั่ง:
```bash
npm install
```

### 3. เริ่มต้นใช้งาน (Start the App)
คุณต้องเปิด **2 Terminal** พร้อมกันครับ:

**Terminal 1: รัน Metro Bundler (Core)**
```bash
npx react-native start --reset-cache
```

**Terminal 2: ติดตั้งและเปิดแอปบน Android Emulator**
```bash
npx react-native run-android
```

---

## 🛠️ วิธีแก้ปัญหาเบื้องต้น (Troubleshooting)

หากพบปัญหา **Build Error** หรือแอป **ค้าง/ไม่โหลด**:

**วิธีล้างไฟล์ขยะและรันใหม่ (Clean Build):**
```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
npx react-native run-android
```

---

## 📦 Tech Stack
- **Framework:** React Native
- **Styling:** Custom Design System (Vanilla CSS implementation)
- **Gestures:** React Native Gesture Handler & Reanimated
- **Icons:** Lucide React Native
- **Storage:** AsyncStorage

---

**พัฒนาโดย:** [satetapongsa](https://github.com/satetapongsa)  
*โปรดให้คะแนน (Star) หากคุณชอบโปรเจกต์นี้!* ⭐
