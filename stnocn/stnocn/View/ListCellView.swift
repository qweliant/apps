//
//  ListCellView.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

struct ListCellView: View {
    var note: NoteEntity
    
    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(note.title ?? "New Note")
                .lineLimit(1)
                .font(.title3)
                .fontWeight(.bold)
            Text(note.content ?? "No context available")
                .lineLimit(1)
                .fontWeight(.light)
        }
    }
}
