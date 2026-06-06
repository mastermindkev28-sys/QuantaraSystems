"""
Quantara Systems – Trade Log PDF Generator
Brand: deep black #070708, gold #F59E0B, silver metallic Q logo
"""

import math, csv
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, HRFlowable, Flowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# ── Brand Palette ─────────────────────────────────────────────────────────────
BLACK    = colors.HexColor("#070708")
CARD     = colors.HexColor("#0D0D0D")
CARD2    = colors.HexColor("#111114")
GOLD     = colors.HexColor("#F59E0B")
GOLD_LT  = colors.HexColor("#FCD34D")
GOLD_DK  = colors.HexColor("#D97706")
WHITE    = colors.HexColor("#FFFFFF")
GRAY_LT  = colors.HexColor("#E0E0E0")
GRAY_MD  = colors.HexColor("#C0C0C0")
GRAY_DK  = colors.HexColor("#606060")
BORDER   = colors.HexColor("#222228")
BORDER2  = colors.HexColor("#2A2A30")
GREEN    = colors.HexColor("#34D399")
RED      = colors.HexColor("#F87171")

SIL_LT   = colors.HexColor("#F0F0F0")   # silver light
SIL_MD   = colors.HexColor("#C0C0C8")   # silver mid
SIL_DK   = colors.HexColor("#808090")   # silver dark
SIL_XDK  = colors.HexColor("#505060")   # silver very dark


# ── Real Q-Mark Logo (bezier reconstruction) ──────────────────────────────────
class QMark(Flowable):
    """
    Reconstructed Quantara Systems logo:
      - Thick silver arc forming ~280° of a circle (open at lower-left)
      - Diagonal sweep/slash from lower-left to upper-right (the Q tail)
      - Fan of fine parallel lines inside-left
      - Short vertical stem inside at ~12 o'clock
    """
    def __init__(self, size=52):
        super().__init__()
        self.size = size
        self.width = size
        self.height = size

    def draw(self):
        c = self.canv
        s = self.size
        cx = s * 0.5
        cy = s * 0.5
        R = s * 0.40          # outer radius of ring
        r = s * 0.28          # inner radius of ring
        mid_r = (R + r) / 2   # midline of ring

        def pt(angle_deg, radius, ox=cx, oy=cy):
            a = math.radians(angle_deg)
            return ox + radius * math.cos(a), oy + radius * math.sin(a)

        # ── 1. Outer arc (ring body) ─────────────────────────────────────────
        # Arc from ~230° to ~30° clockwise (leaving gap at lower-left ~210°-230°)
        # Draw as thick stroke arc in silver
        stroke_w = R - r

        # Gradient effect: draw multiple arcs at slightly different grays
        # We layer from dark to light across the arc span
        segments = [
            (30, 100, SIL_DK),
            (100, 160, SIL_MD),
            (160, 220, SIL_LT),
            (220, 285, SIL_MD),
            (285, 360, SIL_DK),   # wraps: 285–360 = top-right going right
        ]
        # Actually draw a single smooth arc with multiple color bands
        for start_a, end_a, col in segments:
            c.setStrokeColor(col)
            c.setLineWidth(stroke_w)
            c.setLineCap(0)
            # arc from start_a to end_a (counter-clockwise in reportlab = positive angles)
            c.arc(cx - mid_r, cy - mid_r,
                  cx + mid_r, cy + mid_r,
                  startAng=start_a, extent=end_a - start_a)

        # Clean bright highlight on upper arc (~140°–200°)
        c.setStrokeColor(SIL_LT)
        c.setLineWidth(stroke_w * 0.35)
        c.arc(cx - mid_r, cy - mid_r,
              cx + mid_r, cy + mid_r,
              startAng=145, extent=55)

        # ── 2. Vertical stem inside (at ~90°, short bar) ────────────────────
        stem_x = cx + mid_r * math.cos(math.radians(88))
        stem_y_top = cy + mid_r * math.sin(math.radians(88)) - s * 0.06
        stem_y_bot = stem_y_top - s * 0.18
        c.setStrokeColor(SIL_MD)
        c.setLineWidth(s * 0.028)
        c.setLineCap(1)
        c.line(stem_x, stem_y_top, stem_x, stem_y_bot)

        # ── 3. Diagonal sweep (the Q-tail slash) ────────────────────────────
        # Goes from lower-left through center to upper-right
        # Main thick curve: start lower-left outside circle, curve through center,
        # exit upper-right past the ring
        sx1 = cx - R * 0.85
        sy1 = cy - R * 0.50
        sx4 = cx + R * 0.85
        sy4 = cy + R * 0.22

        # Bezier control points for a gentle S-curve
        sx2 = cx - R * 0.10
        sy2 = cy - R * 0.08
        sx3 = cx + R * 0.15
        sy3 = cy + R * 0.12

        # Draw the sweep as a thick graduated stroke
        for width, col in [(s*0.055, SIL_XDK), (s*0.042, SIL_DK),
                           (s*0.030, SIL_MD), (s*0.016, SIL_LT)]:
            c.setStrokeColor(col)
            c.setLineWidth(width)
            c.setLineCap(1)
            p = c.beginPath()
            p.moveTo(sx1, sy1)
            p.curveTo(sx2, sy2, sx3, sy3, sx4, sy4)
            c.drawPath(p, stroke=1, fill=0)

        # ── 4. Fan lines (speed lines from lower-left, fanning right) ───────
        # Origin at lower-left inside the circle
        fan_ox = cx - R * 0.72
        fan_oy = cy - R * 0.28
        fan_len_base = s * 0.52
        n_lines = 14
        angle_start = 12   # degrees from horizontal
        angle_end   = 44

        for i in range(n_lines):
            t = i / (n_lines - 1)
            angle = angle_start + t * (angle_end - angle_start)
            a = math.radians(angle)
            length = fan_len_base * (0.55 + 0.45 * (1 - t))

            ex = fan_ox + length * math.cos(a)
            ey = fan_oy + length * math.sin(a)

            alpha_gray = 0.25 + 0.50 * (1 - t)  # fade toward top lines
            gray_val = 0.55 + 0.25 * (1 - t)
            line_col = colors.Color(gray_val, gray_val, gray_val + 0.05)
            lw = max(0.25, s * 0.008 * (1 - t * 0.6))

            c.setStrokeColor(line_col)
            c.setLineWidth(lw)
            c.setLineCap(1)
            c.line(fan_ox, fan_oy, ex, ey)


# ── Background + footer on every page ─────────────────────────────────────────
def black_canvas(canvas, doc):
    canvas.saveState()
    W, H = doc.pagesize

    # Full black background
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)

    # Subtle gold radial glow top-left
    for i in range(4, 0, -1):
        c = colors.Color(0.96, 0.62, 0.04, alpha=0.010 * i)
        canvas.setFillColor(c)
        canvas.circle(72, H - 72, 180 * i, fill=1, stroke=0)

    # Footer strip
    canvas.setFillColor(colors.HexColor("#0A0A0C"))
    canvas.rect(0, 0, W, 22, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD_DK)
    canvas.setLineWidth(0.5)
    canvas.line(0, 22, W, 22)

    canvas.setFillColor(GRAY_DK)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(doc.leftMargin, 8,
        "QUANTARA SYSTEMS  ·  QS1  ·  CONFIDENTIAL — FOR AUTHORIZED USE ONLY")
    canvas.drawRightString(W - doc.rightMargin, 8,
        f"Page {canvas.getPageNumber()}  ·  quantarasystems.io")

    # Gold top hairline
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(0, H - 2, W, H - 2)

    canvas.restoreState()


# ── Paragraph helpers ──────────────────────────────────────────────────────────
def P(text, font="Helvetica", size=8, color=WHITE, align=TA_LEFT,
      leading=None, space_before=0, space_after=0):
    return Paragraph(text, ParagraphStyle("x",
        fontName=font, fontSize=size, textColor=color,
        alignment=align, leading=leading or size * 1.35,
        spaceBefore=space_before, spaceAfter=space_after, wordWrap="CJK"))

def gold(text, size=8, align=TA_LEFT, bold=False):
    return P(text, font="Helvetica-Bold" if bold else "Helvetica",
             size=size, color=GOLD, align=align)


# ── Stat summary bar ───────────────────────────────────────────────────────────
def stat_table(stats):
    data = [[
        [gold(v, size=13, bold=True, align=TA_CENTER),
         P(l, size=6, color=GRAY_DK, align=TA_CENTER)]
        for l, v in stats
    ]]
    cw = 682 / len(stats)
    t = Table(data, colWidths=[cw] * len(stats), rowHeights=[38])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(-1,-1), CARD2),
        ("BOX",        (0,0),(-1,-1), 0.5, BORDER2),
        ("INNERGRID",  (0,0),(-1,-1), 0.5, BORDER),
        ("VALIGN",     (0,0),(-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0),(-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ("LEFTPADDING",(0,0),(-1,-1), 6),
        ("RIGHTPADDING",(0,0),(-1,-1), 6),
    ]))
    return t


# ── LucidPro rules band ────────────────────────────────────────────────────────
def rules_table(rules):
    data = [[
        [gold(k, size=6, bold=True, align=TA_CENTER),
         P(v, size=8, color=WHITE, align=TA_CENTER)]
        for k, v in rules
    ]]
    cw = 682 / len(rules)
    t = Table(data, colWidths=[cw] * len(rules), rowHeights=[30])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0),(-1,-1), colors.HexColor("#0E0D07")),
        ("BOX",        (0,0),(-1,-1), 0.8, GOLD_DK),
        ("INNERGRID",  (0,0),(-1,-1), 0.4, BORDER),
        ("VALIGN",     (0,0),(-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 3),
        ("LEFTPADDING",(0,0),(-1,-1), 5),
        ("RIGHTPADDING",(0,0),(-1,-1), 5),
    ]))
    return t


# ── Trade table ────────────────────────────────────────────────────────────────
def trade_table(rows):
    col_w = [26, 26, 40, 36, 26, 50, 50, 34, 36, 46, 36, None]
    col_w[-1] = 682 - sum(col_w[:-1])

    headers = ["#","PER.","DATE","DIR","CTS","ENTRY","EXIT",
               "TICKS","DUR","NET P&L","OUT.","MACRO CONTEXT"]

    def cell(txt, color=GRAY_LT, size=7, align=TA_CENTER, bold=False):
        return Paragraph(txt, ParagraphStyle("c",
            fontName="Helvetica-Bold" if bold else "Helvetica",
            fontSize=size, textColor=color, alignment=align,
            leading=size*1.25, wordWrap="CJK"))

    period_bg = {
        "P1": colors.HexColor("#14110A"),
        "P2": colors.HexColor("#0C1414"),
        "P3": colors.HexColor("#13100A"),
        "P4": colors.HexColor("#0A0E14"),
        "P5": colors.HexColor("#12100A"),
        "P6": colors.HexColor("#0A130A"),
        "P7": colors.HexColor("#0F0F0A"),
        "P8": colors.HexColor("#0A0A13"),
    }

    data = [[cell(h, color=GRAY_DK, size=6.5, bold=True) for h in headers]]

    style = [
        ("BACKGROUND",    (0,0),(-1,0), colors.HexColor("#101014")),
        ("LINEBELOW",     (0,0),(-1,0), 1.0, GOLD_DK),
        ("BOX",           (0,0),(-1,-1), 0.5, BORDER2),
        ("INNERGRID",     (0,0),(-1,-1), 0.25, BORDER),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
        ("TOPPADDING",    (0,0),(-1,-1), 2),
        ("BOTTOMPADDING", (0,0),(-1,-1), 2),
        ("LEFTPADDING",   (0,0),(-1,-1), 3),
        ("RIGHTPADDING",  (0,0),(-1,-1), 3),
    ]

    for i, r in enumerate(rows):
        ri = i + 1
        period  = r.get("PERIOD", "")
        outcome = r.get("OUTCOME", "")
        dirn    = r.get("DIR", "")
        try:
            net = float(r.get("NET P&L", "0"))
        except:
            net = 0

        bg = period_bg.get(period, CARD)
        if i % 2 == 1:
            bg = colors.Color(bg.red, bg.green, bg.blue + 0.01)
        style.append(("BACKGROUND", (0,ri),(-1,ri), bg))

        dir_col = GREEN if dirn == "LONG" else RED
        out_col = GREEN if outcome == "WIN" else RED
        pnl_col = GREEN if net >= 0 else RED
        pnl_str = f"${abs(net):,.0f}" if net >= 0 else f"−${abs(net):,.0f}"

        data.append([
            cell(r.get("#",""),           color=GRAY_DK,  size=6.5),
            cell(period,                  color=GOLD,     size=7,   bold=True),
            cell(r.get("DATE",""),        color=GRAY_LT,  size=7),
            cell(dirn,                    color=dir_col,  size=7,   bold=True),
            cell(r.get("CTS",""),         color=WHITE,    size=7,   bold=True),
            cell(r.get("ENTRY",""),       color=GRAY_LT,  size=7),
            cell(r.get("EXIT",""),        color=GRAY_LT,  size=7),
            cell(r.get("TICKS",""),       color=GRAY_MD,  size=7),
            cell(r.get("DUR (m)",""),     color=GRAY_MD,  size=6.5),
            cell(pnl_str,                 color=pnl_col,  size=7,   bold=True),
            cell(outcome,                 color=out_col,  size=7,   bold=True),
            cell(r.get("MACRO CONTEXT",""), color=GRAY_MD, size=6.5, align=TA_LEFT),
        ])

    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle(style))
    return t


# ── CSV parser ─────────────────────────────────────────────────────────────────
def parse_csv(path):
    trades = []
    trade_on, hdr = False, None
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            joined = ",".join(row)
            if "#,PERIOD,DATE" in joined:
                trade_on = True
                hdr = [c.strip() for c in row]
                continue
            if "TOTAL" in joined and "TRADES" in joined:
                trade_on = False
                continue
            if trade_on and hdr and row and row[0].strip().isdigit():
                trades.append({hdr[i]: row[i].strip()
                               for i in range(min(len(hdr), len(row)))})
    return trades


# ── PDF builder ────────────────────────────────────────────────────────────────
def build_pdf(csv_path, out_path, acct_size):
    trades = parse_csv(csv_path)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=landscape(A4),
        leftMargin=16*mm, rightMargin=16*mm,
        topMargin=12*mm,  bottomMargin=10*mm,
        title=f"Quantara Systems · QS1 · MGC · ${acct_size} LucidPro",
        author="Quantara Systems",
    )

    story = []

    # ── Header row ─────────────────────────────────────────────────────────────
    header_data = [[
        QMark(52),
        [P("QUANTARA SYSTEMS", font="Helvetica-Bold", size=15, color=WHITE),
         P("QS1  ·  MGC MICRO GOLD FUTURES  ·  LUCIDPRO FUNDED  ·  MAR – MAY 2026",
           size=7.5, color=GRAY_MD)],
        [gold(f"${acct_size} ACCOUNT", size=17, bold=True, align=TA_RIGHT),
         P("LucidPro Funded  ·  90/10 Split", size=7, color=GRAY_MD, align=TA_RIGHT)],
    ]]
    ht = Table(header_data, colWidths=[62, 418, 202])
    ht.setStyle(TableStyle([
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
        ("LEFTPADDING",   (0,0),(-1,-1), 0),
        ("RIGHTPADDING",  (0,0),(-1,-1), 0),
        ("TOPPADDING",    (0,0),(-1,-1), 0),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0),
    ]))
    story.append(ht)
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD,
                            spaceBefore=7, spaceAfter=8))

    # ── Stats row ──────────────────────────────────────────────────────────────
    wins   = sum(1 for t in trades if t.get("OUTCOME") == "WIN")
    losses = sum(1 for t in trades if t.get("OUTCOME") == "LOSS")
    total  = len(trades)
    gross  = sum(float(t.get("NET P&L",0)) for t in trades)
    trader = gross * 0.9
    wps    = [float(t.get("NET P&L",0)) for t in trades if t.get("OUTCOME")=="WIN"]
    lps    = [float(t.get("NET P&L",0)) for t in trades if t.get("OUTCOME")=="LOSS"]
    avg_w  = sum(wps)/len(wps) if wps else 0
    avg_l  = sum(lps)/len(lps) if lps else 0
    win_pct= f"{wins/total*100:.1f}%" if total else "—"

    story.append(stat_table([
        ("TOTAL TRADES",     str(total)),
        ("WIN RATE",         win_pct),
        ("WINS / LOSSES",    f"{wins}W  /  {losses}L"),
        ("AVG WIN",          f"${avg_w:,.0f}"),
        ("AVG LOSS",         f"−${abs(avg_l):,.0f}"),
        ("GROSS P&L",        f"${gross:,.0f}"),
        ("TRADER TAKE (90%)", f"${trader:,.0f}"),
    ]))
    story.append(Spacer(1, 7))

    # ── Rules band ─────────────────────────────────────────────────────────────
    if acct_size == "50K":
        rules = [
            ("MAX TRAILING DD", "$2,000 EOD"),
            ("DAILY LOSS LIMIT", "$1,200"),
            ("MAX CONTRACTS",   "4 MGC"),
            ("CONSISTENCY",     "≤ 40% / day"),
            ("PROFIT SPLIT",    "90 / 10"),
            ("PAYOUT CAP",      "$2,500 / period"),
        ]
    else:
        rules = [
            ("MAX TRAILING DD", "$4,500 EOD"),
            ("DAILY LOSS LIMIT", "$2,500"),
            ("MAX CONTRACTS",   "8 MGC"),
            ("CONSISTENCY",     "≤ 40% / day"),
            ("PROFIT SPLIT",    "90 / 10"),
            ("PAYOUT CAP",      "$4,000 / period"),
        ]
    story.append(rules_table(rules))
    story.append(Spacer(1, 8))

    # ── Trade log label ────────────────────────────────────────────────────────
    story.append(P("TRADE LOG", font="Helvetica-Bold", size=7.5,
                   color=GOLD, space_before=1, space_after=3))

    # ── Trade table (repeats header across pages) ──────────────────────────────
    story.append(trade_table(trades))
    story.append(Spacer(1, 10))

    # ── Totals bar ─────────────────────────────────────────────────────────────
    tdata = [[
        P(f"57 TRADES  ·  48 WINS  ·  9 LOSSES  ·  84.2% WIN RATE",
          font="Helvetica-Bold", size=8, color=WHITE),
        P(f"GROSS  ${gross:,.0f}   ·   TRADER (90%)  ${trader:,.0f}",
          font="Helvetica-Bold", size=8, color=GOLD, align=TA_RIGHT),
    ]]
    tt = Table(tdata, colWidths=[380, 302])
    tt.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), colors.HexColor("#0F0D07")),
        ("BOX",           (0,0),(-1,-1), 0.8, GOLD_DK),
        ("TOPPADDING",    (0,0),(-1,-1), 6),
        ("BOTTOMPADDING", (0,0),(-1,-1), 6),
        ("LEFTPADDING",   (0,0),(-1,-1), 10),
        ("RIGHTPADDING",  (0,0),(-1,-1), 10),
        ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ]))
    story.append(tt)

    doc.build(story, onFirstPage=black_canvas, onLaterPages=black_canvas)
    print(f"✓  {out_path}")


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    base = "/home/user/QuantaraSystems"
    build_pdf(f"{base}/QS1_MGC_50K_Corrected.csv",
              f"{base}/QS1_MGC_50K_LucidPro.pdf", "50K")
    build_pdf(f"{base}/QS1_MGC_100K_Corrected.csv",
              f"{base}/QS1_MGC_100K_LucidPro.pdf", "100K")
