//
//  TextEditorView.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

struct TextEditorView: View {
    @Binding var text: String
    @State private var debouncer = Debouncer()

    var body: some View {
        UITextViewWrapper(text: $text, font: UIFont.systemFont(ofSize: 16))
            .frame(minHeight: 100, maxHeight: .infinity) // Adjust height as needed
    }
}
