//
//  Untitled.swift
//  stnocn
//
//  Created by qwelian on 1/30/25.
//

import SwiftUI

struct EditNotesView: View {
    
    @EnvironmentObject var vm: NotesViewModel
    
    var note: NoteEntity
    
    @State private var title: String
    @State private var content: String
    @State private var debouncer = Debouncer()

    @FocusState private var contentEditorInFocus: Bool
    
    init(note: NoteEntity) {
        self.note = note
        _title = State(initialValue: note.title ?? "")
        _content = State(initialValue: note.content ?? "")
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            TextField("Whats in a Name", text: $title, axis: .vertical)
                .font(.title.bold())
                .foregroundColor(.pink)
                .submitLabel(.next)
                .onChange(of: title) { _, _ in
                    debouncer.debounce(delay: 0.5) {
                        vm.updateNote(note, title: title, content: content)
                    }
                }
            
            
            TextEditorView(text: $content)
                .onChange(of: content) { _, _ in
                    vm.updateNote(note, title: title, content: content)
                }
        }
        .padding(10)
        .background(Color.accent)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                   Spacer()
                   Button(action: {
                       hideKeyboard()
                       saveChanges()
                   }) {
                       Text("Donezo")
                           .font(.headline)
                           .foregroundColor(.accent)
                   }
               }
        }
        .onAppear {
            title = note.title ?? ""
            content = note.content ?? ""
        }
        .onChange(of: note) { oldNote, newNote in
            title = newNote.title ?? ""
            content = newNote.content ?? ""
        }
    }

    private func debounceSave() {
        debouncer.debounce(delay: 4.00) {
            saveChanges()
        }
    }
    
    private func saveChanges() {
        vm.updateNote(note, title: title, content: content)
    }
}

