//
//  ListCellView.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

struct ListCellView: View {
    var note: NoteEntity

    private var title: String {
        note.title ?? "New Note"
    }

    private var content: String {
        note.content ?? "No content available"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title)
                .lineLimit(1)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.accent)
            Text(content)
                .lineLimit(1)
                .font(.subheadline)
                .foregroundColor(.accent)
        }
        .padding(.vertical, 8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .cornerRadius(8)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(title), \(content)")
    }
}
