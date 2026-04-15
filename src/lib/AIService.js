/**
 * AIService.js
 * จัดการการคุยกับ AI สำหรับสรุปโน้ตและแยกหัวข้อสำคัญ
 */

export const AIService = {
  /**
   * สรุปเนื้อหาโน้ต
   * @param {string} content เนื้อหาโน้ตทั้งหมด
   * @returns {Promise<{summary: string, topics: string[]}>}
   */
  summarizeNote: async (content) => {
    if (!content || content.length < 10) {
      throw new Error('เนื้อหาน้อยเกินไปสำหรับการสรุปครับ');
    }

    // ในขั้นตอนพัฒนา เราจะจำลองการตอบกลับของ AI (Mock AI)
    // แต่โครงสร้างนี้สามารถเปลี่ยนเป็นการเรียกใช้ Gemini หรือ OpenAI API ได้ทันที
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: "โน้ตชุดนี้กล่าวถึงประเด็นหลักเรื่องการวางแผนงานระดับทีมและการใช้เครื่องมือดิจิทัลช่วยในการประสานงาน",
          topics: [
            "การกำหนดเป้าหมายโครงการ (Project Goal)",
            "การเลือกเครื่องมือสื่อสารหลัก",
            "ตารางเวลาการตรวจเช็คงาน (Weekly Sync)"
          ]
        });
      }, 1500); // จำลองเวลาประมวลผล
    });
  }
};
