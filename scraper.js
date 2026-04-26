const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs'); // เพิ่มเครื่องมือสำหรับสร้างไฟล์

async function scrapeERCFt() {
    try {
        const url = 'https://www.erc.or.th/th/automatic/';
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const latestRow = $('table tbody tr').first();
        const rawFtText = latestRow.find('td').eq(1).text().trim(); 

        // แปลงเป็นบาท และตัดเศษทศนิยมให้เหลือแค่ 4 ตำแหน่งสวยๆ
        const ftInBaht = Number((parseFloat(rawFtText) / 100).toFixed(4));

        console.log(`รอบล่าสุด: ค่า Ft คือ ${rawFtText} สตางค์ (${ftInBaht} บาท/หน่วย)`);
        
        // -----------------------------------------
        // ส่วนที่เพิ่มเข้ามา: สร้างและเซฟไฟล์ JSON
        // -----------------------------------------
        const dataToSave = {
            ft_rate: ftInBaht,
            unit: "THB",
            updated_at: new Date().toISOString() // เก็บเวลาที่ดึงข้อมูลไว้ด้วย
        };

        // สร้างไฟล์ชื่อ ft-rate.json ไว้ที่หน้า Desktop ของคุณ
        fs.writeFileSync('ft-rate.json', JSON.stringify(dataToSave, null, 2));
        
        console.log("✅ บันทึกไฟล์ ft-rate.json สำเร็จแล้ว! ลองเช็คที่หน้า Desktop ดูครับ");

    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error.message);
    }
}

scrapeERCFt();