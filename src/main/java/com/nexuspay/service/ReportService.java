package com.nexuspay.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.nexuspay.entity.Merchant;
import com.nexuspay.entity.Order;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReportService {

    public byte[] generateOrdersPdf(Merchant merchant, List<Order> orders) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // Title
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        fontTitle.setColor(new Color(2, 4, 43));
        Paragraph p = new Paragraph("Transaction Report - " + merchant.getBusinessName(), fontTitle);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        Paragraph p2 = new Paragraph("Generated on: " + java.time.LocalDateTime.now(), FontFactory.getFont(FontFactory.HELVETICA, 10));
        p2.setAlignment(Paragraph.ALIGN_CENTER);
        p2.setSpacingAfter(20);
        document.add(p2);

        // Table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {3.5f, 2.0f, 1.5f, 2.0f, 3.0f});
        table.setSpacingBefore(10);

        writeTableHeader(table);
        writeTableData(table, orders);

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(51, 149, 255));
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setColor(Color.WHITE);

        cell.setPhrase(new Phrase("Order ID", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Amount", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Status", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Source", font));
        table.addCell(cell);

        cell.setPhrase(new Phrase("Date", font));
        table.addCell(cell);
    }

    private void writeTableData(PdfPTable table, List<Order> orders) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA, 10);
        for (Order order : orders) {
            table.addCell(new Phrase(order.getOrderId(), font));
            table.addCell(new Phrase("INR " + order.getAmount(), font));
            table.addCell(new Phrase(order.getStatus().toString(), font));
            table.addCell(new Phrase(order.getSource() != null ? order.getSource() : "Dashboard", font));
            table.addCell(new Phrase(order.getCreatedAt().toString().substring(0, 16), font));
        }
    }

    public String generateOrdersCsv(List<Order> orders) {
        StringBuilder csv = new StringBuilder();
        csv.append("Order ID,Amount,Status,Source,Date\n");

        for (Order order : orders) {
            csv.append(order.getOrderId()).append(",");
            csv.append(order.getAmount()).append(",");
            csv.append(order.getStatus()).append(",");
            csv.append(order.getSource() != null ? order.getSource() : "Dashboard").append(",");
            csv.append(order.getCreatedAt()).append("\n");
        }
        return csv.toString();
    }
}
