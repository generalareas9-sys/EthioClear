const fs = require('fs');
const path = require('path');
const os = require('os');
const certificateService = require('../services/certificate.service');
const pdfService = require('../services/pdf.service');
const { generateCertificatePdf, PROTOTYPE_NOTICE } = require('../utils/certificate.pdf');
const qrcode = require('qrcode');

describe('Certificate Services & PDF Generator Unit Tests', () => {
  describe('Verification Code & Certificate Number Generation', () => {
    it('generates a valid verification code with expected prefix and character set', () => {
      const code = certificateService.generateVerificationCode();
      expect(code).toMatch(/^ECL-VFY-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{10}$/);
    });

    it('generates distinct verification codes across successive calls', () => {
      const code1 = certificateService.generateVerificationCode();
      const code2 = certificateService.generateVerificationCode();
      expect(code1).not.toBe(code2);
    });

    it('generates certificate numbers in ECL-YYYY-XXXXXXXX format', () => {
      const certNo = certificateService.generateCertificateNumber();
      const year = new Date().getFullYear();
      expect(certNo).toMatch(new RegExp(`^ECL-${year}-[0-9A-F]{8}$`));
    });

    it('builds verification URL using the configured verification base URL', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const url = certificateService.buildVerificationUrl(id);
      expect(url).toContain(id);
      expect(url).not.toContain('//verify');
    });
  });

  describe('PDF Generator & Academic Prototype Notice', () => {
    it('exports the required PROTOTYPE_NOTICE from both pdf.service and utils/certificate.pdf', () => {
      const expectedNotice = 'PROTOTYPE CERTIFICATE — FOR DEMONSTRATION PURPOSES ONLY — NOT A LEGAL DOCUMENT';
      expect(PROTOTYPE_NOTICE).toBe(expectedNotice);
      expect(pdfService.PROTOTYPE_NOTICE).toBe(expectedNotice);
    });

    it('generates a valid PDF with all metadata, QR code, and Ethiopic text', async () => {
      const tmpDir = os.tmpdir();
      const outPath = path.join(tmpDir, `test-cert-${Date.now()}.pdf`);
      const qrPng = await qrcode.toBuffer('https://ethio-clear-3yxy.vercel.app/verify/test-id');

      await expect(
        pdfService.generateCertificatePdf({
          outputPath: outPath,
          certificateNumber: 'ECL-2026-TEST0001',
          applicantName: 'አበበ በቂላ',
          purpose: 'Employment Background Check',
          issuedAt: new Date(),
          qrCodePng: qrPng,
          verificationCode: 'ECL-VFY-ABC1234XYZ',
          verificationUrl: 'https://ethio-clear-3yxy.vercel.app/verify/test-id',
          officerName: 'Officer Teshome',
        })
      ).resolves.toBeUndefined();

      expect(fs.existsSync(outPath)).toBe(true);
      const stat = fs.statSync(outPath);
      expect(stat.size).toBeGreaterThan(1000);

      // Clean up
      fs.unlinkSync(outPath);
    });

    it('generates a valid PDF when optional fields are omitted (backward compatibility)', async () => {
      const tmpDir = os.tmpdir();
      const outPath = path.join(tmpDir, `test-cert-compat-${Date.now()}.pdf`);
      const qrPng = await qrcode.toBuffer('https://ethio-clear-3yxy.vercel.app/verify/test-id-2');

      await expect(
        pdfService.generateCertificatePdf({
          outputPath: outPath,
          certificateNumber: 'ECL-2026-TEST0002',
          applicantName: 'John Doe',
          purpose: 'Academic Prototype Demo',
          issuedAt: new Date(),
          qrCodePng: qrPng,
        })
      ).resolves.toBeUndefined();

      expect(fs.existsSync(outPath)).toBe(true);
      fs.unlinkSync(outPath);
    });
  });
});
