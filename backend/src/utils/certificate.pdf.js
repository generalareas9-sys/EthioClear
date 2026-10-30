/**
 * certificate.pdf.js — EthioClear certificate design (A4 portrait, PDFKit).
 * Drop-in replacement for generateCertificatePdf. Same required params as before;
 * new optional params: verificationCode, verificationUrl, applicantId, officerName.
 * Prototype only: no government seals/emblems, clearly marked academic prototype.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const FONT_DIR = path.join(__dirname, '..', '..', 'assets', 'fonts');
const C = {
  navy: '#0B2A6F',
  blue: '#1E6FE8',
  gold: '#C9A227',
  green: '#0E8A3E',
  yellow: '#FCCB0B',
  red: '#E11D1D',
  ink: '#0F172A',
  slate: '#475569',
  cream: '#FFFDF7',
  line: '#CBD5E1',
};

const PROTOTYPE_NOTICE = 'PROTOTYPE CERTIFICATE — FOR DEMONSTRATION PURPOSES ONLY — NOT A LEGAL DOCUMENT';

function registerFonts(doc) {
  const f = (n) => path.join(FONT_DIR, n);
  const registeredFonts = new Set();
  const fontMap = {
    'Serif-Bold': { file: 'playfair-display-latin-700-normal.woff', fallback: 'Times-Bold' },
    'Serif-XBold': { file: 'playfair-display-latin-800-normal.woff', fallback: 'Times-Bold' },
    'Sans': { file: 'outfit-latin-400-normal.woff', fallback: 'Helvetica' },
    'Sans-Med': { file: 'outfit-latin-500-normal.woff', fallback: 'Helvetica' },
    'Sans-Semi': { file: 'outfit-latin-600-normal.woff', fallback: 'Helvetica-Bold' },
    'Sans-Bold': { file: 'outfit-latin-700-normal.woff', fallback: 'Helvetica-Bold' },
    'Ethiopic': { file: 'noto-sans-ethiopic-ethiopic-400-normal.woff', fallback: 'Helvetica' },
    'Ethiopic-Bold': { file: 'noto-sans-ethiopic-ethiopic-700-normal.woff', fallback: 'Helvetica-Bold' },
  };

  for (const [name, cfg] of Object.entries(fontMap)) {
    const fullPath = f(cfg.file);
    if (fs.existsSync(fullPath)) {
      try {
        doc.registerFont(name, fullPath);
        registeredFonts.add(name);
      } catch (err) {
        console.warn(`[WARN] Failed to register font ${name} (${cfg.file}):`, err.message);
      }
    } else {
      console.warn(`[WARN] Font file missing: ${fullPath}. Falling back to ${cfg.fallback}.`);
    }
  }

  // Intercept doc.font so missing fonts fall back safely without crashing PDFKit
  const origFont = doc.font.bind(doc);
  doc.font = function (name, ...args) {
    if (
      name &&
      !registeredFonts.has(name) &&
      !['Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Times-Roman', 'Times-Bold', 'Courier'].includes(name)
    ) {
      const fallback = name.includes('Bold') || name.includes('Semi') ? 'Helvetica-Bold' : 'Helvetica';
      return origFont(fallback, ...args);
    }
    return origFont(name, ...args);
  };
}

const hasEthiopic = (s) => /[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/.test(s || '');
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function ribbonLogo(doc, x, y, s) {
  // original EthioClear symbol, vector
  doc.save().translate(x, y).scale(s);
  doc.path('M40 150 C20 250 110 330 235 372 C150 330 70 270 78 150 Z').fill(C.red);
  doc.path('M52 140 C38 235 125 310 235 358 C150 310 88 250 92 140 Z').fill(C.yellow);
  doc.path('M66 128 C56 215 140 290 235 342 C160 290 106 235 106 128 Z').fill(C.green);
  doc.path('M100 40 H210 L262 92 V270 a14 14 0 0 1 -14 14 H114 a14 14 0 0 1 -14 -14 Z').fill(C.navy);
  doc.path('M114 56 H198 L248 106 V262 H114 Z').fill('#fff');
  doc.path('M198 56 L248 106 H212 a14 14 0 0 1 -14 -14 Z').fill(C.blue);
  [[120, 82], [150, 96], [180, 60]].forEach(([yy, w]) =>
    doc.roundedRect(132, yy, w, 13, 6.5).fill(C.navy)
  );
  doc.path('M222 196 L282 214 V272 C282 306 256 330 222 346 C188 330 162 306 162 272 V214 Z').fill('#fff');
  doc.path('M222 205 L272 220 V272 C272 299 250 320 222 334 C194 320 172 299 172 272 V220 Z').fill(C.blue);
  doc.path('M200 270 L217 287 L246 253').lineWidth(12).lineCap('round').lineJoin('round').stroke('#fff');
  doc.restore();
}

function cornerMotif(doc, x, y, sx, sy) {
  // geometric corner ornament
  doc.save().translate(x, y).scale(sx, sy);
  doc.lineWidth(1.2).strokeColor(C.gold);
  doc.moveTo(0, 38).lineTo(0, 0).lineTo(38, 0).stroke();
  doc.moveTo(8, 30).lineTo(8, 8).lineTo(30, 8).stroke();
  doc.rect(14, 14, 7, 7).fill(C.gold);
  doc.rect(26, 14, 4, 4).fill(C.green);
  doc.rect(14, 26, 4, 4).fill(C.red);
  doc.restore();
}

function generateCertificatePdf({
  outputPath,
  certificateNumber,
  applicantName,
  purpose,
  issuedAt,
  qrCodePng,
  verificationCode,
  verificationUrl,
  officerName,
}) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0,
        info: {
          Title: `EthioClear Certificate ${certificateNumber}`,
          Author: 'EthioClear (Academic Prototype)',
        },
      });

      registerFonts(doc);
      const out = fs.createWriteStream(outputPath);
      doc.pipe(out);
      out.on('finish', resolve);
      out.on('error', reject);
      doc.on('error', reject);

      const W = doc.page.width; // 595.28 pt
      const H = doc.page.height; // 841.89 pt

      // Background + borders
      doc.rect(0, 0, W, H).fill(C.cream);

      // Top prototype notice banner (unmistakable academic prototype disclaimer)
      doc.rect(0, 0, W, 22).fill('#B91C1C');
      doc
        .font('Sans-Bold')
        .fontSize(7.5)
        .fillColor('#FFFFFF')
        .text(PROTOTYPE_NOTICE, 0, 7, {
          width: W,
          align: 'center',
          characterSpacing: 0.8,
        });

      doc.rect(22, 22, W - 44, H - 44).lineWidth(2).stroke(C.navy);
      doc.rect(30, 30, W - 60, H - 60).lineWidth(0.8).stroke(C.gold);
      cornerMotif(doc, 36, 36, 1, 1);
      cornerMotif(doc, W - 36, 36, -1, 1);
      cornerMotif(doc, 36, H - 36, 1, -1);
      cornerMotif(doc, W - 36, H - 36, -1, -1);

      // Watermark
      doc
        .save()
        .rotate(-32, { origin: [W / 2, H / 2] })
        .fillColor(C.navy)
        .fillOpacity(0.04)
        .font('Serif-XBold')
        .fontSize(78)
        .text('ETHIOCLEAR', -60, H / 2 - 40, {
          width: W + 120,
          align: 'center',
          lineBreak: false,
        })
        .restore();
      doc.fillOpacity(1);

      // Header
      ribbonLogo(doc, W / 2 - 128, 56, 0.2);
      doc
        .font('Sans-Bold')
        .fontSize(30)
        .fillColor(C.navy)
        .text('Ethio', W / 2 - 62, 62, { continued: true })
        .fillColor(C.blue)
        .text('Clear');
      doc
        .font('Sans-Med')
        .fontSize(7.5)
        .fillColor(C.slate)
        .text('CERTIFICATE SYSTEM', W / 2 - 60, 98, { characterSpacing: 2.4 });

      // Tricolor rule
      const rx = W / 2 - 90;
      doc
        .rect(rx, 124, 60, 2.5)
        .fill(C.green)
        .rect(rx + 60, 124, 60, 2.5)
        .fill(C.yellow)
        .rect(rx + 120, 124, 60, 2.5)
        .fill(C.red);

      doc
        .font('Serif-XBold')
        .fontSize(27)
        .fillColor(C.navy)
        .text('CRIMINAL RECORD CERTIFICATE', 0, 144, {
          width: W,
          align: 'center',
          characterSpacing: 1,
        });

      doc
        .font('Sans-Med')
        .fontSize(9.5)
        .fillColor(C.gold)
        .text('UNIVERSITY GRADUATION PROJECT  •  ACADEMIC PROTOTYPE', 0, 182, {
          width: W,
          align: 'center',
          characterSpacing: 1.6,
        });

      // Certificate number pill
      doc.roundedRect(W / 2 - 110, 208, 220, 34, 17).lineWidth(1).fillAndStroke('#FFFFFF', C.navy);
      doc
        .font('Sans')
        .fontSize(8)
        .fillColor(C.slate)
        .text('CERTIFICATE NO.', 0, 214, { width: W, align: 'center', characterSpacing: 1.4 });
      doc
        .font('Sans-Bold')
        .fontSize(13)
        .fillColor(C.navy)
        .text(certificateNumber, 0, 225, { width: W, align: 'center', characterSpacing: 1 });

      // Recipient
      doc
        .font('Sans')
        .fontSize(10)
        .fillColor(C.slate)
        .text('THIS CERTIFICATE IS ISSUED TO', 0, 274, {
          width: W,
          align: 'center',
          characterSpacing: 2,
        });

      const name = String(applicantName || '').toUpperCase();
      const nameFont = hasEthiopic(name) ? 'Ethiopic-Bold' : 'Serif-Bold';
      let fs1 = 34;
      doc.font(nameFont);
      while (fs1 > 18 && doc.fontSize(fs1).widthOfString(name) > W - 150) {
        fs1 -= 1;
      }
      doc.font(nameFont).fontSize(fs1).fillColor(C.ink).text(name, 60, 298, {
        width: W - 120,
        align: 'center',
      });
      doc.moveTo(W / 2 - 130, 344).lineTo(W / 2 + 130, 344).lineWidth(1).stroke(C.gold);

      // Body text
      doc
        .font('Sans')
        .fontSize(11)
        .fillColor(C.slate)
        .text(
          'This certificate confirms that the criminal record certificate application submitted through EthioClear ' +
            'has been reviewed and processed according to the workflow defined for this university academic prototype.',
          90,
          362,
          { width: W - 180, align: 'center', lineGap: 3 }
        );

      // Details grid
      const gy = 418;
      const gx = 90;
      const gw = W - 180;
      doc.roundedRect(gx, gy, gw, 70, 8).lineWidth(0.8).fillAndStroke('#FFFFFF', C.line);

      const cell = (label, value, cx, cw) => {
        doc
          .font('Sans')
          .fontSize(8)
          .fillColor(C.slate)
          .text(label, cx, gy + 16, { width: cw, align: 'center', characterSpacing: 1.4 });
        doc
          .font(hasEthiopic(value) ? 'Ethiopic-Bold' : 'Sans-Semi')
          .fontSize(12.5)
          .fillColor(C.navy)
          .text(value, cx, gy + 33, { width: cw, align: 'center' });
      };

      cell('PURPOSE', String(purpose || '—'), gx, gw / 2);
      cell('DATE ISSUED', fmtDate(issuedAt || new Date()), gx + gw / 2, gw / 2);
      doc.moveTo(gx + gw / 2, gy + 14).lineTo(gx + gw / 2, gy + 56).lineWidth(0.8).stroke(C.line);

      // Signatures
      const sy = 535;
      [
        [110, 'Verification Officer', officerName],
        [W - 110 - 170, 'Authorized Administrator', null],
      ].forEach(([x, role, nm]) => {
        doc.moveTo(x, sy + 30).lineTo(x + 170, sy + 30).lineWidth(0.9).stroke(C.navy);
        doc.font('Sans-Semi').fontSize(10).fillColor(C.navy).text(role, x, sy + 36, { width: 170, align: 'center' });
        doc.font('Sans').fontSize(8.5).fillColor(C.slate).text(nm || 'EthioClear • Academic Prototype', x, sy + 50, {
          width: 170,
          align: 'center',
        });
      });

      // Verification panel
      const vy = 622;
      const vh = 122;
      doc.roundedRect(60, vy, W - 120, vh, 10).lineWidth(1.2).fillAndStroke('#F3F7FF', C.navy);
      doc.rect(60, vy + 14, 4, vh - 28).fill(C.gold);
      doc
        .font('Sans-Bold')
        .fontSize(11)
        .fillColor(C.navy)
        .text('CERTIFICATE VERIFICATION', 80, vy + 14, { characterSpacing: 1.4 });

      let ty = vy + 32;
      const line = (label, value, mono) => {
        doc.font('Sans').fontSize(8).fillColor(C.slate).text(label, 80, ty, { characterSpacing: 1 });
        doc
          .font('Sans-Semi')
          .fontSize(mono ? 12 : 8.5)
          .fillColor(C.ink)
          .text(value, 80, ty + 10, {
            width: W - 120 - 20 - 120,
            characterSpacing: mono ? 1.2 : 0,
          });
        ty += mono ? 29 : 26;
      };

      line('CERTIFICATE NUMBER', certificateNumber, true);
      if (verificationCode) line('VERIFICATION CODE', verificationCode, true);
      if (verificationUrl) line('VERIFICATION URL', verificationUrl, false);

      if (qrCodePng) {
        doc.roundedRect(W - 60 - 112, vy + 10, 98, 98, 6).fill('#FFFFFF');
        doc.image(qrCodePng, W - 60 - 107, vy + 15, { width: 88, height: 88 });
      }

      doc
        .font('Sans')
        .fontSize(8)
        .fillColor(C.slate)
        .text('Scan the QR code or visit the verification page to verify this certificate.', 60, vy + vh + 6, {
          width: W - 120,
          align: 'center',
        });

      // Footer
      doc
        .font('Sans-Semi')
        .fontSize(8.5)
        .fillColor(C.navy)
        .text('EthioClear — University Graduation Project', 0, H - 70, { width: W, align: 'center' });
      doc
        .font('Sans')
        .fontSize(7.5)
        .fillColor(C.slate)
        .text(
          `${PROTOTYPE_NOTICE}. This certificate is generated by EthioClear as part of a university academic prototype ` +
            'and is not an official government certificate.',
          70,
          H - 57,
          { width: W - 140, align: 'center' }
        );

      doc
        .rect(W / 2 - 45, H - 36, 30, 2)
        .fill(C.green)
        .rect(W / 2 - 15, H - 36, 30, 2)
        .fill(C.yellow)
        .rect(W / 2 + 15, H - 36, 30, 2)
        .fill(C.red);

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = { generateCertificatePdf, PROTOTYPE_NOTICE };
