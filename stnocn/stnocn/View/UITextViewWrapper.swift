//
//  UITextViewWrapper.swift
//  stnocn
//
//  Created by qwelian on 2/6/25.
//

import SwiftUI
import UIKit

struct UITextViewWrapper: UIViewRepresentable {
    @Binding var text: String
    var font: UIFont = UIFont.preferredFont(forTextStyle: .body)
    var onEditingChanged: (() -> Void)? = nil
    
    func makeCoordinator() -> Coordinator {
        Coordinator(text: $text, onEditingChanged: onEditingChanged)
    }

    func makeUIView(context: Context) -> UITextView {
        let textView = UITextView()
        textView.font = font
        textView.backgroundColor = .clear
        textView.delegate = context.coordinator
        return textView
    }

    func updateUIView(_ uiView: UITextView, context: Context) {
        if uiView.text != text {
            uiView.text = text
        }
    }

    class Coordinator: NSObject, UITextViewDelegate {
        @Binding var text: String
        var onEditingChanged: (() -> Void)?

        init(text: Binding<String>, onEditingChanged: (() -> Void)? = nil) {
            _text = text
            self.onEditingChanged = onEditingChanged
        }

        func textViewDidChange(_ textView: UITextView) {
            text = textView.text
            onEditingChanged?()
        }
    }
}
