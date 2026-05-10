import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, Shield, Share2, Search, Trash2, Key, Globe } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page fade-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/settings')} className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0 }}>About Swift Notes</h1>
      </header>

      <section className="glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Zap size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Swift Notes v1.0</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>The fastest way to capture ideas.</p>
          </div>
        </div>
        <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          Swift Notes คือแอพจดบันทึกยุคใหม่ที่เน้นความเร็ว ความเรียบง่าย และความปลอดภัยสูงสุด ออกแบบมาเพื่อให้คุณจดบันทึกไอเดียได้ทันทีที่มันเกิดขึ้น พร้อมระบบการทำงานร่วมกันที่ทรงพลัง
        </p>
      </section>

      <h3 style={{ marginBottom: '16px', paddingLeft: '12px' }}>วิธีการใช้งาน (User Guide)</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="glass" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <Search size={20} color="var(--primary-color)" />
            <h4 style={{ margin: 0 }}>1. การจัดการโน้ต</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            คุณสามารถสร้างโน้ตใหม่ได้จากปุ่ม + และค้นหาโน้ตย้อนหลังได้จากช่อง Search ด้านบน โน้ตจะถูกบันทึกอัตโนมัติ (Auto-save) ทุกครั้งที่พิมพ์
          </p>
        </div>

        <div className="glass" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <Key size={20} color="#f59e0b" />
            <h4 style={{ margin: 0 }}>2. ระบบความปลอดภัย</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            ตั้งรหัสผ่าน 6 หลักได้ที่หน้า Settings เพื่อล็อกโน้ตส่วนตัว การกดล็อกหรือปลดล็อกโน้ตจะต้องใช้รหัสผ่านนี้เสมอ
          </p>
        </div>

        <div className="glass" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <Globe size={20} color="#6366f1" />
            <h4 style={{ margin: 0 }}>3. การทำงานร่วมกัน (Workspaces)</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            ไปที่เมนู Shared เพื่อสร้าง Workspace คุณสามารถดึงโน้ตหรือโฟลเดอร์ที่มีอยู่แล้วเข้ามาไว้ใน Workspace เพื่อเตรียมแชร์ให้เพื่อนร่วมงานได้
          </p>
        </div>

        <div className="glass" style={{ padding: '20px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
            <Trash2 size={20} color="#ef4444" />
            <h4 style={{ margin: 0 }}>4. การกู้คืนข้อมูล</h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            โน้ตที่ถูกลบจะไปอยู่ใน Trash ในหน้า Settings คุณสามารถกู้คืนกลับมาได้ตลอดเวลา หรือเลือกที่ลบถาวรเพื่อเพิ่มพื้นที่
          </p>
        </div>
      </div>

      <footer style={{ marginTop: '40px', textAlign: 'center', paddingBottom: '40px' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created with ❤️ by Swift Notes Team</p>
      </footer>
    </div>
  );
};

export default About;
