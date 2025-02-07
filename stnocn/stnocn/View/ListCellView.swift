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
        note.title ?? "Whats in a Name"
    }

    private var content: String {
        note.content ?? "You aint write shit huh"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title)
                .lineLimit(1)
                .font(.title3)
                .fontWeight(.bold)
                .foregroundColor(.pink)
            Text(content)
                .lineLimit(1)
                .font(.subheadline)
                .foregroundColor(.accentColor)
        }
        .padding(.vertical, 8)
        .frame(maxWidth: .infinity, alignment: .leading)
        .cornerRadius(8)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(title), \(content)")
    }
}
