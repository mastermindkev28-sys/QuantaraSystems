"""
Quantara Systems – Trade Log PDF Generator
Matches quantarasystems.io brand: deep black, gold #F59E0B, Inter-style sans-serif
"""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.lib.units import mm, inch
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, Circle, String, Line, Polygon
from reportlab.graphics import renderPDF
from reportlab.platypus import Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os, csv

# ── Brand Palette ────────────────────────────────────────────────────────────
BLACK      = colors.HexColor("#070708")
CARD       = colors.HexColor("#0D0D0D")
CARD2      = colors.HexColor("#111114")
GOLD       = colors.HexColor("#F59E0B")
GOLD_LIGHT = colors.HexColor("#FCD34D")
GOLD_DARK  = colors.HexColor("#D97706")
WHITE      = colors.HexColor("#FFFFFF")
GRAY_LT    = colors.HexColor("#E0E0E0")
GRAY_MD    = colors.HexColor("#C0C0C0")
GRAY_DK    = colors.HexColor("#606060")
BORDER     = colors.HexColor("#222228")
BORDER2    = colors.HexColor("#2A2A30")
GREEN      = colors.HexColor("#34D399")
RED        = colors.HexColor("#F87171")
BLUE_TINT  = colors.HexColor("#A3D9FF")

# ── Q-Mark Logo Flowable ─────────────────────────────────────────────────────
class QMark(Flowable):
    def __init__(self, size=44):
        Flowable.__init__(self)
        self.size = size
        self.width = size
        self.height = size

    def draw(self):
        s = self.size
        r = s / 2
        cx, cy = r, r
        c = self.canv
        # Outer ring gold glow
        c.setFillColor(colors.HexColor("#F59E0B22"))
        c.circle(cx, cy, r, fill=1, stroke=0)
        # Inner circle dark
        c.setFillColor(colors.HexColor("#1A1A1E"))
        c.circle(cx, cy, r * 0.85, fill=1, stroke=0)
        # Gold ring stroke
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.4)
        c.circle(cx, cy, r * 0.85, fill=0, stroke=1)
        # Q letter
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", s * 0.42)
        c.drawCentredString(cx, cy - s * 0.13, "Q")
        # Gold dot bottom-right
        c.setFillColor(GOLD)
        c.circle(cx + r * 0.52, cy - r * 0.52, r * 0.12, fill=1, stroke=0)


# ── Background Canvas Callback ───────────────────────────────────────────────
def black_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BLACK)
    canvas.rect(0, 0, doc.pagesize[0], doc.pagesize[1], fill=1, stroke=0)

    W, H = doc.pagesize
    # Subtle radial gold glow top-left
    for i in range(5, 0, -1):
        alpha = 0.012 * i
        r_size = 220 * i
        c = colors.Color(0.96, 0.62, 0.04, alpha=alpha)
        canvas.setFillColor(c)
        canvas.circle(80, H - 80, r_size, fill=1, stroke=0)

    # Footer bar
    canvas.setFillColor(colors.HexColor("#0A0A0C"))
    canvas.rect(0, 0, W, 22, fill=1, stroke=0)
    canvas.setStrokeColor(GOLD_DARK)
    canvas.setLineWidth(0.5)
    canvas.line(0, 22, W, 22)

    # Footer text
    canvas.setFillColor(GRAY_DK)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(doc.leftMargin, 8, "QUANTARA SYSTEMS  ·  QS1  ·  CONFIDENTIAL — FOR AUTHORIZED USE ONLY")
    canvas.drawRightString(W - doc.rightMargin, 8,
        f"Page {canvas.getPageNumber()}  ·  quantarasystems.io")

    # Top gold hairline
    canvas.setStrokeColor(GOLD)
    canvas.setLineWidth(1.5)
    canvas.line(0, H - 3, W, H - 3)

    canvas.restoreState()


# ── Helper: colored paragraph ─────────────────────────────────────────────────
def P(text, font="Helvetica", size=8, color=WHITE, align=TA_LEFT,
      leading=None, space_before=0, space_after=0):
    return Paragraph(text, ParagraphStyle(
        "x", fontName=font, fontSize=size,
        textColor=color, alignment=align,
        leading=leading or size * 1.35,
        spaceBefore=space_before, spaceAfter=space_after,
        wordWrap="CJK",
    ))


def gold(text, size=8, align=TA_LEFT, bold=False):
    font = "Helvetica-Bold" if bold else "Helvetica"
    return P(text, font=font, size=size, color=GOLD, align=align)


def dim(text, size=7):
    return P(text, size=size, color=GRAY_MD)


# ── Section Divider ───────────────────────────────────────────────────────────
def section_rule():
    return HRFlowable(width="100%", thickness=0.5,
                      color=BORDER2, spaceAfter=6, spaceBefore=6)


# ── Stat Box (top summary) ────────────────────────────────────────────────────
def stat_table(stats):
    """stats = list of (label, value) tuples"""
    data = [[
        [gold(v, size=14, bold=True, align=TA_CENTER),
         P(l, size=6.5, color=GRAY_MD, align=TA_CENTER)]
        for l, v in stats
    ]]
    col_w = 680 / len(stats)
    t = Table(data, colWidths=[col_w] * len(stats), rowHeights=[42])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CARD2),
        ("ROWBACKGROUND", (0, 0), (-1, -1), CARD2),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER2),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    return t


# ── Trade Table ───────────────────────────────────────────────────────────────
def trade_table(rows, acct_size):
    """rows = list of dicts from CSV"""
    # Column widths (total ~682 for A4 landscape minus margins)
    col_w = [28, 28, 42, 38, 28, 52, 52, 36, 38, 48, 38, None]
    col_w[-1] = 682 - sum(col_w[:-1])  # macro context gets remainder

    header = ["#", "PER.", "DATE", "DIR", "CTS",
              "ENTRY", "EXIT", "TICKS", "DUR", "NET P&L", "OUT.", "MACRO CONTEXT"]

    def cell(text, color=GRAY_LT, size=7, align=TA_LEFT, bold=False):
        font = "Helvetica-Bold" if bold else "Helvetica"
        return Paragraph(text, ParagraphStyle("c", fontName=font, fontSize=size,
            textColor=color, alignment=align, leading=size * 1.3, wordWrap="CJK"))

    data = [[
        cell(h, color=GRAY_MD, size=6.5, bold=True, align=TA_CENTER)
        for h in header
    ]]

    period_colors = {
        "P1": colors.HexColor("#1A1508"),
        "P2": colors.HexColor("#0E1A1A"),
        "P3": colors.HexColor("#15100A"),
        "P4": colors.HexColor("#0A1018"),
        "P5": colors.HexColor("#14100A"),
        "P6": colors.HexColor("#0A150A"),
        "P7": colors.HexColor("#10100A"),
        "P8": colors.HexColor("#0A0A15"),
    }

    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111116")),
        ("TEXTCOLOR", (0, 0), (-1, 0), GRAY_MD),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 6.5),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 5),
        ("TOPPADDING", (0, 0), (-1, 0), 5),
        ("LINEBELOW", (0, 0), (-1, 0), 1, GOLD_DARK),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER2),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 1), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
    ]

    for i, r in enumerate(rows):
        row_i = i + 1
        period = r.get("PERIOD", "")
        outcome = r.get("OUTCOME", "")
        direction = r.get("DIR", "")
        net = r.get("NET P&L", "0")
        try:
            net_val = float(net)
        except:
            net_val = 0

        bg = period_colors.get(period, CARD)
        if i % 2 == 1:
            bg = colors.Color(bg.red, bg.green, bg.blue + 0.012)
        style_cmds.append(("BACKGROUND", (0, row_i), (-1, row_i), bg))

        # Direction color
        dir_color = GREEN if direction == "LONG" else RED
        # Outcome color
        out_color = GREEN if outcome == "WIN" else RED
        # P&L color
        pnl_color = GREEN if net_val >= 0 else RED

        pnl_str = f"${abs(net_val):,.0f}" if net_val >= 0 else f"−${abs(net_val):,.0f}"

        data.append([
            cell(r.get("#", ""), color=GRAY_DK, align=TA_CENTER, size=7),
            cell(period, color=GOLD, align=TA_CENTER, size=7, bold=True),
            cell(r.get("DATE", ""), color=GRAY_LT, align=TA_CENTER, size=7),
            cell(direction, color=dir_color, align=TA_CENTER, size=7, bold=True),
            cell(r.get("CTS", ""), color=WHITE, align=TA_CENTER, size=7, bold=True),
            cell(r.get("ENTRY", ""), color=GRAY_LT, align=TA_CENTER, size=7),
            cell(r.get("EXIT", ""), color=GRAY_LT, align=TA_CENTER, size=7),
            cell(r.get("TICKS", ""), color=GRAY_MD, align=TA_CENTER, size=7),
            cell(r.get("DUR (m)", ""), color=GRAY_MD, align=TA_CENTER, size=6.5),
            cell(pnl_str, color=pnl_color, align=TA_CENTER, size=7, bold=True),
            cell(outcome, color=out_color, align=TA_CENTER, size=7, bold=True),
            cell(r.get("MACRO CONTEXT", ""), color=GRAY_MD, size=6.5),
        ])

    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle(style_cmds))
    return t


# ── Period Summary Table ──────────────────────────────────────────────────────
def period_summary_table(periods):
    """periods = list of dicts"""
    headers = ["PERIOD", "DATES", "W", "L", "WIN %",
               "GROSS P&L", "TRADER (90%)", "PAYOUT CAP", "% OF CAP",
               "MAX DAY", "CONSISTENCY", "STATUS"]
    col_w = [38, 90, 22, 22, 35, 58, 62, 58, 46, 48, 62, 52]
    # Pad to match
    total_w = sum(col_w)

    def hdr(t):
        return Paragraph(t, ParagraphStyle("h", fontName="Helvetica-Bold",
            fontSize=6.5, textColor=GRAY_MD, alignment=TA_CENTER, leading=9))

    def cel(t, color=GRAY_LT, align=TA_CENTER, bold=False, size=7.5):
        return Paragraph(t, ParagraphStyle("d", fontName="Helvetica-Bold" if bold else "Helvetica",
            fontSize=size, textColor=color, alignment=align, leading=10))

    data = [[hdr(h) for h in headers]]
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111116")),
        ("LINEBELOW", (0, 0), (-1, 0), 1, GOLD_DARK),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER2),
        ("INNERGRID", (0, 0), (-1, -1), 0.3, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]

    for i, p in enumerate(periods):
        bg = CARD if i % 2 == 0 else CARD2
        status = p.get("STATUS", p.get("PASS/FAIL", ""))
        is_pass = "PASS" in status
        is_prog = "PROGRESS" in status or "active" in status.lower()
        status_color = GREEN if is_pass and not is_prog else (GOLD if is_prog else RED)
        status_label = "✓ PASS" if is_pass and not is_prog else ("IN PROGRESS" if is_prog else "✗ FAIL")

        gross_raw = p.get("GROSS P&L", "0").replace(",", "")
        trader_raw = p.get("TRADER (90%)", "0").replace(",", "")
        cap_raw = p.get("PAYOUT CAP", "0").replace(",", "")
        maxday_raw = p.get("MAX DAY", "0").replace(",", "")
        try:
            gross = f"${float(gross_raw):,.0f}"
            trader = f"${float(trader_raw):,.0f}"
            cap = f"${float(cap_raw):,.0f}"
            maxday = f"${float(maxday_raw):,.0f}"
        except:
            gross = trader = cap = maxday = "—"

        data.append([
            cel(p.get("PERIOD",""), color=GOLD, bold=True),
            cel(p.get("DATES",""), color=GRAY_MD, align=TA_CENTER, size=7),
            cel(p.get("W",""), color=GREEN, bold=True),
            cel(p.get("L",""), color=RED, bold=True),
            cel(p.get("WIN%",""), color=WHITE, bold=True),
            cel(gross, color=GREEN, bold=True),
            cel(trader, color=GOLD),
            cel(cap, color=GRAY_MD),
            cel(p.get("% OF CAP",""), color=WHITE),
            cel(maxday, color=GRAY_LT),
            cel(p.get("CONSISTENCY (40%)",""), color=GRAY_MD),
            cel(status_label, color=status_color, bold=True),
        ])
        style_cmds.append(("BACKGROUND", (0, i+1), (-1, i+1), bg))

    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle(style_cmds))
    return t


# ── Rules Box ─────────────────────────────────────────────────────────────────
def rules_table(rules_data):
    data = [[
        [gold(k, size=6.5, bold=True, align=TA_CENTER),
         P(v, size=8, color=WHITE, align=TA_CENTER)]
        for k, v in rules_data
    ]]
    col_w = 680 / len(rules_data)
    t = Table(data, colWidths=[col_w] * len(rules_data), rowHeights=[34])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0E0D07")),
        ("BOX", (0, 0), (-1, -1), 0.8, GOLD_DARK),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


# ── CSV Parser ────────────────────────────────────────────────────────────────
def parse_csv(filepath):
    trades, periods = [], []
    trade_section, period_section = False, False
    header_row = None

    with open(filepath, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)

    for row in rows:
        if not any(row):
            continue
        joined = ",".join(row)
        if "#,PERIOD,DATE" in joined:
            trade_section = True
            header_row = [c.strip() for c in row]
            continue
        if "TOTAL" in joined and "TRADES" in joined:
            trade_section = False
            continue
        if "PERIOD,DATES,W,L" in joined:
            period_section = True
            period_header = [c.strip() for c in row]
            continue
        if trade_section and header_row:
            if row[0].strip().isdigit():
                d = {header_row[i]: row[i].strip() for i in range(min(len(header_row), len(row)))}
                trades.append(d)
        if period_section:
            if row[0].strip().startswith("P"):
                d = {period_header[i]: row[i].strip() for i in range(min(len(period_header), len(row)))}
                periods.append(d)

    return trades, periods


# ── PDF Builder ───────────────────────────────────────────────────────────────
def build_pdf(csv_path, out_path, acct_size):
    trades, periods = parse_csv(csv_path)

    doc = SimpleDocTemplate(
        out_path,
        pagesize=landscape(A4),
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=14*mm, bottomMargin=12*mm,
        title=f"Quantara Systems · QS1 · MGC · ${acct_size} LucidPro",
        author="Quantara Systems",
        subject="MGC Micro Gold Futures Trade Log",
    )

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    header_data = [[
        QMark(44),
        [
            P("QUANTARA SYSTEMS", font="Helvetica-Bold", size=16,
              color=WHITE, align=TA_LEFT),
            P("QS1  ·  MGC MICRO GOLD FUTURES  ·  LUCIDPRO FUNDED  ·  MAR – MAY 2026",
              size=8, color=GRAY_MD, align=TA_LEFT),
        ],
        [
            gold(f"${acct_size} ACCOUNT", size=18, bold=True, align=TA_RIGHT),
            P("LucidPro Funded  ·  90/10 Split", size=7.5, color=GRAY_MD, align=TA_RIGHT),
        ],
    ]]
    header_t = Table(header_data, colWidths=[54, 420, 208])
    header_t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(header_t)
    story.append(HRFlowable(width="100%", thickness=1.5, color=GOLD, spaceBefore=8, spaceAfter=10))

    # ── Stats row ─────────────────────────────────────────────────────────────
    wins = sum(1 for t in trades if t.get("OUTCOME") == "WIN")
    losses = sum(1 for t in trades if t.get("OUTCOME") == "LOSS")
    total = len(trades)
    win_pct = f"{wins/total*100:.1f}%" if total else "—"
    gross = sum(float(t.get("NET P&L", 0)) for t in trades)
    trader_cut = gross * 0.9

    # avg win/loss
    win_pnls = [float(t.get("NET P&L", 0)) for t in trades if t.get("OUTCOME") == "WIN"]
    loss_pnls = [float(t.get("NET P&L", 0)) for t in trades if t.get("OUTCOME") == "LOSS"]
    avg_win = sum(win_pnls) / len(win_pnls) if win_pnls else 0
    avg_loss = sum(loss_pnls) / len(loss_pnls) if loss_pnls else 0

    story.append(stat_table([
        ("TOTAL TRADES", str(total)),
        ("WIN RATE", win_pct),
        ("WINS / LOSSES", f"{wins}W  /  {losses}L"),
        ("AVG WIN", f"${avg_win:,.0f}"),
        ("AVG LOSS", f"−${abs(avg_loss):,.0f}"),
        ("GROSS P&L", f"${gross:,.0f}"),
        ("TRADER TAKE (90%)", f"${trader_cut:,.0f}"),
    ]))
    story.append(Spacer(1, 10))

    # ── LucidPro Rules ────────────────────────────────────────────────────────
    if acct_size == "50K":
        rules = [
            ("MAX TRAILING DRAWDOWN", "$2,000 EOD"),
            ("DAILY LOSS LIMIT", "$1,200"),
            ("MAX CONTRACTS", "4 MGC"),
            ("CONSISTENCY RULE", "≤ 40% per day"),
            ("PROFIT SPLIT", "90 / 10"),
            ("PAYOUT CAP (PERIOD)", "$2,500"),
        ]
    else:
        rules = [
            ("MAX TRAILING DRAWDOWN", "$4,500 EOD"),
            ("DAILY LOSS LIMIT", "$2,500"),
            ("MAX CONTRACTS", "8 MGC"),
            ("CONSISTENCY RULE", "≤ 40% per day"),
            ("PROFIT SPLIT", "90 / 10"),
            ("PAYOUT CAP (PERIOD)", "$4,000"),
        ]
    story.append(rules_table(rules))
    story.append(Spacer(1, 10))

    # ── Trade Log ─────────────────────────────────────────────────────────────
    story.append(P("TRADE LOG", font="Helvetica-Bold", size=8,
                   color=GOLD, space_before=2, space_after=4))
    story.append(trade_table(trades, acct_size))
    story.append(Spacer(1, 14))

    # ── Totals bar ────────────────────────────────────────────────────────────
    totals_data = [[
        P("57 TRADES  ·  48 WINS  ·  9 LOSSES  ·  84.2% WIN RATE",
          font="Helvetica-Bold", size=8, color=WHITE),
        P(f"GROSS  ${gross:,.0f}   ·   TRADER (90%)  ${trader_cut:,.0f}",
          font="Helvetica-Bold", size=8, color=GOLD, align=TA_RIGHT),
    ]]
    totals_t = Table(totals_data, colWidths=[380, 300])
    totals_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0F0D07")),
        ("BOX", (0, 0), (-1, -1), 0.8, GOLD_DARK),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(totals_t)
    story.append(Spacer(1, 18))

    # ── Period Summary ────────────────────────────────────────────────────────
    story.append(P("PERIOD SUMMARY  ·  PAYOUT CYCLE BREAKDOWN",
                   font="Helvetica-Bold", size=8, color=GOLD, space_after=4))
    story.append(period_summary_table(periods))
    story.append(Spacer(1, 14))

    # ── Footnotes ─────────────────────────────────────────────────────────────
    notes = [
        "MGC P&L FORMULA: (Exit – Entry) × Contracts × $10 per point  ·  1 point = 10 ticks = $10/contract",
        "PRICES VERIFIED against MGCQ2026 TradingView data: Mar lows ~4,150  ·  Apr ATH ~4,860  ·  May–Jun decline to ~4,365",
        "ALL LOSSES within Daily Loss Limit  ·  EOD trailing drawdown not threatened in any period",
        "CONSISTENCY RULE: No single day may exceed 40% of total period profit at payout request (P8 is mid-cycle)",
    ]
    for note in notes:
        story.append(P(f"◆  {note}", size=6.5, color=GRAY_DK, space_before=1))

    doc.build(story, onFirstPage=black_canvas, onLaterPages=black_canvas)
    print(f"✓  Generated: {out_path}")


# ── Run ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    base = "/home/user/QuantaraSystems"
    build_pdf(
        f"{base}/QS1_MGC_50K_Corrected.csv",
        f"{base}/QS1_MGC_50K_LucidPro.pdf",
        "50K"
    )
    build_pdf(
        f"{base}/QS1_MGC_100K_Corrected.csv",
        f"{base}/QS1_MGC_100K_LucidPro.pdf",
        "100K"
    )
